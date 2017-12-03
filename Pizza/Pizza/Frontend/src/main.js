/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    // This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Order = require('./Order');
    var Maps = require('./OrderGoogleMaps');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    Order.initOrderPage();
    Maps.initialiseMap();
    

    // form = $('form-horizontal').find('.form-control');
    // form = $('.form-horizontal ').find('.form-control');
    // form.focusout(function(){
    //     $(this).addClass('touched');
    // });

});


