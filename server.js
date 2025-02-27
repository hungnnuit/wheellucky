const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require('./User')
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// API: Lưu dữ liệu vào MongoDB
app.post("/add-user", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ message: "Người dùng đã được lưu!", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Middleware
app.use(cors());  // Cho phép gọi API từ domain khác
app.use(bodyParser.json()); // Đọc dữ liệu JSON từ request

// Endpoint để nhận dữ liệu từ client
app.post("/submit",async (req, res) => {
    try {
        const { sdt } = req.body;

        // Kiểm tra xem số điện thoại đã tồn tại chưa
        const existingUser = await User.findOne({ sdt });

        if (existingUser) {
            return res.status(400).json({ message: "❌ Số điện thoại đã tồn tại!" });
        }

        // Nếu chưa tồn tại, thêm mới vào database
        const newUser = new User({ sdt });
        await newUser.save();

        return res.status(200).json({  message: "✅ Thêm số điện thoại thành công!", user: newUser });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});


