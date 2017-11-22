// all JS for order page

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

// returns true if error was shown
function showErrorIfInvalid(input_el, validation_func){
    var parent_form = input_el.closest('.form-group');
    var passed_validation = validation_func(parent_form.find('input').val());

    if(passed_validation == false){
        parent_form.find('.help-block.with-errors.error-text').css('display', 'block');
        input_el.removeClass('input-valid');            
        input_el.addClass('input-invalid');
    }
    return !passed_validation;
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
        showErrorIfInvalid($('#inputName'), isNameValid);
        showErrorIfInvalid($('#inputNumber'), isNumberValid);
        
    });
}

exports.initOrderPage = initOrderPage;