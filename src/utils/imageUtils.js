/**
 * Shared image utilities for binary image handling.
 * Centralizes MIME type detection from buffer signatures and
 * standard image response sending — previously duplicated across
 * game-media, carousel-media, promo-media, and avatar routes.
 */

/**
 * Detect MIME type from the first 4 bytes of a binary buffer.
 * Falls back to 'image/png' if signature is unrecognized.
 * @param {Buffer} buffer - The image binary data
 * @returns {string} MIME type string
 */
export function detectMimeType(buffer) {
  const sig = buffer.slice(0, 4).toString('hex');

  if (sig.startsWith('8950')) return 'image/png';
  if (sig.startsWith('ffd8')) return 'image/jpeg';
  if (sig.startsWith('4746')) return 'image/gif';
  if (sig.startsWith('5249')) return 'image/webp';

  return 'image/png';
}

/**
 * Send binary image data as an HTTP response with correct MIME type
 * and cache-control headers.
 * @param {import('express').Response} res - Express response object
 * @param {Buffer|Uint8Array} data - Raw image data (Buffer or Bytes from Prisma)
 */
export function sendImageResponse(res, data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const mime = detectMimeType(buffer);

  res.set('Content-Type', mime);
  res.set('Cache-Control', 'no-cache, must-revalidate');
  res.send(buffer);
}
