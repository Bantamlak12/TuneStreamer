const userRequireAuth = (req, res, next) => {
  if (!req.session.isUserAuthenticated) {
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

module.exports = { userRequireAuth, adminRequireAuth };
