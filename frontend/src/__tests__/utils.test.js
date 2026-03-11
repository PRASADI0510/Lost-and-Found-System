/**
 * Comprehensive Test Suite - Utilities & Integration Tests
 * Tests for: Matching Algorithm, Export Utilities, Notifications, RBAC, Claim Workflow
 */

import { calculateMatchScore, findMatches, getConfidenceLabel, getConfidenceColor } from '../utils/matchingAlgorithm';
import { exportToCSV, exportToPDF, calculateAnalytics } from '../utils/exportUtils';

// ============================================================================
// MATCHING ALGORITHM TESTS
// ============================================================================
describe('Matching Algorithm', () => {
  const baseLost = {
    id: 'lost1', type: 'lost', title: 'Black Wallet', description: 'Leather black wallet with student ID',
    category: 'wallet', location: 'Library 1st Floor', date: '2025-06-10', status: 'open'
  };
  const baseFound = {
    id: 'found1', type: 'found', title: 'Black Leather Wallet', description: 'Found a black leather wallet with ID card inside',
    category: 'wallet', location: 'Library 1st Floor', date: '2025-06-11', status: 'open'
  };

  test('TC31: Returns 0 score when categories do not match', () => {
    const found = { ...baseFound, category: 'electronics' };
    const result = calculateMatchScore(baseLost, found);
    expect(result.score).toBe(0);
    expect(result.reason).toBe('Category mismatch');
  });

  test('TC32: Returns high score for identical items', () => {
    const result = calculateMatchScore(baseLost, baseFound);
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.breakdown.category).toBe(100);
  });

  test('TC33: Location score is 100 for exact match', () => {
    const result = calculateMatchScore(baseLost, baseFound);
    expect(result.breakdown.location).toBe(100);
  });

  test('TC34: Location score is 0 when no keyword overlap', () => {
    const lost = { ...baseLost, location: 'Cafeteria' };
    const found = { ...baseFound, location: 'Parking Area' };
    const result = calculateMatchScore(lost, found);
    expect(result.breakdown.location).toBe(0);
  });

  test('TC35: Date score is 100 when found within 3 days of lost', () => {
    const result = calculateMatchScore(baseLost, baseFound);
    expect(result.breakdown.date).toBe(100);
  });

  test('TC36: Date score is 0 when found before lost by more than 1 day', () => {
    const found = { ...baseFound, date: '2025-06-01' };
    const result = calculateMatchScore(baseLost, found);
    expect(result.breakdown.date).toBe(0);
  });

  test('TC37: Description score requires at least 2 keyword matches', () => {
    const lost = { ...baseLost, description: 'unique item xyz' };
    const found = { ...baseFound, description: 'completely different thing abc' };
    const result = calculateMatchScore(lost, found);
    expect(result.breakdown.description).toBeLessThan(50);
  });

  test('TC38: findMatches returns sorted results above threshold', () => {
    const candidates = [
      { ...baseFound, id: 'f1' },
      { ...baseFound, id: 'f2', category: 'electronics' },
      { ...baseFound, id: 'f3', location: 'Parking Area', description: 'random object' }
    ];
    const matches = findMatches(baseLost, candidates, 40);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].matchScore).toBeGreaterThanOrEqual(matches[matches.length - 1].matchScore);
  });

  test('TC39: findMatches excludes items with same id', () => {
    const candidates = [{ ...baseFound, id: 'lost1' }];
    const matches = findMatches(baseLost, candidates, 0);
    expect(matches.length).toBe(0);
  });

  test('TC40: findMatches excludes non-open items', () => {
    const candidates = [{ ...baseFound, status: 'claimed' }];
    const matches = findMatches(baseLost, candidates, 0);
    expect(matches.length).toBe(0);
  });

  test('TC41: getConfidenceLabel returns correct labels', () => {
    expect(getConfidenceLabel(85)).toBe('High');
    expect(getConfidenceLabel(65)).toBe('Medium');
    expect(getConfidenceLabel(45)).toBe('Low');
    expect(getConfidenceLabel(20)).toBe('Very Low');
  });

  test('TC42: getConfidenceColor returns correct colors', () => {
    expect(getConfidenceColor(85)).toBe('#2E7D32');
    expect(getConfidenceColor(65)).toBe('#E65100');
    expect(getConfidenceColor(45)).toBe('#F57F17');
    expect(getConfidenceColor(20)).toBe('#9E9E9E');
  });

  test('TC43: Handles missing fields gracefully', () => {
    const lost = { id: '1', type: 'lost', category: 'wallet' };
    const found = { id: '2', type: 'found', category: 'wallet' };
    const result = calculateMatchScore(lost, found);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('TC44: Date score is 50 (neutral) when dates missing', () => {
    const lost = { ...baseLost, date: '' };
    const found = { ...baseFound, date: '' };
    const result = calculateMatchScore(lost, found);
    expect(result.breakdown.date).toBe(50);
  });
});

// ============================================================================
// EXPORT UTILITIES TESTS
// ============================================================================
describe('Export Utilities', () => {
  test('TC45: exportToCSV does nothing with empty data', () => {
    expect(() => exportToCSV([], 'test', [{ key: 'a', label: 'A' }])).not.toThrow();
    expect(() => exportToCSV(null, 'test', [{ key: 'a', label: 'A' }])).not.toThrow();
  });

  test('TC46: exportToCSV generates CSV and triggers download', () => {
    const createObjectURL = jest.fn(() => 'blob:test');
    const revokeObjectURL = jest.fn();
    const clickMock = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    jest.spyOn(document, 'createElement').mockReturnValueOnce({
      set href(v) { this._href = v; },
      get href() { return this._href; },
      set download(v) { this._download = v; },
      get download() { return this._download; },
      click: clickMock
    });

    const data = [{ name: 'Test', value: 42 }];
    const columns = [{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }];
    exportToCSV(data, 'report', columns);

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  test('TC47: exportToPDF does nothing with empty data', () => {
    expect(() => exportToPDF('Test', [], [{ key: 'a', label: 'A' }])).not.toThrow();
    expect(() => exportToPDF('Test', null, [{ key: 'a', label: 'A' }])).not.toThrow();
  });

  test('TC48: exportToPDF opens print window with content', () => {
    const mockWindow = {
      document: { write: jest.fn(), close: jest.fn() },
      set onload(fn) { this._onload = fn; },
      get onload() { return this._onload; },
      print: jest.fn()
    };
    jest.spyOn(window, 'open').mockReturnValue(mockWindow);

    const data = [{ name: 'Test', value: 42 }];
    const columns = [{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }];
    exportToPDF('Test Report', data, columns);

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(mockWindow.document.write).toHaveBeenCalled();
    const html = mockWindow.document.write.mock.calls[0][0];
    expect(html).toContain('Test Report');
    expect(html).toContain('Test');
    jest.restoreAllMocks();
  });

  test('TC49: exportToCSV handles Firestore timestamp objects', () => {
    const createObjectURL = jest.fn(() => 'blob:test');
    const revokeObjectURL = jest.fn();
    const clickMock = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    jest.spyOn(document, 'createElement').mockReturnValueOnce({
      set href(v) { this._href = v; },
      get href() { return this._href; },
      set download(v) { this._download = v; },
      get download() { return this._download; },
      click: clickMock
    });

    const data = [{ name: 'Test', date: { seconds: 1700000000 } }];
    const columns = [{ key: 'name', label: 'Name' }, { key: 'date', label: 'Date' }];
    expect(() => exportToCSV(data, 'report', columns)).not.toThrow();
    jest.restoreAllMocks();
  });
});

// ============================================================================
// ANALYTICS TESTS
// ============================================================================
describe('Analytics Calculations', () => {
  const sampleItems = [
    { type: 'lost', category: 'wallet', location: 'Library', date: '2025-06-10', status: 'open' },
    { type: 'lost', category: 'electronics', location: 'Cafeteria', date: '2025-06-15', status: 'claimed' },
    { type: 'found', category: 'wallet', location: 'Library', date: '2025-07-01', status: 'open' },
    { type: 'found', category: 'keys', location: 'Parking', date: '2025-07-05', status: 'open' },
  ];

  const sampleClaims = [
    { status: 'pending' },
    { status: 'approved' },
    { status: 'denied' },
    { status: 'pending' },
  ];

  test('TC50: Counts items by type correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.byType.lost).toBe(2);
    expect(analytics.byType.found).toBe(2);
  });

  test('TC51: Counts items by category correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.byCategory.wallet).toBe(2);
    expect(analytics.byCategory.electronics).toBe(1);
    expect(analytics.byCategory.keys).toBe(1);
  });

  test('TC52: Counts items by status correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.byStatus.open).toBe(3);
    expect(analytics.byStatus.claimed).toBe(1);
  });

  test('TC53: Counts items by location correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.byLocation['Library']).toBe(2);
    expect(analytics.byLocation['Cafeteria']).toBe(1);
  });

  test('TC54: Groups items by month correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.byMonth['2025-06']).toBe(2);
    expect(analytics.byMonth['2025-07']).toBe(2);
  });

  test('TC55: Calculates claim statistics correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.claimStats.total).toBe(4);
    expect(analytics.claimStats.pending).toBe(2);
    expect(analytics.claimStats.approved).toBe(1);
    expect(analytics.claimStats.denied).toBe(1);
  });

  test('TC56: Calculates recovery rate correctly', () => {
    const analytics = calculateAnalytics(sampleItems, sampleClaims);
    expect(analytics.recoveryRate).toBe(25); // 1 claimed out of 4
  });

  test('TC57: Handles empty items array', () => {
    const analytics = calculateAnalytics([], []);
    expect(analytics.byType.lost).toBe(0);
    expect(analytics.byType.found).toBe(0);
    expect(analytics.recoveryRate).toBe(0);
  });

  test('TC58: Handles null claims', () => {
    const analytics = calculateAnalytics(sampleItems, null);
    expect(analytics.claimStats.total).toBe(0);
  });

  test('TC59: Handles items without date field', () => {
    const items = [{ type: 'lost', category: 'wallet', location: 'Library', status: 'open' }];
    const analytics = calculateAnalytics(items, []);
    expect(Object.keys(analytics.byMonth).length).toBe(0);
  });

  test('TC60: Handles items without category/location', () => {
    const items = [{ type: 'lost', status: 'open' }];
    const analytics = calculateAnalytics(items, []);
    expect(analytics.byCategory.unknown).toBe(1);
    expect(analytics.byLocation.unknown).toBe(1);
  });
});
