$(function(){
var template = $('.row-panel').get(0).outerHTML;
var container = $(".goods-main-panel:first");
//dictionary {"item name" : item stat label}
name_label_dict = {};

//add new element to list event
function add_new_row() {
    var name_to_add = $("input").val();
    $("input").val("");
    if(name_to_add in name_label_dict){
        console.warn("user tried to add a copy of existing item to the list");
        return;
    }
    //change name
    var new_row = $(template);
    new_row.find(".name").find('p').text(name_to_add);
    new_row.find(".shaded-button.buy-panel-button.white-font.red").click(del_row);
    container.append(new_row);

    //add events to buttons
    new_row.find('.shaded-button.buy-panel-button').click(mark_as_bought);
    new_row.find(".round-button.red").click(decrement_quantity);
    new_row.find(".round-button.green").click(increment_quantity);
    //add stat label
    stat_label = $(stat_label_template);
    stat_label.find('.title').text(name_to_add);
    not_bought_label_cont.append(stat_label)
    //add stat label to dict
    name_label_dict[name_to_add] = stat_label;
};
$("button.add-button").click(add_new_row);
$('input').keyup(function(e){
    if(e.keyCode == 13)
        $(this).trigger("enterKey");
});
$('input').bind("enterKey",function(e){
    add_new_row();
 });

//delete button event
function del_row() {
    var row_to_del = $(this).parent().parent();
    var name_to_del = row_to_del.find('.name').find('p').text();
    name_label_dict[name_to_del].remove();
    delete name_label_dict[name_to_del];
    console.log(name_to_del);
    row_to_del.fadeOut(350);
}
$(".shaded-button.buy-panel-button.white-font.red").click(del_row);

//mark as bought
function mark_as_bought(){
    var parent_row = $(this).closest(".row-panel");
    parent_row.find("p").css("text-decoration", "line-through");
    parent_row.find(".round-button").hide();
    parent_row.find(".shaded-button.buy-panel-button.white-font.red").hide();
    $(this).text("Не куплено");
    //stat label stuff
    item_stat_label = name_label_dict[parent_row.find("p").text()];
    item_stat_label.find('.title').css("text-decoration", "line-through");
    bought_label_cont.append(item_stat_label);
    $(this).unbind('click');
    $(this).click(unmark_as_bought);

}
function unmark_as_bought(){
    var parent_row = $(this).closest(".row-panel");
    parent_row.find("p").css("text-decoration", "initial");
    parent_row.find(".round-button").show();
    parent_row.find(".shaded-button.buy-panel-button.white-font.red").show();
    $(this).text("Куплено");
    //stat label stuff
    item_stat_label = name_label_dict[parent_row.find("p").text()];
    item_stat_label.find('.title').css("text-decoration", "initial");
    not_bought_label_cont.append(item_stat_label);
    $(this).unbind('click');
    $(this).click(mark_as_bought);
}
$(".buy-button").click(mark_as_bought);

//quantity manipulations
function decrement_quantity(){
    var row = $(this).closest(".row-panel");
    var quantity_label = row.find(".quantity-label");
    var new_quantity = Number(quantity_label.text()) - 1;
    quantity_label.fadeOut(250,	function(){
        quantity_label.text(new_quantity);
        quantity_label.fadeIn(250);
        });
    
    if(new_quantity == 1)
        set_inactive($(this));
        //update stat label
    update_stat_label_count(row, new_quantity);
        
}
function increment_quantity(){
    var row = $(this).closest(".row-panel");
    var quantity_label = row.find(".quantity-label");
    var new_quantity = Number(quantity_label.text()) + 1;
    quantity_label.fadeOut(250,	function(){
        quantity_label.text(new_quantity);
        quantity_label.fadeIn(250);
        });
    if(new_quantity == 2){
        set_active(row.find(".round-button.red"));
    }
    //update stat label
    update_stat_label_count(row, new_quantity);
}
function update_stat_label_count(row, new_quantity){
    var name = row.find('.name').find('p').text();
    name_label_dict[name].find('.count-label').text(new_quantity );
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
//the first is already at quantity = 1
set_inactive($(".round-button.red:first"));
$(".round-button.green").click(increment_quantity);

//show statistics 
var not_bought_label_cont = $($('.row-panel.stat')[0]);
 bought_label_cont = $($('.row-panel.stat')[1]);
var stat_label_template = $('.goods-avatar-label').get(0).outerHTML;
not_bought_label_cont.children().map(function(i, e) {
    name_label_dict[$(e).find('.title').text()] = $(e);
		console.log($(e))
});
//rename handling
var old_name;
function on_rename_start(){
    old_name =  $(this).text();
}
function on_rename_end(){
    stat_label = name_label_dict[old_name];
    stat_label.find('.title').text($(this).text());
    name_label_dict[$(this).text()] = stat_label;
    delete name_label_dict[old_name];
}
$("p[contenteditable='true']").click(on_rename_start);
$("p[contenteditable='true']").blur(on_rename_end);

});