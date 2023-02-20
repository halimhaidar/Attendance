var qrcode = new QRCode("qrcode");

function makeCode() {  
    qrcode.makeCode(dataLogin.nik);
}

makeCode();

$("#text").
    on("blur", function () {
        makeCode();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            makeCode();
        }
    });