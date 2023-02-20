let URLBackend = "https://localhost:44319/api/users"

$(document).ready(function () {   
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    $('#tbEmployee').DataTable({
        "ajax": {
            url: URLBackend,
            type: "GET",
            "dataType": "json",
            "dataSrc": "data",
            "order": [[4, 'desc']],
        },
        "columns": [
            {
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "nik" },
            { "data": "name" },
            { "data": "departmentName" },
            { "data": "roleName"},
            { "data": "email" },
            { "data": "phone" },            
            {
                "data": "gender",
                "render": function (data) {
                    if (data == 1) {                        
                        return "Female";
                    }
                    return "Male";
                }
            },
            { "data": "address" },
            {
                "data": "birthDate",
                "render": function (data) {
                    localDay = new Date(data)
                    return `${days[localDay.getDay()]} ${localDay.getDate()} ${months[localDay.getMonth()]} ${localDay.getFullYear()}`;
                }
            },
            { "data": "username" },
            
            {
                "className":"text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-light " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick=" select(); GetById(\'' + row.nik + '\')"><i class="fas fa-search"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-light" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="ConfirmDelete(\'' + row.nik + '\')"><i class="fa fa-trash"></i></button >'
                }
            }
        ]
    });   
})


$("#addButton").click(() => {
    console.log("tombol adds");
    $("#uspw").hide();
    $("#buttonSubmit").attr("onclick", "Save()");
    $("#buttonSubmit").attr("class", "btn btn-success");
    $("#buttonSubmit").html("Save");
    $("#userModalLabel").html("New User");
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#gender").val("");
    $("#birthDate").val("");
    $("#department").val("");  
    $("#role").val("");
    $("#address").val("");
})

function select() {
    $('#department').empty("");
    $('#department').append('<option value="">Choose Department</option>');
    $.ajax({
        type: 'GET',
        url: "https://localhost:44319/api/departments",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var obj = result.data;
            obj.length;
            for (var i = 0; i < obj.length; i++) {
                $('#department').append('<option value="' + obj[i].id + '">' + obj[i].departmentName + '</option>');
            }
        }
    });
};



function Save() {
    let validateForm = true
    if (      
        $("#name").val() == "" ||
        $("#phone").val() == "" ||
        $("#email").val() == "" ||
        $("#gender option:selected").html() == "" ||        
        $("#birthDate").val() == "" ||          
        $("#department option:selected").html() == "" ||
        $("#address").val() == ""
    ) {
        swal({
            icon: 'error',
            title: 'Failed',
            text: "Please fill out all your data",
        })
        validateForm = false
    } else {
        if (!$("#email").val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            swal({
                icon: 'error',
                title: 'Failed',
                text: "Sorry, your email is not valid",
            })
            validateForm = false
        }
        if (!$("#phone").val().match(/^\d*\d$/)) {
            swal({
                icon: 'error',
                title: 'Failed',
                text: "Sorry, your phone number is not valid",
            })
            validateForm = false
        }
    }


    if (validateForm) {
        var User = new Object();     
        User.name = $('#name').val();
        User.phone = $('#phone').val();
        User.email = $('#email').val();
        User.gender = $('#gender').val();
        User.birthDate = $('#birthDate').val();
        User.address = $('#address').val();
        User.username = $('#username').val();
        User.password = $('#password').val();
        User.departmentId = $('#department').val();     
        User.departmentName = $('#department option:selected').html();                   

        $.ajax({
            "type": "POST",
            "url": URLBackend,
            "data": JSON.stringify(User),
            "contentType": "application/json;charset=utf-8",
            "success": (result) => {
                if (result.status == 200 || result.status == 201) {
                    swal({
                        icon: 'success',
                        title: 'Success',
                        text: 'Data successfully created',
                    })
                    $('#tbEmployee').DataTable().ajax.reload();
                    $('#userModal').modal("hide");
                } else {
                    alert("Data failed to create")
                }
                $('#tbEmployee').DataTable().ajax.reload();
                $('#userModal').modal("hide");
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

function GetById(nik) {
    //debugger;
    $.ajax({
        type: "GET",
        url: URLBackend + "/" + nik,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var obj = result.data;          
            //debugger;
            $.ajax({
                type: 'GET',
                url: "https://localhost:44319/api/departments/",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    //debugger;
                    var department = result.data;

                    for (var i = 0; i < department.length; i++) {
                        //debugger;
                        if (obj.departmentId == department[i].id) {
                            $('#department').append('<option value="' + department[i].id + '" selected>' + department[i].departmentName + '</option>');
                        }
                        else {
                            $('#department').append('<option value="' + department[i].id + '">' + department[i].departmentName + '</option>');
                        }
                    }
                }
            });
            debugger;
            $("#nik").val(obj.nik);
            $("#name").val(obj.name);
            $("#phone").val(obj.phone);
            $("#email").val(obj.email);
            $("#gender").val(obj.gender);            
            var birthDt = new Date(obj.birthDate).toISOString().split('T')[0];
            /*console.log(birthDt);*/
            $("#birthDate").val(birthDt);
            $("#username").val(obj.username);
            $("#password").val(obj.password);
            $("#role").val(obj.roleId);
            $("#role option:selected").html(obj.roleName);           
            $("#address").val(obj.address);
            //debugger;    
            $("#uspw").show();
            $("#buttonSubmit").attr("onclick", "Update()");
            $("#buttonSubmit").attr("class", "btn btn-warning");
            $("#buttonSubmit").html("Update");
            $("#userModalLabel").html(obj.nik);
            $('#userModal').modal('show');
           
        },
        error: function (errormesage) {
            swal("Data Gagal Dimasukkan!", "You clicked the button!", "error");
        }
    })
}



function Update() {

    let validateForm = true

    if (
        
        $("#name").val() == "" ||
        $("#phone").val() == "" ||
        $("#email").val() == "" ||
        $("#gender option:selected").html() == "" ||
        $("#birthDate").val() == "" ||
        $("#username").val() == "" ||
        $("#password").val() == "" ||
        $("#department option:selected").html() == "" ||
        $("#role option:selected").html() == "" ||
        $("#address").val() == ""
    ) {
        swal({
            icon: 'error',
            title: 'Failed',
            text: "Please fill out all your data",
        })
        validateForm = false
    } else {
        if (!$("#email").val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            swal({
                icon: 'error',
                title: 'Failed',
                text: "Sorry, your email is not valid",
            })
            validateForm = false
        }
        if (!$("#phone").val().match(/^\d*\d$/)) {
            swal({
                icon: 'error',
                title: 'Failed',
                text: "Sorry, your phone number is not valid",
            })
            validateForm = false
        }
    }
    if (validateForm) {

        //debugger;
        var User = new Object();
        User.nik = $('#nik').val();
        User.name = $('#name').val();
        User.phone = $('#phone').val();
        User.email = $('#email').val();
        User.gender = $('#gender').val();
        User.birthDate = $('#birthDate').val();
        User.address = $('#address').val();
        User.username = $('#username').val();
        User.password = $('#password').val();
        User.departmentId = $('#department').val();
        User.roleId = $('#role').val();
        User.departmentName = $('#department option:selected').html();
        User.roleName = $('#role option:selected').html();
        $.ajax({
            type: 'PUT',
            url: URLBackend,
            data: JSON.stringify(User),
            contentType: "application/json; charset=utf-8",
        }).then((result) => {
            //debugger;
            if (result.status == 200) {
                $('#tbEmployee').DataTable().ajax.reload();
                swal({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data successfully updated!',
                });
                $('#userModal').modal("hide");
            }
            else {
                swal({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Data update failed!',
                });
            }
        });
    }
}


function Delete(nik) {
    //debugger;
    $.ajax({
        url: URLBackend + "/" + nik,
        type: "DELETE",
        dataType: "json",
    }).then((result) => {
        if (result.status == 200) {
            $('#userModal').modal('hide');
            $('#tbEmployee').DataTable().ajax.reload();

            swal({
                icon: 'success',
                title: 'Deleted',
                text: 'Data Tamu Berhasil Dihapus'
            });
        }
        else {
            swal({
                icon: 'error',
                title: 'Failed',
                text: 'Gagal Menghapus Data Tamu'
            });
        }
    });
}

function ConfirmDelete(nik) {
    //debugger;
    console.log(nik);
    swal({
        title: 'Apakah kamu yakin?',
        text: "Kamu Tidak Bisa  Mengulang Takdir yang Telah Terjadi!",
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((isConfirmed) => {
        if (isConfirmed) {
            Delete(nik);
            swal(
                'Dihapus!',
                'Data Berhasil Dihapus.',
                'Berhasil'
            )
        }
    })
}