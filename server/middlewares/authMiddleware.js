const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "İcazəsiz giriş" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).populate("roles.roleId");
        if (!user) {
            return res.status(401).json({ message: "İstifadəçi tapılmadı" });
        }

        if (user.status !== "ACTIVE") {
             return res.status(403).json({ message: "İstifadəçi hesabı aktiv deyil" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: "Yanlış TOKEN" });
    }
};

module.exports = authMiddleware;
