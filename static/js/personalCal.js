
var a
var leavetype
var corpID
var daySelectEvent
var holidays=[]
var options = {
     theme:"sk-cube-grid",
     message:'Please wait !! Your Leave application on process...',
     textColor:"white"
};

//var user
  $(document).ready(function() {


        $("#FullDayEmployee").on('click',function(){
            HoldOn.open(options)
            console.log("inside submitevent for fullday a = " + a );
                        $.ajax({
                                data: {
                                    Date : a,
                                    LeaveType:1,
                                    CorpID:corpID,
                                        },
                                type:"POST",
                                url: '/applyLeave',
                                dataType: 'json',
                                success: function (data)
                                {
//                                  alert("inside full day success")
//                                    $(daySelectEvent).css('background-color', 'red');
//                                    $.ajax({
//                                        data:{
//                                            Date:a,
//                                            LeaveType:"FullDay",
//                                            CorpID:corpID,
//                                            CalKey:'pCal'
//                                        },
//                                        type:"POST",
//                                        dataType:'json',
//                                        url:'/send-mail',
//                                        success:function()
//                                        {
//                                            HoldOn.close()
//                                        },
//                                        error:function()
//                                        {
//                                        //alert("Not sent")
//
//                                        }
//                                    })
                                    HoldOn.close()
                                },
                                error: function (error)
                                {
                                    alert("inside full day error")

                                },
                                complete: function () {

                                }
                         })
            })



             $("#HalfDayEmployee").on('click',function(){
             HoldOn.open(options)
             console.log(" inside submiteventforhalfday a = " + a);
                        $.ajax({
                                data: {
                                    Date : a,
                                    LeaveType:2,
                                    CorpID:corpID
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
                                            CorpID:corpID,
                                            CalKey:'pCal'
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
                                        //alert("Not sent")

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

            $("#Non-WIPL").on('click',function(){
            HoldOn.open(options)
            console.log("inside submitevent for Non-WIPL a = " + a );
                        $.ajax({
                                data: {
                                    Date : a,
                                    LeaveType:3,
                                    CorpID:corpID,
                                        },
                                type:"POST",
                                url: '/applyLeave',
                                dataType: 'json',
                                success: function (data)
                                {
                                  alert("inside full day success")
                                    $(daySelectEvent).css('background-color', 'gray');
//                                    $.ajax({
//                                        data:{
//                                            Date:a,
//                                            LeaveType:"Non-WIPL",
//                                            CorpID:corpID,
//                                            CalKey:'pCal'
//                                        },
//                                        type:"POST",
//                                        dataType:'json',
//                                        url:'/send-mail',
//                                        success:function()
//                                        {
//                                            HoldOn.close()
//                                        },
//                                        error:function()
//                                        {
//                                        //alert("Not sent")
//
//                                        }
//                                    })
                                      HoldOn.close()
                                },
                                error: function (error)
                                {
                                    alert("inside Non-WIPL  error")

                                },
                                complete: function () {

                                }
                         })
            })

       jsonDataForWatersHolidays()
       getPersonalCorpus()
  });

  function calenderInit(id){
   console.log(id)
    $('#personalCalendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month'
      },
      viewRender: function(view, element){
        ajaxCallForGettingLeaves(id)
        },
      navLinks: true, // can click day/week names to navigate views
      <!--selectable: true,  for a combine selection-->
      selectHelper: true,
      editable: true,
      <!--eventLimit: true, // allow "more" link when too many events-->
        dayClick: function(date)
        {
            console.log($(this).attr("data-date"))
            console.log(date)
            currentDate = $(this).attr("data-date")
            HolidayFlag="false"
            TotalHolidays = jsonDataForWatersHolidays()
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
            console.log(HolidayFlag)

            if(date.isoWeekday() == 6 || date.isoWeekday() == 7){
                alert("Select Working day For apply leave")
            }
            else{
                a = $.fullCalendar.formatDate( date, 'DD/MM/YYYY' )
                console.log(" inside date dayclickevent " + a)
                daySelectEvent=this
                console.log($( this ).css( "background-color" ))
                if($( this ).css( "background-color" ) == "rgb(255, 0, 0)" || $( this ).css( "background-color" ) == "rgb(0, 0, 255)" || $(this).hasClass("bg-primary") || $(this).hasClass("bg-danger") || $( this ).css( "background-color" ) == "rgb(128, 128, 128)")
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


   function getPersonalCorpus(){
            $.get({
                 url: '/getCurrentUser',
                 dataType: 'json',
                 success: function (data){
                     console.log(" getCurrentUser ", data, "=====")
                     ajaxCallForGettingLeaves(data)
                     corpID=data
                 }
            })
    }





     $(".cancelSubmit").on("click", function(){
         $('#calendar').fullCalendar()
      })

function ajaxCallForGettingLeaves(id){
            console.log("Inside getting leave for manager")
            console.log(id," --- id --- ")
            var holidays
            var url=id!="" && id!=undefined && id!=null ? '/showPersonalLeave?corpid='+id : '/showPersonalLeave'
            console.log(url ," ::: url :::" )
            $.get({
              url: url,
              dataType: 'json',
              success: function (data)
              {
              console.log(data)
              calenderInit(id)
                  $(".fc-day-header fc-widget-header fc-sat").disabled
                  $(".fc-view-container").find(".fc-row").find("td").removeClass("bg-primary")
                  for(var i = 0; i<data.length; i++){
                      $(".fc-view-container").find(".fc-row").find("td").attr("data-date")
						console.log($(".fc-view-container").find(".fc-row").find("td").attr("data-date"))
						console.log(data[i][0].split("/").reverse().join("-") )
                          	  console.log($(this).attr("data-date")+" ")
                      $.each($(".fc-view-container").find(".fc-row").find("td"), function(){
                          if(data[i][0].split("/").reverse().join("-") === $(this).attr("data-date") && data[i][1]=='1'){
                              $(this).css('background-color','red')
                          }
                          else if(data[i][0].split("/").reverse().join("-") === $(this).attr("data-date") && data[i][1]=='2'){
                              $(this).addClass("bg-primary")
                          }
                          else if(data[i][0].split("/").reverse().join("-") === $(this).attr("data-date") && data[i][1]=='3'){
                              $(this).css('background-color','gray')
                          }
                      })
                  }
                  $(daySelectEvent).css('background-color', 'red');
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
