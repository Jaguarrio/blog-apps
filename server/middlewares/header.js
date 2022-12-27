const setHeaderJWT = (req, res, next) => {
  req.headers["authorization"] = `Bearer ${req.cookies.token}`;
  next();
};

module.exports = { setHeaderJWT };
