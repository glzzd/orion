const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Verilənlər bazasına qoşuldu");
    } catch (error) {
        console.error("Verilənlər bazasına qoşulma zamanı xəta baş verdi:", error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
