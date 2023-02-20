let URLBackend = "https://localhost:44319/api/attendances/"+ dataLogin.nik

$(document).ready(function () {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    $('#tbCheck').DataTable({
        "ajax": {
            url: URLBackend,
            type: "GET",
            "dataType": "json",
            "dataSrc": "data",
        },      
        "columns": [                       
            { "data": "nik" },
            { "data": "name" },
            { "data": "departmentName" },
            {
                "data": "date",
                "render": function (data) {
                    localDay = new Date(data)
                    
                    return `${days[localDay.getDay()]} ${localDay.getDate()} ${months[localDay.getMonth()]} ${localDay.getFullYear()}`;
                }
            },
            {
                "data": "checkIn",
                "render": function (data) {                  
                    if (data != null) {
                        localDay = new Date(data)
                        return `${localDay.getHours()}.${localDay.getMinutes()}.${localDay.getSeconds()} WIB`;
                    }
                    return ``;
                }
            },
            {
                "data": "checkOut",
                "render": function (data) {
                    if (data != null) {
                        localDay = new Date(data)
                        return `${localDay.getHours()}.${localDay.getMinutes()}.${localDay.getSeconds()} WIB`;
                    }
                    return ``;
                }
            },
            {
                "className":"text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-light " data-toggle="tooltip" data-animation="false" title="Edit" onclick="GetById(' + row.id + ')"><i class="fas fa-search"></i></button >'
                }
            },
            {
                "data": "responseStatus",                
                "render": function (data) {
                    if (data == 1) {
                        return '<span class="text-warning "  >On Progress</span>';
                    } else if (data ==2) {
                        return '<span class="text-primary"  >Approved</span>';
                    } else if (data == 3) {
                        return '<span class="text-danger"  >Rejected</span >';
                    }
                    return "";
                }
            },
            {
                "data": "reviseCheckIn",
                "render": function (data) {
                    if (data != null) {
                        localDay = new Date(data)
                        return `${localDay.getHours()}.${localDay.getMinutes()}.${localDay.getSeconds()} WIB`;
                    }
                    return ``;
                }
            },
            {
                "data": "reviseCheckOut",
                "render": function (data) {
                    if (data != null) {
                        localDay = new Date(data)
                        return `${localDay.getHours()}.${localDay.getMinutes()}.${localDay.getSeconds()} WIB`;
                    }
                    return ``;
                }
            },
            { "data": "reason" },
        ]
    })
})



function GetById(id) {
    $('#idCheck').val(id);
    $('#checkModal').modal('show');    
}

function Revision() {
    let validateForm = true
    if (
        $("#checkIn").val() == "" ||
        $("#checkOut").val() == "" ||
        $("#reason").val() == "" 

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
        User.id = $('#idCheck').val();
        User.checkIn = $('#checkIn').val();
        User.checkOut = $('#checkOut').val();
        User.reason = $('#reason').val();
        console.log(User.revisiCheckIn);

        $.ajax({
            "type": "POST",
            "url": "https://localhost:44319/api/attendances/revise/",
            "data": JSON.stringify(User),
            "contentType": "application/json;charset=utf-8",
            "success": (result) => {
                if (result.status == 200 || result.status == 201) {
                    $('#checkModal').modal("hide");
                    swal({
                        icon: 'success',
                        title: 'Success',
                        text: 'Revision Submitted',
                    })
                    $('#tbCheck').DataTable().ajax.reload();
                }
            },
            "error": (result) => {
                if (result.status == 400 || result.status == 500) {
                    swal({
                        icon: 'error',
                        title: 'Failed',
                        text: result.responseJSON.message,
                    })
                    $('#tbCheck').DataTable().ajax.reload();
                }
            },
        })
    }
}