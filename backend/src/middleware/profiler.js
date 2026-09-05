/**
 * Lightweight Development & Staging Request Profiler Middleware.
 * Logs response times, payload sizes, and triggers warnings for slow requests (> SLOW_API_THRESHOLD_MS).
 */

const SLOW_API_THRESHOLD_MS = parseInt(process.env.SLOW_API_THRESHOLD_MS || '300', 10);

module.exports = function requestProfiler(req, res, next) {
  const startHrTime = process.hrtime.bigint();
  let responseSize = 0;

  // Intercept res.write and res.end to track payload size
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, ...args) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }
    return originalWrite.apply(res, [chunk, ...args]);
  };

  res.end = function (chunk, ...args) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }
    return originalEnd.apply(res, [chunk, ...args]);
  };

  res.on('finish', () => {
    const endHrTime = process.hrtime.bigint();
    const durationMs = Number(endHrTime - startHrTime) / 1e6;
    const formattedSize = responseSize > 1024 
      ? `${(responseSize / 1024).toFixed(1)} KB` 
      : `${responseSize} B`;

    const isSlow = durationMs >= SLOW_API_THRESHOLD_MS;
    const logPrefix = isSlow ? '⚠️ [SLOW API WARNING]' : '⚡ [Profiler]';

    if (process.env.NODE_ENV !== 'production' || isSlow) {
      console.log(
        `${logPrefix} ${req.method} ${req.originalUrl || req.url} | Status: ${res.statusCode} | Time: ${durationMs.toFixed(1)}ms | Payload: ${formattedSize}`
      );
    }
  });

  next();
};
