$(document).ready(function(){
$("#monthS").on("change",function(){
        setTimeout(function(){
        window.location.href = "?mon="+ $("#monthS").val();
        },1000)
        })
})