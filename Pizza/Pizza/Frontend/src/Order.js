// all JS for order page

//#region validation funcs
// function isNameValid(inputed_name)
// {
//     return new RegExp("^([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$").
//         test(inputed_name);
//     // ([А-ЯA-Za-zа-яіІЩщїЇєЄ]+)( [А-ЯA-Za-zа-яіІЩщїЇєЄ]+){0,1}$
// }

// function isNumberValid(inputed_number)
// {
//     return new RegExp("^\\+380[0-9]{9}$").
//         test(inputed_number);
// }

// function testValidity(input_el, validity_func){
//     if(validity_func(input_el.val())) {
//         input_el.removeClass('input-invalid');            
//         input_el.addClass('input-valid');
//     } else {
//         input_el.removeClass('input-valid');            
//         input_el.addClass('input-invalid');
//     }
// }

//#endregion

// adds order-page specific controls
function initOrderPage(){
    console.log('initOrder');
    // every time user leave's the input field, check if passed validation
    // and style it accordingly
    // $('#inputName').on('input', () => {
    //     testValidity($(event.target), isNameValid);
    // });

    // $('#inputNumber').on('input', () => {
    //     testValidity($(event.target), isNumberValid);
    // });
    


    // ^\\+380[0-9]{9}$


    // TODO: adress validation

    $('input[required]').on('invalid', function() {
        this.setCustomValidity("");
        if (!this.validity.valid) {
            this.setCustomValidity($(this).data("required-message"));
        }
    });
    // $('input[required]').on('invalid', function() {
    //     this.setCustomValidity("text");
    //     // $(this).data("required-message")
    // });
    // when submit button is clicked, check if all 3 inputs
    // are valid, if so - proceed, else show errors for those that are not
    $("button[type='submit']").click(() => {
        console.log('clc');
    });
}

exports.initOrderPage = initOrderPage;