const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ auth: false, message: "Forbidden" });

    if (!user.id_user)
      return res.status(403).json({ auth: false, message: "Anda bukan user" });
    const currentTime = Math.floor(Date.now() / 100000); // Waktu saat ini dalam detik
    if (user.exp && user.exp < currentTime)
      return res.status(403).json({ auth: false, message: "Token expired" });

    req.user = user;
    next();
  });
};
