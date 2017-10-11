$(function(){
var template = $('.row-panel').get(0).outerHTML;
var container = $(".goods-main-panel:first");

//add new element to list event
function add_new_row() {
    console.log("cliked add button");
    var name_to_add = $("input").val();
    //change name
    var new_row = $(template);
    new_row.find(".name").text(name_to_add);
    new_row.find(".shaded-button.buy-panel-button.white-font.red").click(del_row);

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

 //delete button event
 var buttons = $(".shaded-button.buy-panel-button.white-font.red");
function del_row() {
    $(this).parent().parent().fadeOut(350);
}
buttons.click(del_row);

//mark as bought
function mark_as_bought(){
    console.log("mark");
    var parent_row = $(this).closest(".row-panel");
    parent_row.find("p").css("text-decoration", "line-through");
    parent_row.find(".round-button").hide();
    parent_row.find(".shaded-button.buy-panel-button.white-font.red").hide();
    $(this).text("Не куплено");
    $(this).unbind('click');
    $(this).click(unmark_as_bought);

}
function unmark_as_bought(){
    console.log("unmark");
    var parent_row = $(this).closest(".row-panel");
    parent_row.find("p").css("text-decoration", "initial");
    parent_row.find(".round-button").show();
    parent_row.find(".shaded-button.buy-panel-button.white-font.red").show();
    $(this).text("Куплено");
    $(this).unbind('click');
    $(this).click(mark_as_bought);
}
$(".shaded-button.buy-panel-button").click(mark_as_bought);

//quantity manipulations
function decrement_quantity(){
    console.log("decr");
    var quantity_label = $(this).closest(".row-panel").find(".quantity-label");
    var quantity = Number(quantity_label.text());
    quantity_label.fadeOut(250,	function(){
        quantity_label.text(quantity - 1);
        quantity_label.fadeIn(250);
        });
    
    if(quantity - 1 == 1)
        set_inactive($(this));
}
function increment_quantity(){
    console.log("incr");    
    var quantity_label = $(this).closest(".row-panel").find(".quantity-label");
    var quantity = Number(quantity_label.text());
    quantity_label.fadeOut(250,	function(){
        quantity_label.text(quantity + 1);
        quantity_label.fadeIn(250);
        });
    if(quantity + 1 == 2){
        set_active($(this).closest(".row-panel").find(".round-button.red"));
    }
}
function set_active(button){
    button.css("opacity","1");
    button.click(decrement_quantity);
}
function set_inactive(button){
    console.log("inactive");
    button.css("opacity","0.45");
    button.unbind('click');
}
$(".round-button.red").click(decrement_quantity);
$(".round-button.green").click(increment_quantity);

});