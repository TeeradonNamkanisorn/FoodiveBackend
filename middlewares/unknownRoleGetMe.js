const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    if (req.originalUrl.includes('getMe')) {
      if (!req.headers.authorization) return;
      if (req.headers.authorization?.split(' ')[1] === 'null') return next();
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);
      if (
        decoded.role === 'restaurant' ||
        decoded.role === 'customer' ||
        decoded.role === 'driver'
      ) {
        return res.redirect(`/${decoded.role}/getMe`);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
