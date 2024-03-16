const useRequireAuth = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).redirect('/signin');
  }
  next();
};

const adminRequireAuth = (req, res, next) => {
  if (!req.session.isAdminAuthenticated) {
    return res.status(401).redirect('/signin');
  }
  next();
};

module.exports = { useRequireAuth, adminRequireAuth };
