// all JS for order page
var API = require('./API');
var MapApi = require('./OrderGoogleMaps')

//#region validation funcs
function isNameValid(inputed_name){
    return new RegExp("^([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$").
        test(inputed_name);
    // ([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$
}

function isNumberValid(inputed_number){
    return new RegExp("^(\\+38){0,1}0[0-9]{9}$").
        test(inputed_number);
}

function validateAdress(adress_node, inputed_adress){
    
    MapApi.geocodeAddress(adress_node.val(), (err, coordinates) => {
        if(err){
            adress_node.removeClass('input-valid');            
            adress_node.addClass('input-invalid');
        } else {
            adress_node.removeClass('input-invalid');            
            adress_node.addClass('input-valid');
            errorTipSetActive(adress_node, false);
        }
    });
}

function testValidity(input_el, validation_func){
    if(validation_func(input_el.val())) {
        input_el.removeClass('input-invalid');            
        input_el.addClass('input-valid');
        // hide error tip
        errorTipSetActive(input_el, false);
    } else {
        input_el.removeClass('input-valid');            
        input_el.addClass('input-invalid');
    }
}

// returns number of errors occured while validating an element
// and shows needed error tips
function showErrorIfInvalid(input_el, validation_func){
    var passed_validation = validation_func(input_el.closest('.form-group').find('input').val());

    if(passed_validation == false){
        errorTipSetActive(input_el, true);
    }
    return passed_validation ? 0 : 1;
}

//#endregion

function sendFormToServer(){
    var order_data = {
        name : $('#inputName').val(),
        number : $('#inputNumber').val(),
        adress : $('#inputAdress').val()
    }
    // console.log(order_data);
    API.createOrder(order_data, (err, data) =>{
        if(err){
            console.error('server returned error');
        } else {
            console.log('server returned success');
            // console.log(data);
        }
    });
}

function errorTipSetActive(input_el, is_shown){
    if(is_shown){   // also paint it red
        input_el.removeClass('input-valid');            
        input_el.addClass('input-invalid');
    }
    input_el.closest('.form-group').find('.help-block.with-errors.error-text').
        css('display', is_shown ? 'block' : 'none');
}

// adds order-page specific controls
function initOrderPage(){
    // every time user leave's the input field, check if passed validation
    // and style it accordingly
    $('#inputName').on('input', () => {
        testValidity($(event.target), isNameValid);
    });

    $('#inputNumber').on('input', () => {
        testValidity($(event.target), isNumberValid);
    });
    
    $('#inputAdress').on('input', () => {
        validateAdress($(event.target));
    });

    $('#submitButton').click(() => {
        var num_errors = 0;
        num_errors += showErrorIfInvalid($('#inputName'), isNameValid);
        num_errors += showErrorIfInvalid($('#inputNumber'), isNumberValid);
        
        MapApi.geocodeAddress($('#inputAdress').val(), (err, coordinates) => {
            if(err){
                errorTipSetActive($('#inputAdress'), true);
            } else if(num_errors == 0){
                sendFormToServer();
            }
        });
        
    });
}

exports.initOrderPage = initOrderPage;