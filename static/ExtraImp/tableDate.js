var first=Date.today()
var second=Date.today().add(1).days();
var third=Date.today().add(2).days();
var fourth=Date.today().add(3).days();
var fifth=Date.today().add(4).days();

	if(Date.today().is().friday()){  //friday
		first=Date.today().toString('dd/MM/yyyy');
		second=Date.today().add(3).days().toString('dd/MM/yyyy');
		third=Date.today().add(4).days().toString('dd/MM/yyyy');
		fourth=Date.today().add(5).days().toString('dd/MM/yyyy');
		fifth=Date.today().add(6).days().toString('dd/MM/yyyy'); } 
		else if(second.is().friday()){
			first=Date.today().toString('dd/MM/yyyy');
			second=Date.today().add(1).days().toString('dd/MM/yyyy');
			third=Date.today().add(4).days().toString('dd/MM/yyyy');
			fourth=Date.today().add(5).days().toString('dd/MM/yyyy');
			fifth=Date.today().add(6).days().toString('dd/MM/yyyy');
				}else if(third.is().friday()){
					first=Date.today().toString('dd/MM/yyyy');
					second=Date.today().add(1).days().toString('dd/MM/yyyy');
					third=Date.today().add(2).days().toString('dd/MM/yyyy');
					fourth=Date.today().add(5).days().toString('dd/MM/yyyy');
					fifth=Date.today().add(6).days().toString('dd/MM/yyyy');	
					}else if(fourth.is().friday()){
						first=Date.today().toString('dd/MM/yyyy');
						second=Date.today().add(1).days().toString('dd/MM/yyyy');
						third=Date.today().add(2).days().toString('dd/MM/yyyy');
						fourth=Date.today().add(3).days().toString('dd/MM/yyyy');
						fifth=Date.today().add(6).days().toString('dd/MM/yyyy');	
						}else if(fifth.is().friday()){
							first=Date.today().toString('dd/MM/yyyy');
							second=Date.today().add(1).days().toString('dd/MM/yyyy');
							third=Date.today().add(2).days().toString('dd/MM/yyyy');
							fourth=Date.today().add(3).days().toString('dd/MM/yyyy');
							fifth=Date.today().add(4).days().toString('dd/MM/yyyy');
						}
var one=document.getElementById("currdate")
var two=document.getElementById("date2")
var three=document.getElementById("date3")
var four=document.getElementById("date4")
var five=document.getElementById("date5")

one.innerHTML= first
two.innerHTML= second
three.innerHTML= third
four.innerHTML= fourth
five.innerHTML= fifth
