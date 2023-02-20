let URLBackend = "https://localhost:44319/api/departments/"

$(document).ready(function () {
    
    var table = $('#tbDepartment').DataTable({
        "ajax": {
            url: URLBackend,
            type: "GET",
            "dataType": "json",
            "dataSrc": "data",

        },
        "columns": [
            {
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "departmentName" },
            { "data": "supervisorName" },
            {
                "render": function (data, type, row) {
                    return '<button class="btn btn-light" id="edit-btn" data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit"><i class="fas fa-search"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-light" id="delete-btn" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="Delete(' + row.id + ')" ><i class="fa fa-trash"></i></button >'
                }
            }
        ]
    });
    $('#tbDepartment tbody').on('click', '#edit-btn', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data);
        //alert(data.departmentName + "'s salary is: " + data.supervisorNIK);
        select();
        $("#spvName").append('<option value="' + data.supervisorNIK + '" selected>' + data.supervisorName + '</option>');
        $('#idDepartment').val(data.id);
        $('#deptName').val(data.departmentName);
        $("#buttonSubmit").attr("onclick", "Update()");
        $("#buttonSubmit").attr("class", "btn btn-warning");
        $("#buttonSubmit").html("Update");
        $('#deptModal').modal('show');
    });
})

$("#addButton").click(() => {
    $("#buttonSubmit").attr("onclick", "Create()");
    $("#buttonSubmit").attr("class", "btn btn-success");
    $("#buttonSubmit").html("Save");
    $("#deptName").val("");
    $("#spvName").val("");
 
})

function select() {
    //debugger;
    $("#spvName").empty("");
    $("#spvName").append('<option disabled value="">Choose Supervisor</option>');
    $("#spvName").append('<option value="">-</option>');
    $.ajax({
        type: "GET",
        url: "https://localhost:44319/api/employees/employee",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var obj = result.data;
            obj.length;
            for (var i = 0; i < obj.length; i++) {
                $("#spvName").append('<option value="' + obj[i].nik + '">' + obj[i].name + '</option>');
            }
        }
    });
}

function Create() {
    let validateForm = true

    if (
        $("#deptName").val() == "" ||
        $("#spvName").val() == ""       
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
        User.departmentName = $('#deptName').val();
        User.supervisorNIK = $('#spvName').val();
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


function Update() {

    let validateForm = true

    if (
        $("#deptName").val() == "" ||
        $("#spvName").val() == ""       
    ) {
        swal({
            icon: 'error',
            title: 'Failed',
            text: "Please fill out all your data",
        })
        validateForm = false
    } 
    if (validateForm) {

        debugger;
        var User = new Object();
        User.id = $('#idDepartment').val();
        User.departmentName = $('#deptName').val();
        User.supervisorNIK = $('#spvName').val();
        $.ajax({
            type: 'PUT',
            url: "https://localhost:44319/api/departments",
            data: JSON.stringify(User),
            contentType: "application/json; charset=utf-8",
        }).then((result) => {
            debugger;
            if (result.status == 200) {
                $('#tbDepartment').DataTable().ajax.reload();
                swal("Data Berhasil Diperbarui!", "You clicked the button!", "success");
            }
            else {
                swal("Data Gagal Diperbarui!", "You clicked the button!", "error");
            }
        });
    }
}


function Delete(id) {
    debugger;
    $.ajax({
        url: URLBackend,
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

function ConfirmDelete(id) {
    debugger;
    swal({
        title: 'Apakah kamu yakin?',
        text: "Kamu Tidak Bisa  Mengulang Takdir yang Telah Terjadi!",
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((isConfirmed) => {
        if (isConfirmed) {
            Delete(id);
            swal(
                'Dihapus!',
                'Data Berhasil Dihapus.',
                'Berhasil'
            )
        }
    })
}