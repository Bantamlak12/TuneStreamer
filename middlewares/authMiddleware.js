const requireAuth = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).redirect('/signin');
  }
  next();
};

module.exports = requireAuth;
