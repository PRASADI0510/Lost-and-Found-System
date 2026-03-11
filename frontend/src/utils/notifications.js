/**
 * Notification helpers for the Lost & Found System.
 * Creates in-app notifications and (when Cloud Functions are deployed)
 * triggers email notifications.
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create an in-app notification for a user.
 */
export async function createNotification({ userId, title, message, type, itemId }) {
  return addDoc(collection(db, 'notifications'), {
    userId,
    title,
    message,
    type: type || 'system',
    read: false,
    itemId: itemId || null,
    createdAt: serverTimestamp()
  });
}

/**
 * Notify item poster about a potential match.
 */
export async function notifyMatch(posterUserId, matchedItem, score) {
  const confidence = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  return createNotification({
    userId: posterUserId,
    title: 'Potential Match Found!',
    message: `A ${confidence}-confidence match was found for "${matchedItem.title}" (${score}% match).`,
    type: 'match',
    itemId: matchedItem.id
  });
}

/**
 * Notify user about claim status change.
 */
export async function notifyClaimUpdate(userId, itemTitle, status, reviewNote) {
  return createNotification({
    userId,
    title: `Claim ${status === 'approved' ? 'Approved' : 'Denied'}`,
    message: `Your claim for "${itemTitle}" has been ${status}.${reviewNote ? ' Note: ' + reviewNote : ''}`,
    type: 'claim_update'
  });
}

/**
 * Notify item poster about a new claim.
 */
export async function notifyNewClaim(posterUserId, claimantName, itemTitle, itemId) {
  return createNotification({
    userId: posterUserId,
    title: 'New Claim on Your Item',
    message: `${claimantName} has claimed "${itemTitle}".`,
    type: 'claim_update',
    itemId
  });
}

/**
 * Create an email notification document that Cloud Functions will process.
 * This writes to a `mail` collection that Firebase Extensions (Trigger Email)
 * or custom Cloud Functions can pick up and send via SMTP.
 */
export async function queueEmail({ to, subject, body }) {
  try {
    return await addDoc(collection(db, 'mail'), {
      to,
      message: {
        subject,
        html: body
      },
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Error queuing email:', err);
  }
}

/**
 * Send match notification email.
 */
export async function sendMatchEmail(toEmail, itemTitle, matchTitle, score) {
  return queueEmail({
    to: toEmail,
    subject: `[OUSL Lost & Found] Potential Match Found for "${itemTitle}"`,
    body: `
      <h2>Lost & Found Management System</h2>
      <p>A potential match has been found for your item "<strong>${itemTitle}</strong>".</p>
      <p><strong>Matched Item:</strong> ${matchTitle}</p>
      <p><strong>Match Confidence:</strong> ${score}%</p>
      <p>Please log in to the system to review the match and initiate a claim if applicable.</p>
      <p><a href="https://lostandfound-8c504.web.app/found-items">View Found Items</a></p>
      <hr/>
      <p style="color:#999;font-size:12px;">Open University of Sri Lanka - Lost & Found Management System</p>
    `
  });
}

/**
 * Send claim status email.
 */
export async function sendClaimStatusEmail(toEmail, itemTitle, status, reviewNote) {
  return queueEmail({
    to: toEmail,
    subject: `[OUSL Lost & Found] Claim ${status === 'approved' ? 'Approved' : 'Denied'}: "${itemTitle}"`,
    body: `
      <h2>Lost & Found Management System</h2>
      <p>Your claim for "<strong>${itemTitle}</strong>" has been <strong>${status}</strong>.</p>
      ${reviewNote ? `<p><strong>Review Note:</strong> ${reviewNote}</p>` : ''}
      ${status === 'approved'
        ? '<p>Please visit the Security Office to collect your item. Bring a valid ID for verification.</p>'
        : '<p>If you believe this decision was made in error, please contact the Security Office.</p>'
      }
      <p><a href="https://lostandfound-8c504.web.app/my-claims">View My Claims</a></p>
      <hr/>
      <p style="color:#999;font-size:12px;">Open University of Sri Lanka - Lost & Found Management System</p>
    `
  });
}
