const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require('./User')
const app = express();
const PORT = 3000;

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
//mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
mongoose.connect("mongodb://103.82.134.11:27017/mydatabase", {
})
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// API: Lưu dữ liệu vào MongoDB
// app.post("/add-user", async (req, res) => {
//     try {
//         const newUser = new User(req.body);
//         await newUser.save();
//         res.json({ message: "Người dùng đã được lưu!", user: newUser });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// Middleware
app.use(cors());  // Cho phép gọi API từ domain khác
app.use(bodyParser.json()); // Đọc dữ liệu JSON từ request

// Endpoint để nhận dữ liệu từ client
// app.post("/submit",async (req, res) => {
//     try {
//         const { sdt } = req.body;

//         // Kiểm tra xem số điện thoại đã tồn tại chưa
//         const existingUser = await User.findOne({ sdt });

//         if (existingUser) {
//             return res.status(400).json({ message: "❌ Số điện thoại đã tồn tại!" });
//         }

//         // Nếu chưa tồn tại, thêm mới vào database
//         const newUser = new User({ sdt });
//         await newUser.save();

//         return res.status(200).json({  message: "✅ Thêm số điện thoại thành công!", user: newUser });

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

app.post("/submit", async (req, res) => {
    try {
        const { sdt } = req.body;

        // Kiểm tra xem số điện thoại đã tồn tại chưa
        const checkexist = await checkPhoneExists(sdt); // Sử dụng await

        if (checkexist) {
            console.log('submit -- số điện thoại đã tồn tại');
            return res.status(400).json({ message: "❌ Số điện thoại đã tồn tại!" });
        } else {
            await addUser(sdt);  // Cần await để đảm bảo user được thêm
            console.log('submit -- số điện thoại chưa tồn tại, đã thêm mới');
            sendMail(sdt).catch(console.error);
            return res.status(200).json({ message: "✅ Thêm số điện thoại thành công!" , sdt: sdt});
        }
    } catch (err) {
        console.error("❌ Lỗi khi xử lý submit:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});


async function getAllUsers(sdt) {
    try {
        const users = await User.find(); // Lấy tất cả dữ liệu trong bảng
        console.log(users);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

async function checkPhoneExists(sdt) {
    try {
        const user = await User.findOne({ sdt: sdt });
        console.log('kiem tra ton tai:' + user);
        if(user == null){
            console.log('checkPhoneExists --khong ton tai');
            return false;
        }else{
            console.log(' checkPhoneExists --ton tai');
            return true;
        }
    } catch (error) {
        console.error("checkPhoneExists --Lỗi khi kiểm tra số điện thoại:", error);
        return true;
    }
}

async function addUser(sdt) {
    try {
        // Nếu chưa tồn tại, thêm mới vào database
        const newUser = new User({ sdt });
        newUser.save();
        console.log("✅ Thêm số điện thoại thành công!" + sdt);
        return true 
    } catch (error) {
        console.error("Lỗi khi add số điện thoại:", error);
        return false;
    }
}

//send mail
const nodemailer = require("nodemailer");

// Tạo transporter đơn giản
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hungnn.uit@gmail.com",
    pass: "mqxo vaqd cioa fypc", // App Password, không phải mật khẩu Gmail thật
  },
});

// Hàm gửi email
async function sendMail(text) {
  let info = await transporter.sendMail({
    from: "hungnn.uit@gmail.com",
    to: "kuti.uit@gmail.com",
    subject: "DMX-SDT",
    text: "Hello, Đây là số điện thoại: " + text,
  });

  console.log("✅ Email sent: " + info.response);
}


