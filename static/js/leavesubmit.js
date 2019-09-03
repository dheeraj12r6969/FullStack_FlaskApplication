$(document).ready(function(){

    $('#tbl').on('click', '.edit', function () {
    var th = $('#tbl th').eq(($(this).index()))

    var rowIndex = $(this).closest('tr').index();
    console.log(rowIndex)

    var colIndex = $(this).closest('td').index();
    console.log(colIndex)

    var employeeid = $(this).closest("tr").find(".empid").text();
    console.log(employeeid)

    console.log(th.text())
     $("#leavesubmit").on('click',function(){
              $.ajax({
                        data: {
                            Date : th.text(),
                            EmployeeId: employeeid
                                },
                        type:'POST',
                        url: '/leavedate',
                        dataType: 'json',
                        success: function () {
                         debugger;
                            alert("done")
                          },
                        error: function () {
                              location.reload(true);
                              console.log("aaaaa")
                         },
                          complete: function () {
                          }
                        })
             console.log("final")
         })

//        revert the changes
         $("#revert").on('click',function(){
              $.ajax({
                        data: {
                            Date : th.text(),
                            EmployeeId: employeeid
                                },
                        type:'POST',
                        url: '/revertleavedate',
                        dataType: 'json',
                        success: function () {
                         debugger;
                            alert("done")
                          },
                        error: function () {
                              location.reload(true);
                              console.log("Failed to revert")
                         },
                          complete: function () {
                          }
                        })
             console.log("final")
         })

     })

     //getting current user name
        var currentUser = document.getElementById('currentUser').textContent
        console.log(currentUser)
    })


