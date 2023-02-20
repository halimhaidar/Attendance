let URLBackend = "https://localhost:44319/api/users/" + dataLogin.nik

$(document).ready(function () {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    $.ajax({
        type: "GET",
        url: URLBackend,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var obj = result.data;
            
            if (obj.gender == 1) {
                gender = "Women";
            } else {
                gender = "Men"
            }
            
            var bDate = new Date(obj.birthDate)
             var birthDate = `${days[bDate.getDay()]} ${bDate.getDate()} ${months[bDate.getMonth()]} ${bDate.getFullYear()}`;
            
            
            $("#nik").val(obj.nik);
            $("#name").val(obj.name);
            $("#phone").val(obj.phone);
            $("#email").val(obj.email);
            $("#gender").val(gender);
            $("#birth").val(birthDate);
            $("#username").val(obj.username);
            $("#password").val(obj.password);
            $("#role").val(obj.roleName);
            $("#dept").val(obj.departmentName);            
            $("#address").val(obj.address);                      
        },       
    })
})


function ChangePw() {
    let validateForm = true
    if ($("#password").val() == "") {
        swal({
            icon: 'error',
            title: 'Failed',
            text: "Please fill your Password",
        })
        validateForm = false
    }
    if (validateForm) {
        var chg = new Object();
        chg.nik = dataLogin.nik;
        chg.password = $("#password").val();  
        debugger;
        $.ajax({
            type: 'PUT',
            url: "https://localhost:44319/api/users/update-password",
            data: JSON.stringify(chg),
            contentType: "application/json; charset=utf-8",
        }).then((result) => {
            debugger;
            if (result.status == 200) {                
                swal("Password Berhasil Diperbarui!", "You clicked the button!", "success");               
            }          
        });
    } else {
        swal("Password Gagal Diperbarui!", "You clicked the button!", "error");
    }
    
}