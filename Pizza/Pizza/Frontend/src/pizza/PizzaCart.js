/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var localStorage = require('../localStorage.js');

//cart_item variables are of "type" pizza + quantity and size fields!
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var Cart = [];  //Змінна в якій зберігаються перелік піц в кошику
var order_sum = 0;
var order_quantity = 0;
var $cart = $("#cart"); //HTML едемент куди будуть додаватися піци

//#region  adding and removing items
function addToCart(pizza, size) {

    //if pizza already in the cart, increment quality
    if(labelPresent(pizza, size)){
        incrementQuantity(pizza, size);
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price: pizza[size].price,
        });
    } 
    order_quantity++;

    //recalculate the order sum
    incrementTotalCost(pizza[size].price);
    
    //Оновити вміст кошика на сторінці
    redrawCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item), 1);

    //recalculate order sum
    incrementTotalCost(- cart_item.pizza[cart_item.size].price * cart_item.quantity );

    //Після видалення оновити відображення
    redrawCart();
}

// adds the cost_change to quantity label value
function incrementTotalCost(cost_change){
    var curr_sum = order_sum;
    var new_sum =  curr_sum + cost_change;

    order_sum_node = $('#order-sum-bottom');

    if(new_sum < 0){
        console.log('total order cost is < 0!')
        order_sum_node.text(0);
        order_sum = 0;
    } else {
        order_sum_node.text(new_sum);
    }

    order_sum = new_sum;
}

function labelPresent(pizza, size) {
    var res = false;
    Cart.forEach( function(element) {
        if(element.pizza.title == pizza.title && element.size == size){
            res =  true;
        }
    });
    return res; 
}

function incrementQuantity(pizza, size){
    Cart.forEach(function(element) {
        if(element.pizza.title && element.size == size){
            element.quantity += 1;
            element.price += element.pizza[element.size].price;
        }
    });
    redrawCart();
}

function sizeToString(size){
    switch(size){
        case PizzaSize.Big:
            return "Велика";

        case PizzaSize.Small:
            return "Мала";

        default:
            console.error("Can't stringify size - passed argument is not of type PizzaSize");
    }
}
//#endregion 

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_cart = localStorage.get('cart');
    var saved_sum = localStorage.get('sum');
    var saved_quantity = localStorage.get('quantity');

    if(saved_cart){
        Cart = saved_cart;
        order_sum = saved_sum;
        order_quantity = saved_quantity;
    }

    window.onbeforeunload = function() {
        localStorage.set('cart', Cart);
        localStorage.set('sum', order_sum);
        localStorage.set('quantity', order_quantity);
    };

    $('span.clear-order').click(function() {
        Cart = [];
        order_sum = 0;
        order_quantity = 0;
        redrawCart();
    });

    redrawCart();
}

function getCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

//#region cart update methods

//redraws every element of cart to the card panel
function redrawCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміст кошика в Local Storage
    //Очищаємо старі піци в кошику
    $cart.html("");

    $('#order-quantity').text(order_quantity);
    $('#order-sum-bottom').text(order_sum+" грн.");
    //Оновлення однієї піци
    function drawPizzaInCart(cart_item) {
        var ejs_compatible_cart_item = {
            pizza : cart_item.pizza,
            size : cart_item.size,
            size_string : sizeToString(cart_item.size),
            quantity : cart_item.quantity
        };

        var html_code = Templates.PizzaCart_OneItem(ejs_compatible_cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            addToCart(cart_item.pizza, cart_item.size);
            //Оновлюємо відображення
            redrawCart();
        });
        $node.find(".minus").click(function(){
            var currQuantity = cart_item.quantity;
            order_quantity--; 
            if(currQuantity > 1){
                cart_item.quantity -= 1;

                //recalculate total cost
                incrementTotalCost(- cart_item.pizza[cart_item.size].price);
    
                //Оновлюємо відображення
                redrawCart();
            } else {
                removeFromCart(cart_item);
            }

            
        });
        $node.find(".cart-delete").click(function(){
            order_quantity -= cart_item.quantity;
            removeFromCart(cart_item);
            redrawCart();
        });
        
        $cart.append($node);
    }
    
    Cart.forEach(drawPizzaInCart);

    // check wether to show "order" button
    $('#order-button').attr('disabled', order_sum <= 0);
}

//#endregion

//#region Exports
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
//#endregion