require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send("Header missing");

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : authHeader;
    if (!token) return res.status(403).send("Token missing");

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).send("Server configuration error");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send("Invalid Token");
    }
};