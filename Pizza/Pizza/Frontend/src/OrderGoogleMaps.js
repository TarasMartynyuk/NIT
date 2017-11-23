
var markerClicked;
var curAdress;
var curTime;

function initialiseMap() {
    console.log('map');
    //Тут починаємо працювати з картою
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15
    };
    var html_element = document.getElementById("googleMap");
    var map = new google.maps.Map(html_element, mapProp);
    //Карта створена і показана

    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions( { suppressMarkers: true, suppressInfoWindows: true } );

    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });

    google.maps.event.addDomListener(window, 'load', initialiseMap);

    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
    });

    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, adress) {
            if (!err) {
                //Дізналися адресу
                //console.log(adress);
                curAdress=adress;
                $('.order-summary-address').html("<b>Адреса доставки:</b> "+curAdress);
                $('#inputAddress').val(curAdress);
                var pointClicked = coordinates;
                if (markerClicked!=null) markerClicked.setMap(null);
                markerClicked = new google.maps.Marker({
                    position: pointClicked,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });
            } else {
                console.log("Немає адреси")
            }
        })
        calculateRoute(point,coordinates, function (err, response) {
            if (!err) {
                // var res=leg;
                // console.log(leg.duration.text);
                directionsDisplay.setDirections(response);
                //console.log(response.routes[0].legs[0].duration.text);
                curTime=response.routes[0].legs[0].duration.text;
                $('.order-summary-time').html("<b>Приблизний час доставки:</b> "+curTime);
            } else {
                console.log("Помилка")
            }
        })


    });
}

function geocodeLatLng(latlng, callback) {
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't	find	adress"));
        }
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can	not	find	the	adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // var leg = response.routes[0].legs[0];
            // {duration: leg.duration}
            callback(null, response);
        } else {
            callback(new Error("Can'	not	find	direction"));
        }
    });
}

exports.initialiseMap = initialiseMap;
exports.geocodeAddress = geocodeAddress;