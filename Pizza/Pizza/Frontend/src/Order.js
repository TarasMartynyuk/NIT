// all JS for order page
var API = require('./API');
//#region validation funcs
function isNameValid(inputed_name)
{
    return new RegExp("^([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$").
        test(inputed_name);
    // ([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$
}

function isNumberValid(inputed_number)
{
    return new RegExp("^\\+380[0-9]{9}$").
        test(inputed_number);
}

function testValidity(input_el, validation_func){
    if(validation_func(input_el.val())) {
        input_el.removeClass('input-invalid');            
        input_el.addClass('input-valid');
        // hide error tip
        input_el.closest('.form-group').find('.help-block.with-errors.error-text').css('display', 'none');
    } else {
        input_el.removeClass('input-valid');            
        input_el.addClass('input-invalid');
    }
}

// returns number of errors occured while validating an element
// and shows needed error tips
function showErrorIfInvalid(input_el, validation_func){
    var parent_form = input_el.closest('.form-group');
    var passed_validation = validation_func(parent_form.find('input').val());

    if(passed_validation == false){
        parent_form.find('.help-block.with-errors.error-text').css('display', 'block');
        input_el.removeClass('input-valid');            
        input_el.addClass('input-invalid');
    }
    return passed_validation ? 0 : 1;
}

//#endregion

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
    

    // TODO: adress validation


    $('#submitButton').click(() => {
        var num_errors = 0;
        num_errors += showErrorIfInvalid($('#inputName'), isNameValid);
        num_errors += showErrorIfInvalid($('#inputNumber'), isNumberValid);
        // TODO: check adress field here

        if(num_errors == 0) {
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
    });
}

exports.initOrderPage = initOrderPage;