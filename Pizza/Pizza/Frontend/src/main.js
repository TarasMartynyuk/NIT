/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    // var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();


    // form = $('form-horizontal').find('.form-control');
    form = $('.form-horizontal ').find('.form-control');
    form.focusout(function(){
        $(this).addClass('touched');
    });

});


