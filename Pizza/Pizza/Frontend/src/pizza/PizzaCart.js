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
            quantity: 1
        });
    } 

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
    quantity_node = $('.orders-count-span');
    var curr_sum = Number(quantity_node.text());
    var new_sum =  curr_sum + cost_change;

    if(new_sum < 0){
        console.error('total order cost is < 0!')
        quantity_node.text(0);
    } else {
        quantity_node.text(new_sum);
    }
}

function labelPresent(pizza, size) {
    var res = false;
    Cart.forEach( element =>  {
        if(element.pizza.title == pizza.title && element.size == size){
            res =  true;
        }
    });
    return res; 
}

function incrementQuantity(pizza, size){
    Cart.forEach(element => {
        if(element.pizza.title && element.size == size){
            element.quantity += 1;
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

    if(saved_cart){
        Cart = saved_cart;
    }

    window.onbeforeunload = () => {
        localStorage.set('cart', Cart);
    };

    $('span.clear-order').click(() => {
        Cart = [];
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
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //recalculate total cost
            incrementTotalCost(cart_item.pizza[cart_item.size].price);
            
            //Оновлюємо відображення
            redrawCart();
        });
        $node.find(".minus").click(function(){
            var currQuantity = cart_item.quantity;
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
            removeFromCart(cart_item);
            redrawCart();
        });
        
        $cart.append($node);
    }
    
    Cart.forEach(drawPizzaInCart);
}

//#endregion

//#region Imports
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
//#endregion