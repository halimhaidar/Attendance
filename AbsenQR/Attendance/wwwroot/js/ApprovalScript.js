let URLBackend = "https://localhost:44319/api/attendances/revise/" + dataLogin.departmentId

$(document).ready(function () {
   
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    $('#tbApproval').DataTable({
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
            { "data": "nik" },
            { "data": "name" },
            { "data": "departmentName"},
            {
                "data": "date",
                "render": function (data) {
                    localDay = new Date(data)
                    return `${days[localDay.getDay()]}, ${localDay.getDate()} ${months[localDay.getMonth()]} ${localDay.getFullYear()}`;
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
            {
                "render": function (data, type, row) {
                    return '<button style="color: aliceblue; background-color: #059299;" class="btn btn btn-sm" data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick="Approve(\'' + row.id + '\')"><i class="fas fa-check"></i></button>' + '&nbsp;' +
                        '<button class="btn btn-danger btn-sm" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="Reject(\'' + row.id + '\')"><i class="fas fa-times"></i></button >'
                }
            }
        ]
    });
})

function Approve(id) {
    var Approval = new Object();
    Approval.id = id;
    Approval.responseStatus = 2;
    debugger;
    $.ajax({
        "type": "POST",
        "url": "https://localhost:44319/api/attendances/response",
        "data": JSON.stringify(Approval),
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "success": function (result) {
            if (result.status == 200) {
                swal({
                    icon: 'success',
                    title: 'Success',
                    text: 'Revision Approved',
                })
                $('#tbApproval').DataTable().ajax.reload();
            }
        },

    })
}
        
function Reject(id) {
    var Approval = new Object();
    Approval.id = id;
    Approval.responseStatus = 3;
    debugger;
    $.ajax({
        "type": "POST",
        "url": "https://localhost:44319/api/attendances/response",
        "data": JSON.stringify(Approval),
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "success": function (result) {
            if (result.status == 200) {
                swal({
                    icon: 'success',
                    title: 'Success',
                    text: 'Revision Rejected',
                })
                $('#tbApproval').DataTable().ajax.reload();
            }
        },

    })
}