var dataLogin = new Object();
dataLogin.nik = localStorage.getItem('nik');
dataLogin.name = localStorage.getItem('name');
dataLogin.roleId = localStorage.getItem('role');
dataLogin.departmentId = localStorage.getItem('department');

if (dataLogin.nik != null) {
    $("#btnHome").show();
    $("#btnLogin").hide();    
} else {
    $("#btnHome").hide();
    $("#btnLogin").show();
}

function dashboard() {
    window.location.assign("https://localhost:44325/Attendance");
}

function Attendance() {
    var nik = $("#nik").val();
    console.log(nik)
    $.ajax({
        "type": "GET",
        "url": "https://localhost:44319/api/attendances/scan/"+nik,
        "data": JSON.stringify(nik),
        "contentType": "application/json;charset=utf-8",
        "success": (result) => {
            if (result.status == 200 || result.status == 202) {                
                var dat = result.data
                swal({
                    icon: 'success',
                    title: dat.name,
                    text: 'Check In/Check Out Successful',
                    timer: 2000,
                    buttons: false,
                })
                $("#nik").val("");
                                                       
              /*  console.log(nik)*/
            } else {
                swal({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Check In/Check Out Failed, Try Again!',
                    timer: 3000,
                    buttons: false,
                })
            }
            $("#nik").value("A to Zs");
        },
        "error": (result) => {
            if (result.status == 404 || result.status == 500) {
                swal({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Check In/Check Out Failed, Wrong NIK!',
                    timer: 3000,
                    buttons: false,
                })
            }
        },
    })
}


function Login() {
    let validateForm = true
    if (
        $("#username").val() == "" ||
        $("#password").val() == "" 

    ) {
        swal({
            icon: 'error',
            title: 'Failed',
            text: "Please fill out all your data",
        })
        validateForm = false
    } 


    if (validateForm) {
        var User = new Object();
        User.username = $('#username').val();
        User.password = $('#password').val();
       
        $.ajax({
            "type": "POST",
            "url": "https://localhost:44319/api/login",
            "data": JSON.stringify(User),
            "contentType": "application/json;charset=utf-8",
            "success": (result) => {                
                if (result.status == 200 || result.status == 201) {
                    $('#loginModal').modal("hide");
                    localStorage.setItem('nik', result.data.nik);
                    localStorage.setItem('name',result.data.name);
                    localStorage.setItem('role', result.data.roleId);
                    localStorage.setItem('department', result.data.departmentId);
                    localStorage.setItem('toke', result.data.token);
                    sessionStorage.setItem("login","Anda Login" );
                    window.location.assign("https://localhost:44325/attendance/");
                } else {
                    alert("Login failed")
                }               
                $('#loginModal').modal("hide");
            },
            "error": (result) => {
                if (result.status == 400 || result.status == 500) {
                    swal({
                        icon: 'error',
                        title: 'Failed',
                        text: result.responseJSON.message,
                    })
                }
            },
        })
    }
}

function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            console.log("Jangan Type Huruf BLOKKK!!!");
            if (inputFilter(this.value)) {
                // Accepted value.
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    this.classList.remove("input-error");
                    this.setCustomValidity("");
                }

                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            }
            else if (this.hasOwnProperty("oldValue")) {
                // Rejected value: restore the previous one.
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
            else {
                // Rejected value: nothing to restore.
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("nik"), function (value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
}, "Only digits are allowed");


