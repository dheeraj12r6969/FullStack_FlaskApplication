$(document).ready(function(){
    $("#userDetails").DataTable({
    "responsive":true,
    columnDefs:[
                {'targets':6,'searchable':false,'orderable':false,'visible':false},
                {'targets':5,'searchable':false,'orderable':false,'visible':false},
                {'targets':4,'searchable':false,'orderable':false,'visible':false},
                {'targets':0,'searchable':false,'orderable':false,'visible':false},
                {'targets':7,'searchable':false,'orderable':false,'visible':false},
                {'targets':8,'searchable':false,'orderable':false}
                 ],
    dom: 'lBfrtip',
    buttons: [
                  'excelHtml5',
                  'pdfHtml5'
             ],
    "order": [[ 2, "asc" ]],
    });
    var t= $("#tbl").DataTable({
        "sScrollX": "100%",
        "bScrollCollapse": true,
        columnDefs:[
                    {'targets':5,
                     'searchable':false,'orderable':false,'visible':false},
                    {'targets':6,
                     'searchable':false,'orderable':false,'visible':false},
                    {'targets':8,
                     'searchable':false,'orderable':false}
                 ],

        dom: 'lBfrtip',
        buttons: [
                      {
                           extend: 'excel',
                           title:"",
                           exportOptions: {
                                    columns: [':visible']
                                    //columns: ':not(.not-export-col)'
                                    },
                            footer: false
                        },
                ],
        "order": [[ 2, "asc" ]],
    });

    var t= $("#tblod").DataTable({
        "sScrollX": "100%",
        "bScrollCollapse": true,
        columnDefs:[
                    {'targets':5,
                     'searchable':false,'orderable':false,'visible':true, 'width':"Auto"},
                    {'targets':6,
                     'searchable':false,'orderable':false,'visible':true, 'width':"Auto"},
                    {'targets':7,
                     'searchable':false,'orderable':false,'visible':true, 'width':"Auto"},
                    {'targets':8,
                     'searchable':false,'orderable':false, 'width':"Auto"}
                 ],

        dom: 'lBfrtip',
        buttons: [
                      {
                           extend: 'excel',
                           title:"",
                           exportOptions: {
                                    columns: [':visible']
                                    //columns: ':not(.not-export-col)'
                                    },
                            footer: false
                        },
                ],
        "order": [[ 2, "asc" ]],
    });
    <!--t.on( 'order.dt search.dt', function () {-->
        <!--t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {-->
            <!--cell.innerHTML = i+1;-->
        <!--} );-->
    <!--} ).draw();-->
  });
