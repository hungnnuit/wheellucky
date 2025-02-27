const mongoose = require("mongoose");

// Định nghĩa Schema
const UserSchema = new mongoose.Schema({
    sdt: { type: String, required: true, unique: true },  // Số điện thoại phải duy nhất
    time: { type: Date, default: Date.now }
});

// Tạo Model từ Schema
const User = mongoose.model("User", UserSchema);

module.exports = User;
