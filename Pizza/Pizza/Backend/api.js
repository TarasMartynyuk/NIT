/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    console.log("Creating Order", order_info);
    var order_info = req.body;

    res.send({
        // success: true,
        order : order_info,
    });
};