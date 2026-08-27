/**
 * Middleware to verify Admin PIN / credentials
 * Protects analytics, Excel exports, and record deletions.
 */
const requireAdmin = (req, res, next) => {
  const configuredPin = process.env.ADMIN_PIN || 'porkadmin2026';
  
  // Accept PIN from header, query param (for direct CSV export link), or auth header
  const providedPin = req.headers['x-admin-pin'] || 
                      req.query.pin || 
                      (req.headers['authorization'] ? req.headers['authorization'].replace(/^Bearer\s+/i, '') : '');

  if (!providedPin || providedPin.trim() !== configuredPin.trim()) {
    return res.status(403).json({
      success: false,
      message: 'Admin authorization required. Please provide a valid Admin PIN.'
    });
  }

  next();
};

module.exports = {
  requireAdmin
};
