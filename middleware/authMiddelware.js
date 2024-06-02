const jwt = require('jsonwebtoken');
const secretKey = 'tr4v3g0'; // Ganti dengan kunci rahasia Anda

exports.verifyToken = function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token tidak tersedia.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token tidak valid.' });
        }

        req.user = decoded; // Simpan data pengguna yang terdekripsi ke dalam req.user
        next();
    });
}
