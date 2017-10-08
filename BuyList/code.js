var template = $('.row-panel').get(0).outerHTML;
var container = $(".goods-main-panel:first");

//add new element to list
function add_new_row() {
    console.log("cliked add button");
    var name_to_add = $("input").val();
    //change name
    var new_row = $(template);
    new_row.find(".name").text(name_to_add);

    container.append(new_row);
    $('input').val("");
};

$("button.add-button").click(add_new_row);

$('input').keyup(function(e){
    if(e.keyCode == 13)
        $(this).trigger("enterKey");
});

$('input').bind("enterKey",function(e){
    console.log("pressed ENTER");
    add_new_row();
 });