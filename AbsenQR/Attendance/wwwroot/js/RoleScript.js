let URLBackend = "https://localhost:44319/api/roles"

$(document).ready(function () {

    $('#tbRole').DataTable({
        "ajax": {
            url: URLBackend,
            type: "GET",
            "dataType": "json",
            "dataSrc": "data",
            //success: function (result) {
            //    console.log(result)
            //}
        },
        "columns": [
            {
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "id" },
            { "data": "roleName" },

            {
                "render": function (data, type, row) {
                    return '<button class="btn btn-light " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick=" selectProvinsi(); GetById(' + row.id + ')"><i class="fas fa-search"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-light" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="ConfirmDelete(' + row.id + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ]
    })
})

function Save() {
    let validateForm = true

    if (
        $("#roleName").val() == ""
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