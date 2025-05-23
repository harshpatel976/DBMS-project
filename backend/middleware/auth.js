exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  
  exports.isStaff = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };