/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var Crypto = require('crypto');
var LIQPAY_PUBLIC_KEY = "i90074349759";   // "i78643630544";
var LIQPAY_PRIVATE_KEY = "fDnUdtKh7viRtY9QsdM34YaKPmzODKLAqtebyWKT";   // "ayINCfS0jx1vSvKnlgn5DYKrHjgUvnEfVSM3iOlB";

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function (req, res) {
    var order_info = req.body;
    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.sum,
        currency: "UAH",
        description: order_info.pizzas + "\n" + order_info.name + "\n" + order_info.number + "\n" + order_info.address,
        order_id: Math.random(),
        //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox: 1
    };

    var data = toBase64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

    res.send({
        // success : true,
        data : data,
        signature : signature
    });
};

function sha1(string) {
    var sha1 = Crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

function toBase64(str) {
    return new Buffer(str).toString('base64');
}
