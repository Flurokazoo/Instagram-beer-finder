/**
 * Global variables
 */

var map;
var markers = [];
var infoWindows = [];

$(init);


/**
 * Init loads the map with mapLoad, then sets the size of the map, so that the map always fills the screen no matter what the size of your screen is.
 * It then goes to tagSubmitHandler when the submit button is clicked.
 */
function init() {
    mapLoad();
    mapHeight();
    //Also sets mapHeight for when all elements are loaded (without this it can result in the map not filling the screen properly due to images not having loaded yet)
    //It also resizes when you resize the window.
    $(window).on('load', mapHeight);
    $(window).on('resize', mapHeight);
    //Click handler on submit button
    $('#tagform').on('submit', tagSubmitHandler);
}

/**
 * mapLoad loads the map, sets options for the map
 */

function mapLoad() {

    //Creates a new var for custom mapstyle. It gets the style from mapsettings.js

    var styledMap = new google.maps.StyledMapType(styles,
        {name: "Custom map by Jasper"});

    //Sets map options

    var mapOptions = {
        center: { lat: 0, lng: 0},
        zoom: 2,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    };
    //Creates the map

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}

/**
 * mapHeight sets the height of the map so it fills the screen.
 */

function mapHeight() {

    //Sets height for map: Total size of window minus the form in the top and 2 pixels due to borders set in css

    var mapHeight = $(window).height() - $('#tagform').height() - 2;
    $('#map-canvas').height(mapHeight);
}

/**
 * tagSubmitHandler is the handler after data is submitted. It clears the map from all previous markers, then makes
 * an AJAX call to json.php and takes the data to the function tagDataCallback
 * @param e
 */
function tagSubmitHandler(e) {

    //Prevents page from loading after submit is hit.
    e.preventDefault();

    //Stores searchtag in variable
    var searchTag = $('input[name=tagInput]:checked').val();
    //If value is custom (from the text input field), it sets the value to the value entered.
    if (searchTag == "custom") {
        searchTag = $('#custom').val();
    }
    //AJAX call to json.php, then takes data to function tagDataCallback
    $.ajax({
        dataType: "json",
        url: 'json.php',
        data: {tag: searchTag},
        success: tagDataCallback
    });
}

/**
 * Loops through all the data the AJAX call got, and places markers and content accordingly.
 * @param data
 */

function tagDataCallback(data) {

    //Deletes all the markers from the map when new AJAX receives the callback
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    //Code to execute for every entry in data
    $.each(data, function (i, entryData) {
        //Gets latitude and longitude from data from AJAX call, then creates a marker at the coordinates (each time the loop happens)
        var coordinates = new google.maps.LatLng(entryData.latitude, entryData.longitude);
        var marker = new google.maps.Marker({
            position: coordinates,
            center: coordinates,
            map: map,
            icon: "img/beermarker-resize.png",
            animation: google.maps.Animation.DROP
        });

        //Creates a variable for an infowindow, fills its contents with image (and link to Instagram) and username
        var infoWindow = new google.maps.InfoWindow({
            content: '<div class="contentbox"><a target="_blank" href="' + entryData.url + '"><img src="' + entryData.image + '" alt="' + entryData.image + '"></a>User: ' + entryData.user + '</div>'
        });
        google.maps.event.addListener(marker, 'click', function () {
            //Closes open infowindows when a new one is clicked
            for (i = 0; i < infoWindows.length; i++) {
                infoWindows[i].close(map, this);
            }
            //Opens new infowindow
            infoWindow.open(map, this);
        });
        //Pushes both marker and infoWindow data to an array, so they can be accessed later (for deleting them)
        markers.push(marker);
        infoWindows.push(infoWindow);
    });
}




