// Declaring global variables now to satisfy strict mode
var map;
var locationInfomation;

// Foursquare API settings
var CLIENT_ID = "TP2NQO5LEORRMRP52IGDGN2MGOJKTBV4A3VNVOGAV5JMG23M";
var CLIENT_SECRET = "1AEYC4PEHVPBR12QRVTXHVOSSHASE4YLM1FMNELLFSG10CVJ";


// Model
var initialLocations = [{
        name: 'Chik-Fil-A',
        lat: 33.1779847,
        long: -117.29627310000001
    }, {
        name: 'Buffalo Wild Wings',
        lat: 33.18185649999999,
        long: -117.32919190000001
    }, {
        name: 'Fresh MXN Food',
        lat: 33.138909,
        long: -117.19882010000003
    }, {
        name: 'KFC',
        lat: 33.2104598,
        long: -117.23445939999999
    }, {
        name: 'Teri Cafe I',
        lat: 33.1858874,
        long: -117.32724159999998
    }, {
        name: 'Teri Cafe II',
        lat: 33.1823806,
        long: -117.29232430000002
    }

];

// View
var Location = function(data) {
    // Declaration of variables t collect infomation for the FourSqurare API
    var self = this;

    self.location = ko.observableArray();
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.URL = '';
    this.street = '';
    this.city = '';
    this.phone = '';
    this.twitter = '';
    this.categories = '';
    this.menu = '';
    this.contentString = '';

    this.visible = ko.observable(true);


    // Check to see if client web browser is a mobile device.
    // Credit:
    // http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    self.isMobile = function() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // Generate FourSqurare JSON to data mine
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
        this.lat + ',' + this.long + '&client_id=' + CLIENT_ID +
        '&client_secret=' + CLIENT_SECRET + '&v=20160118' +
        '&query=' + this.name;

    $.getJSON(foursquareURL).done(function(data) {
        var results = data.response.venues[0];

        self.URL = results.url;
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];
        self.phone = results.contact.formattedPhone;
        self.twitter = results.contact.twitter;
        self.categories = results.categories[0].name;

        if (!self.mobile) {
            self.menu = results.menu.url;
        } else {
            self.menu = results.menu.mobileUrl;
        }

        // Logic to not display 'undefined'. Checks to see if string in
        // undefined, if so then leave blank.
        self.phone = self.phone ? self.phone : "";
        self.url = self.url ? self.url : "";
        self.twitter = self.twitter ? self.twitter : "";

        if (self.menu === 'undefined') {
            self.url = '';
            self.mobileUrl = '';
        }
    }).fail(function() {
        alert("There was an error with the Foursquare API call. Please " +
            "refresh the page and try again to load Foursquare data.");
    });



    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.marker.addListener('click', function() {

        // Add information to the #info-panel for more in-depth infomation
        // about the chosen location.
        self.infoContent = '<div class="infor-panel-content">' +
            '<div><strong>' + data.name + '</strong></div>' +
            '<div class="info-content"><a href="' +
            self.URL + '">' + self.URL + '</a></div>' +
            '<div class="info-content">' + self.street + '</div>' +
            '<div class="info-content">' + self.city + '</div>' +
            '<div class="info-content"><strong>Menu:</strong> <a href="' +
            self.menu + '" target="_blank">' + self.menu + '</a></div>';

        // Add Twitter account if location has one
        if (self.twitter !== '') {
            self.infoContent += '<div class="info-content"><strong>Twitter' +
                '</strong> @<a href="https://twitter.com/search?q=' +
                self.twitter + '&src=typd" target="_blank">' + self.twitter +
                '</a></div>';
        }

        self.infoContent += '<div class="info-content"><strong>Phone:' +
            '</strong> <a href="tel:' + self.phone + '">' + self.phone +
            '</a></div><div class="info-content"><strong>Categories: ' +
            '</strong>' + self.categories + '</div></div>';

        // Add an informtion to the #info-panel to be displayed there.

        self.infoWindow.setContent(self.infoContent);

        self.infoWindow.open(map, this);

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
    });

    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
            lat: 33.18247,
            lng: -117.299738
        },
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        scrollwheel: false
    });

    var foursquareLogo = document.createElement("IMG");
    foursquareLogo.setAttribute("src", "images/logo_foursquare.png");
    foursquareLogo.setAttribute("alt", "Data provided by Foursqure.com");

    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(foursquareLogo);

}
// ViewModel
function ViewModel() {

    var self = this;

    this.searchTerm = ko.observable('');

    this.locationList = ko.observableArray([]);

    initMap();

    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    this.filteredList = ko.computed(function() {
        var filter = self.searchTerm().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(),
                function(locationItem) {
                    var string = locationItem.name.toLowerCase();
                    var result = (string.search(filter) >= 0);
                    locationItem.visible(result);
                    return result;
                });
        }
    }, self);

    this.mapElem = document.getElementById('map');
    this.mapElem.style.height = window.innerHeight - 250;
}

function startApp() {
    ko.applyBindings(new ViewModel());
}

function errorHandling() {
    alert("Google Maps has failed to load. Please check your internet " +
        "connection and try again.");
}
