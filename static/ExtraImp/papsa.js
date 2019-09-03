//onfocus for inputboxes
	var el = $('input[type=text], textarea');
	el.focus(function (e) {
	if (e.target.value == e.target.defaultValue)
	e.target.value = '';
	});
	el.blur(function (e) {
	if (e.target.value == '')
	e.target.value = e.target.defaultValue;
	});
	//Counter
	$('.counter-count').each(function () {
	$(this).prop('Counter', 0).animate({ Counter: $(this).text() },
	{
	duration: 2000,
	easing: 'swing',
	step: function (now) {
	$(this).text(Math.ceil(now))
	}
	})
	})

	var viewModel = function () {
	var self = this;

	self.adminName0 = ko.observable('');
	self.adminName1 = ko.observable('');

	self.IsTemp0 = ko.observable(false);
	self.IsTemp1 = ko.observable(false);

	self.admins = ko.observableArray([]);

	self.checkTemp = function (id) {
	for (i = 0; i < self.admins().length; i++) {
	if (id === self.admins()[i].AdminId) {
	return self.admins()[i].IsTemp == true ? true : false;
	}
	}
	};

	self.adminName0.subscribe(function (data) {
	if (data != null && data != undefined && data != "") {

	self.checkTemp(data) === true ? self.IsTemp0(true) : self.IsTemp0(false);
	}
	});

	self.adminName1.subscribe(function (data) {
	if (data != null && data != undefined && data != "") {
	console.log(data, "id");
	self.checkTemp(data) === true ? self.IsTemp1(true) : self.IsTemp1(false);
	}
	});

	$.ajaxGet('/collegeadmin/getadmins', function (data) {
	data.splice(0, 0, { AdminId: '', Email: '', IsTemp: '' });
	//data.unshift({ AdminId: '', Email: '', IsTemp: false });
	self.admins(data);
	});
	}
	window.vm = new viewModel();
	ko.applyBindings(vm);

	var table;
	var data;
	var myPieChart;
	var studentCount = 0;
	//var myPieChart2;
	var totalCount;
	var scorecount25 = 0;
	var scorecount50 = 0;
	var scorecount75 = 0;
	var scorecount100 = 0;
	$(document).ready(function () {
	var hideEdit = 'true';
	if (hideEdit != undefined && hideEdit != null && hideEdit != '' && hideEdit.toLowerCase() === "false") {
	$("#EditProfile").hide();
	}
	var ctx = document.getElementById("chart-area").getContext("2d");


	$('.startDate').datetimepicker({
	locale: 'en',
	//minDate: moment(),
	format: 'DD/MM/YYYY HH:mm:ss',
	ignoreReadonly: true
	});

	$(".startDate").on("dp.change", function (e) {
	$(this).closest(".row").find(".endDate").data("DateTimePicker").minDate(e.date);
	//$('.endDate').data("DateTimePicker").minDate(e.date);
	});

	$('.endDate').datetimepicker({
	locale: 'en',
	//minDate: moment(),
	format: 'DD/MM/YYYY HH:mm:ss',
	ignoreReadonly: true,
	});

	$('.summernote').summernote({
	placeholder: 'Start writing here.....',
	height: 200,
	toolbar: [
	['style', ['bold', 'italic', 'underline', 'clear']],
	['font', ['strikethrough', 'superscript', 'subscript']],
	['fontsize', ['fontsize']],
	['color', ['color']],
	['para', ['ul', 'ol', 'paragraph']],
	['height', ['height']]
	]
	});

	$("#progress").show();

	//HoldOn.open(loaderoptions);

	$.ajaxGet('/CollegeAdmin/GetCandidates?testCodeId=' + '&qualificationId=' + '&specializationId=' + '&year=' + '&status=', function (data) {
	//getScoresCount(data);
	console.log(data);

	updateTotalStudentsCount(data);
	activeStudentsCount(data);

	totalCount = data.length;
	studentCount = totalCount;
	table = $('#example').DataTable({
	"data": data,
	"oLanguage": { "sEmptyTable": "No Student meet the search criteria" },
	"initComplete": function (settings, json) {
	$(".buttons-excel").prepend("<i class=\"fa fa-download\" style='margin-right:5px;'></i>");
	$(".shareButton").prepend("<i class=\"fa fa-share\" style='margin-right:5px;'></i>");
	$(".customiseButton").prepend("<i class=\"fa fa-edit\" style='margin-right:5px;'></i>");
	$(".nonActiveButton").prepend("<i class=\"fa fa-ban\" style='margin-right:5px;'></i>");
	$(".activeButton").prepend("<i class=\"fa fa-check-square\" style='margin-right:5px;'></i>");
	$(".emailButton").prepend("<i class=\"fa fa-envelope\" style='margin-right:5px;'></i>");
	$("#progress").hide();

	var config = {
	type: 'doughnut',
	data: {
	datasets: [{
	data: [

	totalCount,
	getSelectedCount()
	],
	backgroundColor: [
	'#ff7f27',

	'#00a2e8'
	],
	label: 'Dataset 1'
	}],
	labels: [
	"Total",
	"Selected",
	]
	},
	options: {
	responsive: true,
	legend: {
	display: true,
	labels: {
	//fontColor: 'rgb(255, 99, 132)',
	boxWidth: 10
	},
	position: 'right'
	}
	}

	};

	myPieChart = new Chart(ctx, config);

	//var config2 = {
	// type: 'pie',
	// data: {
	// datasets: [{
	// data: [
	// scorecount25,
	// scorecount50,
	// scorecount75,
	// scorecount100
	// ],
	// backgroundColor: [
	// 'Green',
	// 'red',
	// 'blue',
	// 'yellow'
	// ],
	// label: 'Dataset 2'
	// }],
	// labels: [
	// "0-25%",
	// "25-50%",
	// "50-75%",
	// "75-100%"
	// ]
	// },
	// options: {
	// responsive: true
	// }
	//};
	//myPieChart2 = new Chart(ctx2, config2);
	},
	"lengthMenu": [10, 25, 50, 75, 100],
	"scrollY": 5200,
	"scrollCollapse": true,
	"scrollX": true,
	'columnDefs': [{
	'targets': 0,
	'searchable': false,
	'orderable': false,
	'className': 'dt-body-center',
	'render': function (data, type, full, meta) {
	return '<input type="checkbox" name="Pick" value="' + $('<div/>').text(data).html() + '">';
	}
	},
	{ "width": "140px", "targets": 1 },
	{
	"targets": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 31],
	"visible": true,
	},
	],
	select: {
	style: 'multi'
	},
	'order': [[1, 'asc']],
	dom: '<"toolbar">Bfrtip',
	buttons: [
	{
	extend: 'excel',
	text: 'Excel Download',

	exportOptions: {
	columns: ':visible'
	},
	action: function (e, dt, button, config) {
	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(true);
	}
	var column27 = table.column(27);
	column27.visible(false);
	var column28 = table.column(28);
	column28.visible(false);
	var column29 = table.column(29);
	column29.visible(false);
	var column30 = table.column(30);
	column30.visible(true);
	var column31 = table.column(31);
	column31.visible(true);
	var column32 = table.column(32);
	column32.visible(false);
	var column33 = table.column(33);
	column33.visible(true);
	table.columns(33).visible(false);
	table.columns(34).visible(true);

	$.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);

	for (var i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(false);
	}
	column27.visible(true);
	column28.visible(true);
	column29.visible(true);
	column30.visible(false);
	column31.visible(false);
	column32.visible(false);
	column33.visible(false);
	table.columns(33).visible(false);
	table.columns(34).visible(false);
	}
	},
	//{
	// extend: 'excel',
	// text: 'Excel All',
	// header: true,
	// exportOptions: {

	// modifier: {
	// selected: null,
	// columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
	// }
	// },
	// action: function (e, dt, button, config) {
	// for (i = 6; i <= 26; i++) {
	// var column = table.column(i);
	// column.visible(true);
	// }

	// var column27 = table.column(27);
	// column27.visible(false);
	// var column28 = table.column(28);
	// column28.visible(false);

	// $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);

	// for (var i = 6; i <= 26; i++) {
	// var column = table.column(i);
	// column.visible(false);
	// }
	// column27.visible(true);
	// column28.visible(true);
	// }
	//},
	{
	text: 'Share',
	className: 'shareButton',
	action: function (e, dt, node, config) {
	if ($("input[name='Pick']:checked").length > 0) {
	$("#myModal").modal('toggle');
	}
	else {
	alert("please select candidate.")
	}
	}
	},
	{
	text: 'Customise',
	className: 'customiseButton',
	action: function (e, dt, node, config) {
	$("#editColumnsModal").modal('toggle');
	}
	},
	{
	text: 'Placed/Inactive',
	className: 'nonActiveButton',
	//action: function (e, dt, node, config) {

	//}
	},
	{
	text: 'Active',
	className: 'activeButton',
	//action: function (e, dt, node, config) {

	//}
	},
	{
	text: 'Notify',
	className: 'emailButton',
	action: function (e, dt, node, config) {
	if ($("input[name='Pick']:checked").length > 0) {
	var candidatedetailIds = [];
	$.each($("input[name='Pick']:checked"), function () {
	var candidatedetailid = $(this).val();
	candidatedetailIds.push(candidatedetailid);
	});

	var data = { "candidatedetailid": candidatedetailIds };

	$.ajaxPost('/collegeadmin/getemails', data, function (data) {
	if (data.Emails != null && data.Emails != "") {
	$("#MsgTo").val(data.Emails);
	$("#mailMessageModal").modal('toggle');
	}
	});
	}
	else {
	$("#mailMessageModal").modal('toggle');
	}
	}
	},
	],
	"columns": [
	{ "data": "CandidateDetailId" },
	{ "data": "Name" },
	{ "data": "Percentage" },
	{ "data": "Qualification" },
	{ "data": "Stream" },
	{ "data": "Year" },
	{ "data": "NumericalAbillityScore" },
	{ "data": "VerbalCommunicationScore" },
	{ "data": "Comprehension" },
	{ "data": "LogicalScore" },
	{ "data": "SituationalJudgementScore" },
	{ "data": "CreativityScore" },
	{ "data": "DecisionMakingScore" },
	{ "data": "EmotionalStabilityScore" },
	{ "data": "FightvsFightScore" },
	{ "data": "HandlingConflictScore" },
	{ "data": "InnovationScore" },
	{ "data": "MoralityScore" },
	{ "data": "NegotiationScore" },
	{ "data": "OpennessScore" },
	{ "data": "OpennessToLearningScore" },
	{ "data": "ResourcefulnessScore" },
	{ "data": "SelfEsteemScore" },
	{ "data": "TeamManagementScore" },
	{ "data": "TeamPlayerScore" },
	{ "data": "VisionApproachScore" },
	{ "data": "TotalScore" },
	{
	"data": "ReportUrl",
	"render": function (data, type, row, meta) {
	if (type === 'display') {
	if (data != null) {
	data = '<a href="' + data + '" target="_blank"><i class="fa fa-download"></i></a>';
	}
	else {
	data = ""
	}
	}

	return data;
	}
	},
	{
	"data": "ResumeUrl",
	"render": function (data, type, row, meta) {
	if (type === 'display') {
	if (data != null) {
	data = '<a href="' + data + '" target="_blank"><i class="fa fa-download"></i></a>';
	}
	else {
	data = '<a class="resumeLink"><img src="https://careergraph.pexiscore.com/images/Spinner.gif" class="resumeloader" style="display:none;height:25px;width:25px"/><i class="fa fa-download resume"></i></a>';
	}
	}

	return data;
	}
	},
	{
	"data": "IsCandidateInactive",
	"render": function (data, type, row, meta) {
	if (type === 'display') {
	if (data == 0) {
	data = '<a data-active="' + data + '" class="activeInactive"><i class="fa fa-check"></i></a>';

	}
	else {
	data = '<a data-active="' + data + '" class="activeInactive"><i class="fa fa-times"></i></a>';

	}
	}
	return data;
	}
	},
	{ "data": "RecommendedIndustries" },
	{ "data": "PreferredLocations" },
	{ "data": "CollegeCode" },
	{
	"data": "IsShortlisted",
	"render": function (data, type, row, meta) {
	if (type === 'display') {
	if (data == 1) {
	data = '<a data-shortlisted="' + data + '" ><i class="fa fa-check"></i></a>';

	}
	else {
	data = '<a data-shortlisted="' + data + '" ><i class="fa fa-times"></i></a>';

	}
	}
	return data;
	}
	},
	{ "data": "CompanyNames" },
	{ "data": "SkillScore" }
	],
	//"rowCallback": function (row, data, index) {
	// if (table != null) {
	// for (i = 6; i <= 26; i++) {
	// var column = table.column(i);
	// column.visible(true);
	// }
	// }
	// var totalVal = $(row).find('td:eq(26)')[0];

	// if ($(row).find('td:eq(26)')[0] != null) {
	// totalVal = $(row).find('td:eq(26)')[0].innerHTML;
	// }
	// else {
	// totalVal = 90;
	// }

	// if (totalVal <= 30 || totalVal == null) {

	// $(row).find('td:eq(1)').css('background-color', 'rgb(230, 148, 148)');
	// }
	// else if (totalVal > 30 && totalVal < 60) {

	// $(row).find('td:eq(1)').css('background-color', '#e4e44a');
	// }
	// else if (totalVal >= 60) {

	// $(row).find('td:eq(1)').css('background-color', '#6cd26c');
	// }
	// for (i = 6; i <= 25; i++) {
	// var val = $(row).find('td:eq(' + i + ')')[0].innerHTML;

	// if (val <= 30) {

	// $(row).find('td:eq(' + i + ')').css('background-color', 'rgb(230, 148, 148)');
	// }
	// else if (val > 30 && val < 60) {

	// $(row).find('td:eq(' + i + ')').css('background-color', '#e4e44a');
	// }
	// else if (val >= 60) {

	// $(row).find('td:eq(' + i + ')').css('background-color', '#6cd26c');
	// }
	// }
	// if (table != null) {
	// for (i = 6; i <= 26; i++) {
	// var column = table.column(i);
	// column.visible(true);
	// }
	// }
	//}
	});

	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(false);
	}
	var column30 = table.column(30);
	column30.visible(false);
	var column31 = table.column(31);
	column31.visible(false);
	var column32 = table.column(32);
	column32.visible(false);
	table.columns(33).visible(false);
	table.columns(34).visible(false);
	table.columns(35).visible(false);
	//var column35 = table.column(35);
	//coulumn35.visible(false);


	$(".filter").on('change', function () {
	table.draw();
	});

	$('#hide').css('display', 'block');

	$('#example').resize();

	$('#example tbody').on('click', 'tr', function () {

	ckb = $(this).children("td").find('[type="checkbox"]').is(':checked');
	if (ckb != true) {
	$(this).addClass('selected');
	$(this).children("td").find('input[type="checkbox"]').prop('checked', true);
	}
	if (ckb != false) {
	$(this).removeClass('selected');
	$(this).children("td").find('input[type="checkbox"]').prop('checked', false);
	}

	getSelectedCount();
	myPieChart.data.datasets[0].data[0] = getUpdatedTotalCount();
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();
	});

	$('#example').on("click", 'tbody tr td input[type="checkbox"]', function () {
	var checck = this.checked;

	if (checck) {
	$(this).closest("tr").toggleClass('selected');
	$(this).prop('checked', true);
	}
	else {
	$(this).closest("tr").toggleClass('selected');
	$(this).prop('checked', false);
	}
	getSelectedCount();
	myPieChart.data.datasets[0].data[0] = getUpdatedTotalCount();
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();
	})

	$('#example').on("click", 'input[type="checkbox"]', function () {
	var checck = this.checked;
	if (!checck) {
	$(this).prop('checked', true);
	$(this).closest("tr").addClass('selected');
	}
	else {
	$(this).closest("tr").removeClass('selected');
	$(this).prop('checked', false);
	}

	getSelectedCount();
	myPieChart.data.datasets[0].data[0] = totalCount;
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();
	})

	$('#example-select-all').on('click', function () {
	// Get all rows with search applied
	var rows = table.rows({ 'search': 'applied' }).nodes();
	// Check/uncheck checkboxes for all rows in the table
	if (this.checked) {
	$('input[type="checkbox"]', rows).prop('checked', this.checked);
	$('input[type="checkbox"]', rows).closest("tr").addClass("selected");
	}
	if (!this.checked) {
	$('input[type="checkbox"]', rows).prop('checked', this.checked);
	$('input[type="checkbox"]', rows).closest("tr").removeClass("selected");
	}
	getSelectedCount();
	myPieChart.data.datasets[0].data[0] = getUpdatedTotalCount();
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();

	});

	$('#example tbody').on('change', 'input[type="checkbox"]', function () {
	// If checkbox is not checked
	getSelectedCount();
	myPieChart.data.datasets[0].data[0] = totalCount;
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();

	if (!this.checked) {
	var el = $('#example-select-all').get(0);
	// If "Select all" control is checked and has 'indeterminate' property
	if (el && el.checked && ('indeterminate' in el)) {
	// Set visual state of "Select all" control
	// as 'indeterminate'
	el.indeterminate = true;
	}
	}
	});

	//pass an array in the buttons to enable or disable button on condition
	//table.buttons(['']).enable(
	// table.rows({ selected: true }).indexes().length === 0 ?
	// false :
	// true
	// );

	$('#minScore, #maxScore').keyup(function () {
	table.draw();
	});

	$.fn.dataTable.ext.search.push(
	function (settings, data, dataIndex) {
	var numericalScore = $(".numericalAbility").val();
	var nMin = 0
	var nMax = 100;
	if (numericalScore == 1) {
	nMin = 0;
	nMax = 30;
	}
	else if (numericalScore == 2) {
	nMin = 31;
	nMax = 50;
	}
	else if (numericalScore == 3) {
	nMin = 51;
	nMax = 80;
	}
	else if (numericalScore == 4) {
	nMin = 81;
	nMax = 100;
	}
	var numerical = parseFloat(data[6]) || 0

	var verbalScore = $(".verbal").val();
	var vMin = 0
	var vMax = 100;
	if (verbalScore == 1) {
	vMin = 0;
	vMax = 30;
	}
	else if (verbalScore == 2) {
	vMin = 31;
	vMax = 50;
	}
	else if (verbalScore == 3) {
	vMin = 51;
	vMax = 80;
	}
	else if (verbalScore == 4) {
	vMin = 81;
	vMax = 100;
	}
	var verbal = parseFloat(data[7]) || 0


	var comprehensionScore = $(".comprehension").val();
	var cMin = 0
	var cMax = 100;
	if (comprehensionScore == 1) {
	cMin = 0;
	cMax = 30;
	}
	else if (comprehensionScore == 2) {
	cMin = 31;
	cMax = 50;
	}
	else if (comprehensionScore == 3) {
	cMin = 51;
	cMax = 80;
	}
	else if (comprehensionScore == 4) {
	cMin = 81;
	cMax = 100;
	}
	var comprehension = parseFloat(data[8]) || 0

	var logicalScore = $(".logical").val();
	var lMin = 0
	var lMax = 100;
	if (logicalScore == 1) {
	lMin = 0;
	lMax = 30;
	}
	else if (logicalScore == 2) {
	lMin = 31;
	lMax = 50;
	}
	else if (logicalScore == 3) {
	lMin = 51;
	lMax = 80;
	}
	else if (logicalScore == 4) {
	lMin = 81;
	lMax = 100;
	}
	var logical = parseFloat(data[9]) || 0

	var situationScore = $(".situtational").val();
	var sMin = 0
	var sMax = 100;
	if (situationScore == 1) {
	sMin = 0;
	sMax = 30;
	}
	else if (situationScore == 2) {
	sMin = 31;
	sMax = 50;
	}
	else if (situationScore == 3) {
	sMin = 51;
	sMax = 80;
	}
	else if (situationScore == 4) {
	sMin = 81;
	sMax = 100;
	}
	var situtational = parseFloat(data[10]) || 0

	var creativityScore = $(".creativity").val();
	var bcMin = 0
	var bcMax = 100;
	if (creativityScore == 1) {
	bcMin = 0;
	bcMax = 30;
	}
	else if (creativityScore == 2) {
	bcMin = 31;
	bcMax = 50;
	}
	else if (creativityScore == 3) {
	bcMin = 51;
	bcMax = 80;
	}
	else if (creativityScore == 4) {
	bcMin = 81;
	bcMax = 100;
	}
	var creativity = parseFloat(data[11]) || 0

	var decisionmakingScore = $(".decisionmaking").val();
	var dsMin = 0
	var dsMax = 100;
	if (decisionmakingScore == 1) {
	dsMin = 0;
	dsMax = 30;
	}
	else if (decisionmakingScore == 2) {
	dsMin = 31;
	dsMax = 50;
	}
	else if (decisionmakingScore == 3) {
	dsMin = 51;
	dsMax = 80;
	}
	else if (decisionmakingScore == 4) {
	dsMin = 81;
	dsMax = 100;
	}
	var decisionmaking = parseFloat(data[12]) || 0

	var emotionalScore = $(".emotional").val();
	var emmin = 0
	var emmax = 100;
	if (emotionalScore == 1) {
	emmin = 0;
	emmax = 30;
	}
	else if (emotionalScore == 2) {
	emmin = 31;
	emmax = 50;
	}
	else if (emotionalScore == 3) {
	emmin = 51;
	emmax = 80;
	}
	else if (emotionalScore == 4) {
	emmin = 81;
	emmax = 100;
	}
	var emotional = parseFloat(data[13]) || 0

	var fightScore = $(".fight").val();
	var fMin = 0
	var fMax = 100;
	if (fightScore == 1) {
	fMin = 0;
	fMax = 30;
	}
	else if (fightScore == 2) {
	fMin = 31;
	fMax = 50;
	}
	else if (fightScore == 3) {
	fMin = 51;
	fMax = 80;
	}
	else if (fightScore == 4) {
	fMin = 81;
	fMax = 100;
	}
	var fight = parseFloat(data[14]) || 0

	var handlingConflictScore = $(".handlingConflict").val();
	var hcMin = 0
	var hcMax = 100;
	if (handlingConflictScore == 1) {
	hcMin = 0;
	hcMax = 30;
	}
	else if (handlingConflictScore == 2) {
	hcMin = 31;
	hcMax = 50;
	}
	else if (handlingConflictScore == 3) {
	hcMin = 51;
	hcMax = 80;
	}
	else if (handlingConflictScore == 4) {
	hcMin = 81;
	hcMax = 100;
	}
	var handlingConflict = parseFloat(data[15]) || 0

	var innovationScore = $(".innovation").val();
	var iMin = 0
	var iMax = 100;
	if (innovationScore == 1) {
	iMin = 0;
	iMax = 30;
	}
	else if (innovationScore == 2) {
	iMin = 31;
	iMax = 50;
	}
	else if (innovationScore == 3) {
	iMin = 51;
	iMax = 80;
	}
	else if (innovationScore == 4) {
	iMin = 81;
	iMax = 100;
	}
	var innovation = parseFloat(data[16]) || 0

	var moralityScore = $(".morality").val();
	var moMin = 0
	var moMax = 100;
	if (moralityScore == 1) {
	moMin = 0;
	moMax = 30;
	}
	else if (moralityScore == 2) {
	moMin = 31;
	moMax = 50;
	}
	else if (moralityScore == 3) {
	moMin = 51;
	moMax = 80;
	}
	else if (moralityScore == 4) {
	moMin = 81;
	moMax = 100;
	}
	var morality = parseFloat(data[17]) || 0


	var negotiationScore = $(".negotiation").val();
	var neMin = 0
	var neMax = 100;
	if (negotiationScore == 1) {
	neMin = 0;
	neMax = 30;
	}
	else if (negotiationScore == 2) {
	neMin = 31;
	neMax = 50;
	}
	else if (negotiationScore == 3) {
	neMin = 51;
	neMax = 80;
	}
	else if (negotiationScore == 4) {
	neMin = 81;
	neMax = 100;
	}
	var negotiation = parseFloat(data[18]) || 0


	var openessScore = $(".openess").val();
	var opeMin = 0
	var opeMax = 100;
	if (openessScore == 1) {
	opeMin = 0;
	opeMax = 30;
	}
	else if (openessScore == 2) {
	opeMin = 31;
	opeMax = 50;
	}
	else if (openessScore == 3) {
	opeMin = 51;
	opeMax = 80;
	}
	else if (openessScore == 4) {
	opeMin = 81;
	opeMax = 100;
	}
	var openess = parseFloat(data[19]) || 0


	var opennesstoLearningScore = $(".opennesstoLearning").val();
	var opelMin = 0
	var opelMax = 100;
	if (opennesstoLearningScore == 1) {
	opelMin = 0;
	opelMax = 30;
	}
	else if (opennesstoLearningScore == 2) {
	opelMin = 31;
	opelMax = 50;
	}
	else if (opennesstoLearningScore == 3) {
	opelMin = 51;
	opelMax = 80;
	}
	else if (opennesstoLearningScore == 4) {
	opelMin = 81;
	opelMax = 100;
	}
	var opennesstoLearning = parseFloat(data[20]) || 0



	var resourcefulnessScore = $(".resourcefulness").val();
	var reMin = 0
	var reMax = 100;
	if (resourcefulnessScore == 1) {
	reMin = 0;
	reMax = 30;
	}
	else if (resourcefulnessScore == 2) {
	reMin = 31;
	reMax = 50;
	}
	else if (resourcefulnessScore == 3) {
	reMin = 51;
	reMax = 80;
	}
	else if (resourcefulnessScore == 4) {
	reMin = 81;
	reMax = 100;
	}
	var resourcefulness = parseFloat(data[21]) || 0

	var selfEsteemScore = $(".selfEsteem").val();
	var selesMin = 0
	var seleMax = 100;
	if (selfEsteemScore == 1) {
	selesMin = 0;
	seleMax = 30;
	}
	else if (selfEsteemScore == 2) {
	selesMin = 31;
	seleMax = 50;
	}
	else if (selfEsteemScore == 3) {
	selesMin = 51;
	seleMax = 80;
	}
	else if (selfEsteemScore == 4) {
	selesMin = 81;
	seleMax = 100;
	}
	var selfEsteem = parseFloat(data[22]) || 0

	var teammgmtScore = $(".teammgmt").val();
	var teammgmtMin = 0
	var teammgmtMax = 100;
	if (teammgmtScore == 1) {
	teammgmtMin = 0;
	teammgmtMax = 30;
	}
	else if (teammgmtScore == 2) {
	teammgmtMin = 31;
	teammgmtMax = 50;
	}
	else if (teammgmtScore == 3) {
	teammgmtMin = 51;
	teammgmtMax = 80;
	}
	else if (teammgmtScore == 4) {
	teammgmtMin = 81;
	teammgmtMax = 100;
	}
	var teammgmt = parseFloat(data[23]) || 0

	var teamplayerScore = $(".teamplayer").val();
	var teamplayerMin = 0
	var teamplayerMax = 100;
	if (teamplayerScore == 1) {
	teamplayerMin = 0;
	teamplayerMax = 30;
	}
	else if (teamplayerScore == 2) {
	teamplayerMin = 31;
	teamplayerMax = 50;
	}
	else if (teamplayerScore == 3) {
	teamplayerMin = 51;
	teamplayerMax = 80;
	}
	else if (teamplayerScore == 4) {
	teamplayerMin = 81;
	teamplayerMax = 100;
	}
	var teamplayer = parseFloat(data[24]) || 0

	var visionapproachScore = $(".visionapproach").val();
	var viaMin = 0
	var viaMax = 100;
	if (visionapproachScore == 1) {
	viaMin = 0;
	viaMax = 30;
	}
	else if (visionapproachScore == 2) {
	viaMin = 31;
	viaMax = 50;
	}
	else if (visionapproachScore == 3) {
	viaMin = 51;
	viaMax = 80;
	}
	else if (visionapproachScore == 4) {
	viaMin = 81;
	viaMax = 100;
	}
	var visionapproach = parseFloat(data[25]) || 0
	//var min = parseInt($('#min').val(), 10);
	//var max = parseInt($('#max').val(), 10);
	var min = parseInt($('#minScore').val(), 10);
	var max = parseInt($('#maxScore').val(), 10);
	var age = parseFloat(data[2]) || 0; // use data for the age column

	var SkillScore = $(".skill_Score").val();
	var skillMin = 0
	var skillMax = 100;
	if (SkillScore == 1) {
	skillMin = 0;
	skillMax = 30;
	}
	else if (SkillScore == 2) {
	skillMin = 31;
	skillMax = 50;
	}
	else if (SkillScore == 3) {
	skillMin = 51;
	skillMax = 80;
	}
	else if (SkillScore == 4) {
	skillMin = 81;
	skillMax = 100;
	}
	var skill = parseFloat(data[35]) || 0

	if ((isNaN(nMin) && isNaN(nMax)) ||
	(isNaN(nMin) && age <= nMax) ||
	(nMin <= numerical && isNaN(nMax)) ||
	(nMin <= numerical && numerical <= nMax)) {

	if ((isNaN(vMin) && isNaN(vMax)) ||
	(isNaN(vMin) && age <= vMax) ||
	(vMin <= verbal && isNaN(vMax)) ||
	(vMin <= verbal && verbal <= vMax)) {
	if ((isNaN(cMin) && isNaN(cMax)) || (isNaN(cMin) && age <= cMax) || (cMin <= comprehension && isNaN(cMax)) || (cMin <= comprehension && comprehension <= cMax)) {
	if ((isNaN(lMin) && isNaN(lMax)) || (isNaN(lMin) && age <= lMax) || (lMin <= logical && isNaN(lMax)) || (lMin <= logical && logical <= lMax)) {
	if ((isNaN(sMin) && isNaN(sMax)) || (isNaN(sMin) && age <= sMax) || (sMin <= situtational && isNaN(sMax)) || (sMin <= situtational && situtational <= sMax)) {
	if ((isNaN(bcMin) && isNaN(bcMax)) || (isNaN(bcMin) && age <= bcMax) || (bcMin <= creativity && isNaN(bcMax)) || (bcMin <= creativity && creativity <= bcMax)) {
	if ((isNaN(dsMin) && isNaN(dsMax)) || (isNaN(dsMin) && age <= dsMax) || (dsMin <= decisionmaking && isNaN(dsMax)) || (dsMin <= decisionmaking && decisionmaking <= dsMax)) {
	if ((isNaN(emmin) && isNaN(emmax)) || (isNaN(emmin) && age <= emmax) || (emmin <= emotional && isNaN(emmax)) || (emmin <= emotional && emotional <= emmax)) {
	if ((isNaN(fMin) && isNaN(fMax)) || (isNaN(fMin) && age <= fMax) || (fMin <= fight && isNaN(fMax)) || (fMin <= fight && fight <= fMax)) {
	if ((isNaN(iMin) && isNaN(iMax)) || (isNaN(iMin) && age <= iMax) || (iMin <= innovation && isNaN(iMax)) || (iMin <= innovation && innovation <= iMax)) {
	if ((isNaN(hcMin) && isNaN(hcMax)) || (isNaN(hcMin) && age <= hcMax) || (hcMin <= handlingConflict && isNaN(hcMax)) || (hcMin <= handlingConflict && handlingConflict <= hcMax)) {
	if ((isNaN(moMin) && isNaN(moMax)) || (isNaN(moMin) && age <= moMax) || (moMin <= morality && isNaN(moMax)) || (moMin <= morality && morality <= moMax)) {
	if ((isNaN(neMin) && isNaN(neMax)) || (isNaN(neMin) && age <= neMax) || (neMin <= negotiation && isNaN(neMax)) || (neMin <= negotiation && negotiation <= neMax)) {
	if ((isNaN(opeMin) && isNaN(opeMax)) || (isNaN(opeMin) && age <= opeMax) || (opeMin <= openess && isNaN(opeMax)) || (opeMin <= openess && openess <= opeMax)) {
	if ((isNaN(opelMin) && isNaN(opelMax)) || (isNaN(opelMin) && age <= opelMax) || (opelMin <= opennesstoLearning && isNaN(opelMax)) || (opelMin <= opennesstoLearning && opennesstoLearning <= opelMax)) {
	if ((isNaN(reMin) && isNaN(reMax)) || (isNaN(reMin) && age <= reMax) || (reMin <= resourcefulness && isNaN(reMax)) || (reMin <= resourcefulness && resourcefulness <= reMax)) {
	if ((isNaN(selesMin) && isNaN(seleMax)) || (isNaN(selesMin) && age <= seleMax) || (selesMin <= selfEsteem && isNaN(seleMax)) || (selesMin <= selfEsteem && selfEsteem <= seleMax)) {
	if ((isNaN(teammgmtMin) && isNaN(teammgmtMax)) || (isNaN(teammgmtMin) && age <= teammgmtMax) || (teammgmtMin <= teammgmt && isNaN(teammgmtMax)) || (teammgmtMin <= teammgmt && teammgmt <= teammgmtMax)) {
	if ((isNaN(teamplayerMin) && isNaN(teamplayerMax)) || (isNaN(teamplayerMin) && age <= teamplayerMax) || (teamplayerMin <= teamplayer && isNaN(teamplayerMax)) || (teamplayerMin <= teamplayer && teamplayer <= teamplayerMax)) {
	if ((isNaN(viaMin) && isNaN(viaMax)) || (isNaN(viaMin) && age <= viaMax) || (viaMin <= visionapproach && isNaN(viaMax)) || (viaMin <= visionapproach && visionapproach <= viaMax)) {
	if ((isNaN(min) && isNaN(max)) || (isNaN(min) && age <= max) || (min <= age && isNaN(max)) || (min <= age && age <= max)) {
	if ((isNaN(skillMin) && isNaN(skillMax)) || (isNaN(skillMin) && skill <= skillMax) || (skillMin <= skill && isNaN(skillMax)) || (skillMin <= skill && skill <= skillMax)) {
	return true;
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	}
	return false;
	});
	});

	HoldOn.close();
	});

	//$("#btnShare").on("click", function () {
	// HoldOn.open(loaderoptions);
	// var candidatedata = [];
	// $.each($("input[name='Pick']:checked"), function () {
	// var candidatedetailid = $(this).val();
	// candidatedata.push(candidatedetailid);
	// });

	// var emails = $("#Emails").val();

	// var message = $("#message").val();

	// var IsReport = $($("input[name=IsReport]:checked")).val()

	// var data = { "candidatedetailid": candidatedata, "Emails": emails, "IsReport": IsReport, "Message": message };

	// $.ajaxPost('/collegeadmin/generatepdf', data, function (data) {
	// if (data.Success != null && data.Success != "") {
	// $("#myModal").modal('toggle');
	// $('.alert').removeClass('hide').show().delay(5000).addClass("in").fadeOut(3500);
	// $(".alertMessageSuccess").html(data.Success);
	// }
	// if (data.Error != null && data.Error != "") {
	// $("#myModal .alert").css("display", "block");

	// $(".alertMessage").html(data.Error);
	// }
	// HoldOn.close();
	// });
	//});

	$("#btnShare").on("click", function () {
	var checkStatus = $("#example-select-all").is(":checked");
	console.log(checkStatus);
	var candidateDetailIdArray = [];
	if (checkStatus) {
	var dataDashboard = table.rows().data();
	console.log(dataDashboard.length)
	for (var i = 0; i < dataDashboard.length; i++) {
	candidateDetailIdArray.push(dataDashboard[i].CandidateDetailId);
	}
	}
	else {
	$.each($("input[name='Pick']:checked"), function () {
	var candidatedetailid = $(this).val();
	candidateDetailIdArray.push(candidatedetailid);
	});
	}

	var data = $('#formShare').serialize() + '&' + $.param({ 'candidateDetailIds': candidateDetailIdArray });

	$("#formShare").hide();
	$('#progressShare').show();
	$.ajaxPost("/collegeadmin/shareadmin", data, function (data) {

	if (data.Success != null && data.Success != "") {
	$("#formShare").show();
	$('#progressShare').hide();
	$("#myModal").modal('toggle');

	window.vm.adminName0('');
	window.vm.adminName1('');
	window.vm.IsTemp0(false);
	window.vm.IsTemp1(false);

	return true;
	}

	if (data.Error != null && data.Error != "") {
	$("#myModal .alert").css("display", "block");
	$("#formShare").show();
	$('#progressShare').hide();
	$(".alertMessageError").html("An error has occurred.Please try again later.");
	return false;
	}
	});

	});

	$('body').on('click', '.nonActiveButton', function () {

	var candidatedata = [];

	$.each($("input[name='Pick']:checked"), function () {
	var candidatedetailid = $(this).val();
	candidatedata.push(candidatedetailid);
	});

	var data = { "candidatedetailid": candidatedata };

	$("#progress").show();
	$('#example').hide();

	$.ajaxPost('/collegeadmin/MarkInactive', data, function (data) {
	if (data == "OK") {
	$.ajaxGet('/CollegeAdmin/GetCandidates?testCodeId=' + '&qualificationId=' + '&specializationId=' + '&year=' + '&status=', function (data) {

	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(true);
	}

	if (data != null && data != undefined && data != "") {
	table.clear();
	table.rows.add(data);
	table.draw();
	}

	myPieChart.data.datasets[0].data[0] = getUpdatedTotalCount();
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();

	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(false);
	}
	var column30 = table.column(30);
	column30.visible(false);
	var column31 = table.column(31);
	column31.visible(false);
	var column32 = table.column(32);
	column32.visible(false);
	table.column(33).visible(false);
	table.column(34).visible(false);
	$("#progress").hide();
	$('#example').show();

	updateTotalStudentsCount(data);
	activeStudentsCount(data);
	});
	}
	});
	});

	$('body').on('click', '.activeButton', function () {

	var candidatedata = [];
	$.each($("input[name='Pick']:checked"), function () {
	var candidatedetailid = $(this).val();
	candidatedata.push(candidatedetailid);
	});

	var data = { "candidatedetailid": candidatedata };

	$("#progress").show();
	$('#example').hide();
	$.ajaxPost('/collegeadmin/MarkActive', data, function (data) {
	if (data == "OK") {

	var testCode = $("#testCode").val();
	var degree = $("#degree").val();
	var stream = $("#stream").val();
	var year = $("#year").val();
	var minScore = $("#minScore").val();
	var maxScore = $("#maxScore").val();

	$.ajaxGet('/CollegeAdmin/GetCandidates?testCodeId=' + '&qualificationId=' + '&specializationId=' + '&year=' + '&status=', function (data) {

	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(true);
	}

	if (data != null && data != undefined && data != "") {
	table.clear();
	table.rows.add(data);
	table.draw();
	}

	myPieChart.data.datasets[0].data[0] = getUpdatedTotalCount();
	myPieChart.data.datasets[0].data[1] = getSelectedCount();
	myPieChart.update();

	for (i = 6; i <= 26; i++) {
	var column = table.column(i);
	column.visible(false);
	}
	var column30 = table.column(30);
	column30.visible(false);
	var column31 = table.column(31);
	column31.visible(false);
	var column32 = table.column(32);
	column32.visible(false);
	table.column(33).visible(false);
	table.column(34).visible(false);
	$("#progress").hide();
	$('#example').show();

	updateTotalStudentsCount(data);
	activeStudentsCount(data);
	});
	}
	});
	});

	$("#btnCustomise").click(function () {
	$.each($("input[name='column']"), function () {

	var v = $(this).is(":checked");
	if (v == true) {
	var column = table.column($(this).attr('data-column'));
	column.visible(true);
	}
	else {
	var column = table.column($(this).attr('data-column'));
	column.visible(false);
	}
	});

	var column0 = table.column(0);
	column0.visible(true);

	$("#editColumnsModal").modal("toggle");
	});

	$('input[name="column"]').on("change", function () {
	var checkMaximum = $(this).closest(".cr-container").find(':checkbox:checked');
	if (checkMaximum.length > 5) {
	this.checked = false;
	}
	});

	$("#reset").on("click", function () {
	var testCode = $("#testCode").val('');
	var degree = $("#degree").val('');
	var stream = $("#stream").val('');
	var year = $("#year").val('');
	var minScore = $("#minScore").val('');
	var maxScore = $("#maxScore").val('');
	var status = $("#status").val('');
	var numericalScore = $(".numericalAbility").val('');
	var verbalScore = $(".verbal").val('');
	var comprehensionScore = $(".comprehension").val('');
	var logicalScore = $(".logical").val('');
	var situationScore = $(".situtational").val('');
	var creativityScore = $(".creativity").val('');
	var decisionmakingScore = $(".decisionmaking").val('');
	var emotionalScore = $(".emotional").val('');
	var fightScore = $(".fight").val('');
	var handlingConflictScore = $(".handlingConflict").val('');
	var innovationScore = $(".innovation").val('');
	var moralityScore = $(".morality").val('');
	var negotiationScore = $(".negotiation").val('');
	var openessScore = $(".openess").val('');
	var opennesstoLearningScore = $(".opennesstoLearning").val('');
	var resourcefulnessScore = $(".resourcefulness").val('');
	var selfEsteemScore = $(".selfEsteem").val('');
	var teammgmtScore = $(".teammgmt").val('');
	var teamplayerScore = $(".teamplayer").val('');
	var visionapproachScore = $(".visionapproach").val('');
	var preferredIndustry = $(".preferredIndustry").val('');
	var preferredLocation = $(".preferredLocation").val('');

	testCode.attr('selected', true);
	degree.attr('selected', true);
	stream.attr('selected', true);
	year.attr('selected', true);
	status.attr('selected', true);
	numericalScore.attr('selected', true);
	verbalScore.attr('selected', true);
	comprehensionScore.attr('selected', true);
	logicalScore.attr('selected', true);
	situationScore.attr('selected', true);
	creativityScore.attr('selected', true);
	decisionmakingScore.attr('selected', true);
	emotionalScore.attr('selected', true);
	fightScore.attr('selected', true);
	handlingConflictScore.attr('selected', true);
	innovationScore.attr('selected', true);
	moralityScore.attr('selected', true);
	negotiationScore.attr('selected', true);
	openessScore.attr('selected', true);
	opennesstoLearningScore.attr('selected', true);
	resourcefulnessScore.attr('selected', true);
	selfEsteemScore.attr('selected', true);
	teammgmtScore.attr('selected', true);
	teamplayerScore.attr('selected', true);
	visionapproachScore.attr('selected', true);
	preferredIndustry.attr('selected', true);
	preferredLocation.attr('selected', true);

	table.search('').columns().search('').draw();
	});

	function getSelectedCount() {
	var count = $("input[name='Pick']:checked").length;
	return count;
	}

	function getUpdatedTotalCount() {
	totalCount = studentCount - getSelectedCount();
	return totalCount;
	}

	$(".preferredIndustry").on("change", function () {
	var industry = $(".preferredIndustry").val();
	table.columns(30).search(industry).draw();
	});

	$(".preferredLocation").on("change", function () {
	var location = $(".preferredLocation").val();
	table.column(31).search(location).draw();
	});

	$(".shortlistedStudents").on("change", function () {
	var location = $(".shortlistedStudents").val();
	table.column(34).search(location).draw();
	});

	$("#degree").on("change", function () {
	var degree = $("#degree").val();
	table.column(3).search(degree).draw();
	});

	$("#stream").on("change", function () {
	var stream = $("#stream").val();
	table.column(4).search(stream).draw();
	});

	$("#year").on("change", function () {
	var year = $("#year").val();
	table.column(5).search(year).draw();
	});

	$("#status").on("change", function () {
	var status = $("#status").val();
	table.column(29).search(status).draw();
	});

	$("#testCode").on("change", function () {
	var testCode = $("#testCode").val();
	table.column(32).search(testCode).draw();
	});

	$("#SendEmail").on("click", function () {
	var msgto = $("#MsgTo").val();
	var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
	if (!pattern.test(msgto)) {
	$(".ErrorMessage").removeClass('hidden');
	}
	else {
	$(".ErrorMessage").addClass('hidden');

	var FinalString = $('.summernote').summernote('code');
	var c = FinalString.replace(/"/g, "'");
	var msgbody = encodeURIComponent(c);
	var msgsubject = $("#MsgSubject").val();

	if (msgsubject == null || msgsubject == "") {
	$(".Errorsub").removeClass('hidden');
	}
	else {
	$(".Errorsub").addClass('hidden');

	var mailMessage = {
	"To": msgto,
	"Subject": msgsubject,
	"Message": msgbody
	}
	}
	}
	$.ajaxPost('/collegeadmin/sendmails', mailMessage, function (data) {
	if (data.Success == true) {
	$('#alertSuccess').show();
	$(".alertMessageSuccess").text("Mail sent successfully.");
	$("#MsgTo").val('');

	$('.summernote').summernote('reset');
	$("#MsgSubject").val('');
	setTimeout(function () {
	$('#alertSuccess').hide();
	$(".alertMessageSuccess").text("");
	$("#mailMessageModal").modal('toggle');
	}, 2000);
	}
	});



	//$(".MsgTo").on("keyup", function () {
	// var emailArray = [];
	// var emails = $(".MsgTo").val();
	// var splittedemails = emails.split(",");
	// console.log(splittedemails);
	// jQuery.each(splittedemails, function (index, item) {
	// var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
	// if (!pattern.test(item)) {
	// $(".ErrorMessage").removeClass('hidden');
	// }
	// else {
	// $(".ErrorMessage").addClass('hidden');
	// }
	// });
	//});
	});

	function updateTotalStudentsCount(dataArray) {
	//var v = $("#example").find("a.activeInactive");
	$("#totalCount").html(dataArray.length);
	}

	//function placedStudentsCount() {

	// var v = $("tbody").find(".activeInactive");
	// var placedCount = 0;

	// jQuery.each(v, function () {
	// if ($(this).attr("href") === "true") {
	// placedCount++
	// }
	// });
	//}

	function activeStudentsCount(dataArray) {
	var v = $("tbody").find(".activeInactive");

	var activeCount = 0, inactivecount = 0;

	for (var i = 0; i < dataArray.length; i++) {
	if (dataArray[i].IsCandidateInactive == false) {
	activeCount++
	}
	else {
	inactivecount++
	}
	}
	console.log(activeCount, "act");
	console.log(inactivecount, "inact")

	$("#activeCount").html(activeCount);
	$(".inactiveCount").html(inactivecount);
	}

	$("#example").on("click", "i.resume", function () {
	console.log($(this).closest("tr").find("input[name='Pick']").val());
	var candidateDetailId = $(this).closest("tr").find("input[name='Pick']").val();
	var element = $(this);
	$(this).hide();
	$(this).closest("tr").find(".resumeloader").show();
	//$(".resumeloader").show();
	$.ajaxGet("/collegeadmin/getresume?candidateDetailId=" + candidateDetailId, function (data) {
	if (data != null && data != undefined && data != " ") {
	element.closest("tr").find(".resumeLink").attr('href', data);
	element.closest("tr").find(".resumeLink").attr('target', '_blank');
	element.closest("tr").find(".resumeloader").hide();
	element.show();
	element.removeClass("resume");
	window.open(data);
	}
	});
	});
	</script>