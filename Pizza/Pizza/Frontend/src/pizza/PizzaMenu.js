// import { filter } from './C:/Users/taras/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/ejs';

/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
// var Pizza_List = require('./Pizza_List');
var PizzaType = require('./PizzaType');
var API = require('../API');
//HTML елемент куди будуть додаватися піци
var $pizza_list = $("#pizza-list");
var Pizza_List;

// argument is a list of "pizza" objects
function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
                PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
                PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        
        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

//filter is of type PizzaType 
//returns number of pizzas that passed the filter
function filterPizza(filter) {

    if(filter == PizzaType.Any){
        showPizzaList(Pizza_List);
        return Pizza_List.length;
    }

    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];


    Pizza_List.forEach( function(pizza) {
        if(filter in pizza.content){
            pizza_shown.push(pizza);
        }
    });

    Pizza_List.forEach( function(pizza) {
        if(!(PizzaType.Meat in pizza.content) && !(PizzaType.Ocean in pizza.content) && filter==PizzaType.Vega){
            pizza_shown.push(pizza);
        }
    });
 
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    return pizza_shown.length;
}

function initialiseMenu() {
    // get pizza list from server 
    API.getPizzaList((err, user_data) => {
        if(err){
            console.error('Could not get PizzaList from server');
        } else {
            Pizza_List = user_data;
            //Показуємо усі піци
            filterPizza(PizzaType.Any);
        }
    });

    //type filter events
    type_header = $('.all-pizza-type-wrap');
    type_list = type_header.find('li').toArray();

    // console.log($(type_list[0]).attr('data-pizza-type'));
    type_list.forEach( function(button) {
        $(button).click( function() {
            button_node = $(button);
            buttons_filter = button_node.attr('data-pizza-type');
            var pizzas_shown_number = filterPizza(buttons_filter);
            $('.pizza-count').text(pizzas_shown_number);

            //change title 
            $('.count-tile').text(button_node.text());

            //make button active
            $('.active').removeClass('active');
            button_node.addClass('active');
        });
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
