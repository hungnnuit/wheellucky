// Danh sách phần thưởng kèm hình ảnh
let prizes = [
    { text: "Thẻ Cào 20k", image: ".//library/picture/20.png" },
    { text: "Thẻ Cào 50k", image: ".//library/picture/50.jpg" },
    { text: "Thẻ Cào 20k", image: ".//library/picture/20.png" },
    { text: "Thẻ Cào 100k", image: ".//library/picture/100.jpg" },
    { text: "Thẻ Cào 20k", image: ".//library/picture/20.png" },
    { text: "Thẻ Cào 10k", image: ".//library/picture/10.jpg" }
];

// Khởi tạo vòng quay
let myWheel = new Winwheel({
    'canvasId': 'canvas',
    'numSegments': prizes.length,
    'outerRadius': 200,
    'textFontSize': 16,
    'segments': prizes.map(p => ({ fillStyle: getRandomColor(), text: p.text })),
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

// Hàm tạo màu sắc ngẫu nhiên cho các phần thưởng
function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

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
    if (checksdt()) {
        document.getElementById('getPrize').disabled = false;
    } else {
        document.getElementById('getPrize').disabled = true;
    }
    openThongbao(1)

});

function checksdt() {
    var sdt = document.getElementById("sdt").value;
    if (sdt.length == 10) {
        return true;
    }
    return false;
}

function sendData() {
    let sdt = document.getElementById("sdt").value;

    fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdt: sdt })

    })
        .then(response => response.json())
        .then(data => {
            // console.log(data.user)
            if (data.user) {
                setTimeout(function () {
                    openThongbao(2);
                    document.getElementById('sdt').disabled = true;
                    document.getElementById('getPrize').disabled = true;
                    document.getElementById('getPrize').innerText = 'Thành Công';
                    document.getElementById('getPrize').style.backgroundColor = '#2a83e9';
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
    document.getElementById("progressBarWrap").classList.remove("d-none");
    let progressBar = document.getElementById("progressBarWrap");
    let width = 0;
    let time = 5000;  // 5 giây
    let intervalTime = 50; // Cập nhật mỗi 50ms
    let step = (100 / (time / intervalTime)); // Tính bước tăng %

    let interval = setInterval(function () {
        width += step;
        if (width >= 100) {
            width = 100;
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
            break;

        case 2:
            document.getElementById('thongbao_1').classList.add('d-none');
            document.getElementById('thongbao_2').classList.remove('d-none');
            document.getElementById('thongbao_3').classList.add('d-none');
            break;
        case 3:
            document.getElementById('thongbao_1').classList.add('d-none');
            document.getElementById('thongbao_2').classList.add('d-none');
            document.getElementById('thongbao_3').classList.remove('d-none');
            document.getElementById('getPrize').disabled = true;
            document.getElementById('sdt').value = '';
        default:
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