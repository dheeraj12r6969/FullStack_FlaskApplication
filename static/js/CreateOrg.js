$(document).ready(function(){
    gettingEmployeeData()
})
var table

function gettingEmployeeData(){
    $.get({
        url:"/orgDetails",
        dataType:'json',
        success:function(data){
            console.log("In getting data success",data)
            table=$('#orgTable').dataTable({
                "data":data,
                dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excel',
                            text: 'Excel Download',

                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                columns: [
                    {"data" : "EmployeeID"},
                    {"data" : "Department"},
                    {"data" : "EmployeeName"},
                    {"data" : "Mail"},
                    {"data" : "ProjectName"},
//                    {"data" : "CorpID"},
//                    {"data" : "ProjectID"}
                ],
                "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                       if($("input[name='selectall']").is(':checked')){
                            var checkboxes= $("input[name='Pick']")
                            var checkboxStatus=$("input[name='selectall']").is(':checked')
                            if($("input[name='selectall']").is(':checked'))
                            {
                                $.each(checkboxes,function(){
                                        $(this).attr('checked',checkboxStatus)
                                })
                            }
                            else{
                                $.each(checkboxes,function(){
                                        $(this).attr('checked',checkboxStatus)
                                        })
                                }
                       }
               },
                'columnDefs': [{
                        'targets': 0,
//                        'checkboxes': {'selectRow': true},
                        'searchable': false,
                        'orderable': false,
                        'className': 'dt-body-center',
                        'render': function (data, type, full, meta) {
                            return '<input type="checkbox" name="Pick" value="' + $('<div/>').text(data).html() + '">';
                        }
                    }],
                        'select': {
                        'style': 'multi'
                      },
                       'order': [[1, 'asc']]
                })
                }
            })
        }


$("#orgTable").on("click","tr",function() {
//            var checkBoxes = $(".dt-checkboxes");
//            checkBoxes.prop("checked", !checkBoxes.prop("checked"));
//            var currentRow = $(this).find("td input").val()
//            console.log(currentRow)
//
//            if($(this).find("input[type='checkbox']").is(':checked')){
//                $(this).find("input[type='checkbox']").attr("checked",false)
//            }
//            else{
//                $(this).find("input[type='checkbox']").attr("checked",true)
//            }

        })

$("#orgTable").on("click",".paginate_button",function(){
    alert("ganfa")
})

$("input[name='selectall']").on("change",function(){
    var checkboxes= $("input[name='Pick']")
    var checkboxStatus=$(this).is(':checked')
    if($(this).is(':checked'))
    {
        $.each(checkboxes,function(){
                $(this).attr('checked',checkboxStatus)
        })
    }
    else{
        $.each(checkboxes,function(){
                $(this).attr('checked',checkboxStatus)
        })

    }
})

$("#GenerateOrg").on("click",function(){
    var employeeIdArray =[];
    var checkedCheckboxes= $("#orgTable").find("input[name='Pick']");
    $.each(checkedCheckboxes,function(){
        if($(this).is(':checked')){
            employeeIdArray.push($(this).val())
        }
   })
        $.ajax({
        type:'POST',
        url:"/orgDetails",
        contentType:"application/json",
        data:JSON.stringify(employeeIdArray),
        dataType: "json",
        success:function(data){
                                    location.reload()
                              },
        error:function(data){

                                alert("Please make a selection")
                            }
        })

   console.log(employeeIdArray,"checkboxes")
})


$("#ChangeStatus").on("click",function(){
    var employeeIdArray =[];
    var checkedCheckboxes= $("#orgTable").find("input[name='Pick']");
    $.each(checkedCheckboxes,function(){
        if($(this).is(':checked')){
            employeeIdArray.push($(this).val())
        }
   })
        $.ajax({
        type:'POST',
        url:"/updateStatus",
        contentType:"application/json",
        data:JSON.stringify(employeeIdArray),
        dataType: "json",
        success:function(data){
                                    location.reload()
                              },
        error:function(data){

                                alert("Please make a selection")
                            }
        })

   console.log(employeeIdArray,"checkboxes")
})



