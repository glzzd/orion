const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Server xətası";

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Sessiya bitib, yenidən daxil olun";
    }

    res.status(statusCode).json({ message });
};

module.exports = errorHandler;
