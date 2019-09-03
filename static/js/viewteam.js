var a
var leavetype
var daySelectEvent
var holidays=[]
var corp_id
var options = {
     theme:"sk-cube-grid",
     message:'Please wait !! Your Leave application on process...',
     textColor:"white"
};

$(document).ready(function(){
    gettingOrgData()
    $("#RemoveOrg").on("click",function(){
    var employeeIdArray =[];
    var checkedCheckboxes= $("#orgTableManager").find("input[name='Pick']");
    $.each(checkedCheckboxes,function(){
        console.log($(this))
        if($(this).is(':checked')){
            employeeIdArray.push($(this).val())
        }
   })

        $.ajax({
        type:'POST',
        url:"/getsetviewdata",
        contentType:"application/json",
        data:JSON.stringify(employeeIdArray),
        dataType: "json",
        success:function(data){
                                    alert(data+" ")
                              },
        error:function(data){
                                    alert(data)
                            }
        })
   })
})

var table
var data

function gettingOrgData(){
    $.get({
        url:"/getsetviewdata",
        dataType:'json',
        success:function(data){
            console.log("In getting data success of gettingOrgData",data)
            table=$('#orgTableManager').dataTable({
                stateSave: true,
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
                        {"data" : "EmployeeName"},
                        {"data" : "Mail"},
                        {"data" : "ProjectName"},
                        {"data" : "CorpID"}
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
//                      'checkboxes': {'selectRow': true},
                        'searchable': false,
                        'orderable': false,
                        'className': 'dt-body-center',
                        'render': function (data, type, full, meta) {
                                        return '<a data-toggle="modal" data-target="#exampleModalLeaveByManager"><i class="fa fa-calendar " aria-hidden="true" name="cal" value="' + $('<div/>').text(data).html() + '"></i></a>';
                                    },
                        }],
                        'select': {
                                    'style': 'multi'
                                  },
                        'order': [[1, 'asc']]
               })
            },
     })
}

$('#orgTableManager tbody').on( 'click', 'a', function () {
                    var tr = $(this).closest('tr').children();
                    currentCorpID = $("#orgTableManager").dataTable().fnGetData(tr)["CorpID"]
                    corp_id=currentCorpID;
                    ajaxCallForGettingLeaves(currentCorpID)
               })

$("#calendar").on("click",".fc-prev-button",function(){
    calenderInit(corp_id)
    ajaxCallForGettingLeaves(corp_id)
})

$("#calendar").on("click",".fc-next-button",function(){
    calenderInit(corp_id)
    ajaxCallForGettingLeaves(corp_id)
})

 function calenderInit(id){
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month'
      },
      viewRender: function(view, element) {
        ajaxCallForGettingLeaves(id)
        console.log("The view's title is " + view.intervalStart.format());
        console.log("The view's title is " + view.name);
        },


      navLinks: true, // can click day/week names to navigate views
      <!--selectable: true,  for a combine selection-->
      selectHelper: true,
      editable: true,
      <!--eventLimit: true, // allow "more" link when too many events-->



        dayClick: function(date)
        {
            console.log($(this).attr("data-date"))
            HolidayFlag="false"
            TotalHolidays = jsonDataForWatersHolidays()
//            console.log(Object.keys(TotalHolidays[0]).length)
            console.log(TotalHolidays.length)
            var day
            for(var i=0;i<TotalHolidays.length;i++)
                {
                    if(TotalHolidays[i]["date"].split("/").reverse().join("-")==$(this).attr("data-date"))
                        {
                            day=TotalHolidays[i]["day"]
                            console.log("True krne aagya hu bhaya")
                            HolidayFlag="true"
                        }
                }
            if(date.isoWeekday() == 6 || date.isoWeekday() == 7){
                alert("Select Working day For apply leave")
            }
            else{
                a = $.fullCalendar.formatDate( date, 'DD/MM/YYYY' )
                console.log(" inside date dayclickevent " + a)
                daySelectEvent=this
//                console.log($( this ).css( "background-color" ))
                if($( this ).css( "background-color" ) == "rgb(255, 0, 0)" || $( this ).css( "background-color" ) == "rgb(0, 0, 255)" || $(this).hasClass("bg-primary") || $(this).hasClass("bg-danger")  || $( this ).css( "background-color" ) == "rgb(220, 53, 69)" || $( this ).css( "background-color" ) == "rgb(0, 123, 255)")
                    {
                        $('#exampleModal124').modal('toggle');
                    }
                else if(HolidayFlag=="true"){
                        alert("Already holiday of "+day)
                       }
                      else{
                        $('#exampleModal123').modal('toggle');
                      }
            }
         }
     });
  }
       $("#perleavesubmit").on('click',function(){
//            HoldOn.open(options)
            console.log(" inside submitevent for fullday a = " + a );
                        $.ajax({
                                data: {
                                    Date : a,
                                    LeaveType:1,
                                    CorpID:corp_id
                                        },
                                type:"POST",
                                url: '/applyLeave',
                                dataType: 'json',
                                success: function (data)
                                {
//                                  alert("inside full day success")
                                    $(daySelectEvent).css('background-color', 'red');
                                    $.ajax({
                                        data:{
                                            Date:a,
                                            LeaveType:"FullDay",
                                            CorpID:corp_id,
                                            CalKey:"vCal"
                                        },
                                        type:"POST",
                                        dataType:'json',
                                        url:'/send-mail',
                                        success:function()
                                        {
                                            HoldOn.close()
                                        },
                                        error:function()
                                        {
                                      alert("Not sent")

                                        }
                                    })
                                },
                                error: function (error)
                                {
//                                    alert("inside full day error")

                                },
                                complete: function () {

                                }
                         })
            })

     $("#perleavesubmitHalfDay").on('click',function(){
//            HoldOn.open(options)
            console.log(" inside submiteventforhalfday a = " + a);
                        $.ajax({
                                data: {
                                    Date : a,
                                    LeaveType:2,
                                    CorpID:corp_id
                                        },
                                type:"POST",
                                url: '/applyLeave',
                                dataType: 'json',
                                success: function (data)
                                {
                                    console.log(data)
                                    $(daySelectEvent).css('background-color', 'blue');
                                    $.ajax({
                                        data:{
                                            Date:a,
                                            LeaveType:"HalfDay",
                                            CorpID:corp_id,
                                            CalKey:"vCal"
                                        },
                                        type:"POST",
                                        dataType:'json',
                                        url:'/send-mail',
                                        success:function()
                                        {
//                                            HoldOn.close()
                                        },
                                        error:function()
                                        {
                                        alert("Not sent")

                                        }
                                    })
                                },
                                error: function (error)
                                {


                                },
                                complete: function () {
                                }
                         })
            })



     $(".cancelSubmit").on("click", function(){

                $('#calendar').fullCalendar()

            })

function ajaxCallForGettingLeaves(id){
            console.log(id, " --- ")
            var holidays
            var url=id!="" && id!=undefined && id!=null ? '/showPersonalLeave?corpid='+id : '/showPersonalLeave'
            console.log(url ," ::: url :::" )
            $.get({
              url: url,
              dataType: 'json',
              success: function (data)
              {
              calenderInit()
                  console.log("ajaxCallForGettingLeaves")
                  console.log("*********************************")
                  console.log(data)
                  console.log("*********************************")
                  console.log(" in success ")
                  $(".fc-day-header fc-widget-header fc-sat").disabled
                  $(".fc-view-container").find(".fc-row").find("td").removeClass("bg-primary")
                  $(".fc-view-container").find(".fc-row").find("td").removeClass("bg-danger")
                  for(var i = 0; i<data.length; i++){
                      $(".fc-view-container").find(".fc-row").find("td").attr("data-date")
						console.log($(".fc-view-container").find(".fc-row").find("td").attr("data-date"))
						console.log(data[i][0].split("/").reverse().join("-") )
                          	  console.log($(this).attr("data-date")+" ")
                      $.each($(".fc-view-container").find(".fc-row").find("td"), function(){
                          if(data[i][0].split("/").reverse().join("-") === $(this).attr("data-date") && data[i][1]=='1'){
                              $(this).addClass("bg-danger")
                          }
                          else if(data[i][0].split("/").reverse().join("-") === $(this).attr("data-date") && data[i][1]=='2'){
                              $(this).addClass("bg-primary")
                          }
                      })
                  }
//                  $(daySelectEvent).css('background-color', 'red');
              },
              error: function (error)
              {
//                  location.reload(true);
                  console.log(a)

              },
              complete: function () {
                   console.log("Red");
              }
           })

        }

function jsonDataForWatersHolidays(){

        $.ajax({
        dataType:'json',
        url:"/dj",
        type:'get',
        success:function(data){

            for (var i = 0;i<data["waters holidays 2018"].length;i++)
            {
                holidays[i]=data["waters holidays 2018"][i]
//                console.log(this)
//                if(this == holidays[i]){
//                    console.log(holidays[i])
//                    break
//                }
            }
        },
        error:function(error){
            alert(error)
        }
    })
    return holidays
}










