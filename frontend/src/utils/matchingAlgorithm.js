/**
 * Automated Matching Algorithm for Lost & Found items
 * Compares lost items against found items to identify potential matches.
 *
 * Matching Criteria (from SRS):
 * - Category: exact match required
 * - Location: keyword overlap
 * - Date: found date >= lost date
 * - Description: keyword overlap (minimum 2 matching terms)
 * - Confidence scoring (0-100)
 */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or',
  'is', 'was', 'it', 'my', 'i', 'with', 'has', 'had', 'from', 'near',
  'around', 'about', 'this', 'that', 'very', 'been', 'have', 'some',
  'lost', 'found', 'pm', 'am', 'contains'
]);

function extractKeywords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function keywordOverlap(textA, textB) {
  const wordsA = new Set(extractKeywords(textA));
  const wordsB = new Set(extractKeywords(textB));
  let matches = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) matches++;
  }
  const total = Math.max(wordsA.size, wordsB.size, 1);
  return { matches, ratio: matches / total };
}

function locationScore(locA, locB) {
  if (!locA || !locB) return 0;
  const a = locA.toLowerCase().trim();
  const b = locB.toLowerCase().trim();
  if (a === b) return 100;

  const { matches, ratio } = keywordOverlap(a, b);
  if (matches >= 1) return Math.round(ratio * 80 + 20);
  return 0;
}

function dateScore(lostDate, foundDate) {
  if (!lostDate || !foundDate) return 50; // neutral if missing
  const lost = new Date(lostDate);
  const found = new Date(foundDate);
  if (isNaN(lost.getTime()) || isNaN(found.getTime())) return 50;

  const diffDays = (found - lost) / (1000 * 60 * 60 * 24);

  // Found before lost = unlikely match
  if (diffDays < -1) return 0;
  // Same day or within 3 days = strong match
  if (diffDays >= -1 && diffDays <= 3) return 100;
  // Within a week
  if (diffDays <= 7) return 70;
  // Within 2 weeks
  if (diffDays <= 14) return 40;
  // Older
  return 10;
}

/**
 * Calculate match confidence between a lost item and a found item.
 * @returns {{ score: number, breakdown: object }} confidence 0-100
 */
export function calculateMatchScore(lostItem, foundItem) {
  // Category must match (required)
  const catA = (lostItem.category || '').toLowerCase().trim();
  const catB = (foundItem.category || '').toLowerCase().trim();
  if (!catA || !catB || catA !== catB) {
    return { score: 0, breakdown: { category: 0, location: 0, date: 0, description: 0 }, reason: 'Category mismatch' };
  }

  const catScore = 100; // exact match

  const locSc = locationScore(lostItem.location, foundItem.location);

  const dateSc = dateScore(lostItem.date, foundItem.date);

  const descOverlap = keywordOverlap(
    `${lostItem.title} ${lostItem.description}`,
    `${foundItem.title} ${foundItem.description}`
  );
  const descSc = descOverlap.matches >= 2
    ? Math.min(100, Math.round(descOverlap.ratio * 100 + 20))
    : Math.round(descOverlap.ratio * 40);

  // Weighted average
  const weights = { category: 0.25, location: 0.20, date: 0.20, description: 0.35 };
  const totalScore = Math.round(
    catScore * weights.category +
    locSc * weights.location +
    dateSc * weights.date +
    descSc * weights.description
  );

  return {
    score: totalScore,
    breakdown: {
      category: catScore,
      location: locSc,
      date: dateSc,
      description: descSc
    }
  };
}

/**
 * Find matches for a given item against a list of opposite-type items.
 * @param {object} item - The item to find matches for
 * @param {array} candidates - Array of opposite-type items
 * @param {number} threshold - Minimum score to include (default 40)
 * @returns {array} Sorted matches with scores
 */
export function findMatches(item, candidates, threshold = 40) {
  const isLost = item.type === 'lost';

  return candidates
    .filter((c) => c.status === 'open' && c.id !== item.id)
    .map((candidate) => {
      const { score, breakdown } = isLost
        ? calculateMatchScore(item, candidate)
        : calculateMatchScore(candidate, item);

      return { ...candidate, matchScore: score, matchBreakdown: breakdown };
    })
    .filter((m) => m.matchScore >= threshold)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get confidence label from score
 */
export function getConfidenceLabel(score) {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'Low';
  return 'Very Low';
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(score) {
  if (score >= 80) return '#2E7D32';
  if (score >= 60) return '#E65100';
  if (score >= 40) return '#F57F17';
  return '#9E9E9E';
}
