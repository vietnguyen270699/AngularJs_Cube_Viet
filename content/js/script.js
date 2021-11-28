$(function () {

    $("#dialog").dialog({
        autoOpen: false,
    });
    $("#dialogFail").dialog({
        autoOpen: false,
    });
    $("#dialogError").dialog({
        autoOpen: false,
    });
    $("#btnUpdate").hide();
    $("#btnSearch").click(function (e) {
        e.preventDefault();
        console.log(" ma nos ngu" + $('#internId').val());

        $.ajax({
            type: 'GET',
            url: `http://localhost:8081/getintern?id=${$('#internId').val()}`,
            success: function (intern) {
                if (intern == null) {
                    $("#dialogFail").append("Không tìm thấy kết quả !!!")
                    $("#dialogFail").dialog("open");

                } else {

                    $("#dialog").append('Intership Id: ' + intern.id + '<br/><br/>Name: ' + intern.name + '<br/><br/>Birthd: ' + intern.birthday + '<br/><br/>Ngày vào thực tập: ' + intern.getInCompanyDay);
                    $("#dialog").dialog("open");
                    $('#internId').prop('disabled', true);
                    $("#btnUpdate").show()
                    $('#internName').val(intern.name)
                    $('#internBirthday').val(intern.birthday)
                    $('#internDate').val(intern.getInCompanyDay)
                }
            },
            error: function () {
                $("#dialogError").append("Vui lòng nhập id !!!")
                $("#dialogError").dialog("open");

            }
        })
    })


});
 