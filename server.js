const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require('./User')
const app = express();
const PORT = 3000;
const axios = require("axios");
const useragent = require("express-useragent");


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(useragent.express());

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
    // mongoose.connect("mongodb://103.82.134.11:27017/mydatabase", {
})
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));



// Middleware
app.use(cors());  // Cho phép gọi API từ domain khác
app.use(bodyParser.json()); // Đọc dữ liệu JSON từ request


app.get("/ip", (req, res) => {
    console.log('get/ip')
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const ipv4 = clientIp.replace('::ffff:', '')
        let phantich =  phantichUserAgent(req.useragent);
        sendMail('ip',{ip:ipv4,phantich:phantich}).catch(console.error);
        console.log('ip: ', ipv4)
        return res.status(201).json({ ip: ipv4 })
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("❌ Lỗi khi xử lý get/ip:", err.message);
    }
});

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
            sendMail('sdt', sdt).catch(console.error);
            return res.status(200).json({ message: "✅ Thêm số điện thoại thành công!", sdt: sdt });
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
        if (user == null) {
            console.log('checkPhoneExists --khong ton tai');
            return false;
        } else {
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
async function sendMail(subject, data) {
    if (subject == 'ip') {
        ip = data.ip;
        phantich = data.phantich;
        
        text = "địa chỉ IP: " + ip + " \n " + `http://ip-api.com/json/${ip} \n` + phantich;
    } else {
        text = "Hello, Đây là " + subject + ": " + data;
    }
    let info = await transporter.sendMail({
        from: "hungnn.uit@gmail.com",
        to: "kuti.uit@gmail.com",
        subject: "DMX-" + subject,
        text: text,
    });

    console.log("✅ Email sent: " + info.response);
}


//lấy địa chỉ từ ip 
async function getLocation(ip) {
    console.log("getlocation:" + ip)
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const data = response.data;
        const text = `IP: ${data.query}, Quốc gia: ${data.country}, Tỉnh: ${data.regionName}, Thành phố: ${data.city}`
        sendMail('IP', text);
        console.log(`IP: ${data.query}, Quốc gia: ${data.country}, Tỉnh: ${data.regionName}, Thành phố: ${data.city}`);
        return data;
    } catch (error) {
        console.error(" getLocation - Lỗi khi lấy dữ liệu tại -", error);
        return error;
    }
}

 function phantichUserAgent(useragent) {
    console.log("phantichUserAgent:" + useragent)
    try {
        console.log(useragent);
        // xác định thiết bị
        const ua = useragent.source;
        let brand = "Không xác định";

        if (/Samsung/i.test(ua)) brand = "Samsung";
        else if (/iPhone|iPad/i.test(ua)) brand = "Apple";
        else if (/Xiaomi|Redmi/i.test(ua)) brand = "Xiaomi";
        else if (/Huawei/i.test(ua)) brand = "Huawei";
        else if (/OnePlus/i.test(ua)) brand = "OnePlus";
        else if (/OPPO/i.test(ua)) brand = "OPPO";
        else if (/Vivo/i.test(ua)) brand = "Vivo";

        const text = `User-Agent: ${useragent.source} \n
        Hệ điều hành: ${useragent.os}\n, 
        Trình duyệt: ${useragent.browser}\n,
        Phiên bản: ${useragent.version}\n,
        platform: ${useragent.platform}\n,
        isMobile: ${useragent.isMobile}\n,
        isDesktop: ${useragent.isDesktop}\n,
        brand: ${brand}\n`;
        // console.log(text);
       return text;
    } catch (error) {
        console.error("phantichUserAgent - L��i khi phân tích User-Agent -", error);
        return error;
    }

}