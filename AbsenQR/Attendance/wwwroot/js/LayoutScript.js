

var dataLogin = new Object();
dataLogin.nik = localStorage.getItem('nik');
dataLogin.name = localStorage.getItem('name');
dataLogin.roleId = localStorage.getItem('role');
dataLogin.departmentId = localStorage.getItem('department');

$("#userLogin").html(dataLogin.name);


if (dataLogin.nik == null) {
    window.location.assign("https://localhost:44325/");
}

if (dataLogin.roleId == 1) {
    $("#tabUser").show();
    $("#tabHistory").show();
    $("#tabApproval").show();
    $("#tabCheck").hide();
    
} else if (dataLogin.roleId == 2) {
    $("#tabUser").hide();
    $("#tabHistory").hide();
    $("#tabApproval").show();
    $("#tabCheck").show();
    
} else if (dataLogin.roleId == 3) {
    $("#tabUser").hide();
    $("#tabHistory").hide();
    $("#tabApproval").hide();
    $("#tabCheck").show();
   
}


function Logout() {
    window.localStorage.clear();
    window.location.assign("https://localhost:44325/");
}