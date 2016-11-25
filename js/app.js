// Declaring global variables now to satisfy strict mode
var map;
var locationInfomation;

// Foursquare API settings
var CLIENT_ID = "TP2NQO5LEORRMRP52IGDGN2MGOJKTBV4A3VNVOGAV5JMG23M";
var CLIENT_SECRET = "1AEYC4PEHVPBR12QRVTXHVOSSHASE4YLM1FMNELLFSG10CVJ";


// Model
function Location(name, lat, long, categories, foursquareUrl) {
    this.name = name;
    this.lat = lat;
    this.long = long;
    this.categories = categories;
    this.foursquareUrl = foursquareUrl;
}
var initialLocations = [
    new Location('Chik-Fil-A', 33.1779847, -117.29627310000001, "Fast Food Restaurant", "chickfila-quarry-creek/4b0d93b1f964a520674b23e3"),
    new Location('Buffalo Wild Wings', 33.18185649999999, -117.32919190000001, "Wings Joint", "buffalo-wild-wings/53a492c0498ea5554f6182c4"),
    new Location('Fresh MXN Food', 33.1331199, -117.1974391, "Mexican Restaurant", "fresh-mxn-food-san-marcos/4abed1eff964a520159020e3"),
    new Location('KFC', 33.2104598, -117.23445939999999, "Fried Chicken Joint", "kfc/4bb81ad93db7b713480c219a"),
    new Location('Ocean\'s Eleven Casino', 33.200048, -117.36925450000001, "Casino", "oceans-eleven-casino/4b5b5e04f964a52037f828e3"),
    new Location('Teri Cafe I', 33.18524330989122, -117.3272989435073, "Japanese Restaurant", "teri-cafe/4a8b5a56f964a5203a0c20e3"),
    new Location('Teri Cafe II', 33.1823806, -117.29232430000002, "Japanese Restaurant", "teri-cafe/4b0749b1f964a52059fb22e3")


];

// View
var Location = function(data) {
    // Declaration of variables t collect infomation for the FourSqurare API
    var self = this;




    self.location = ko.observableArray();
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.menu = '';
    this.categories = '';

    this.infoWindow = new google.maps.InfoWindow();
    this.bounds = new google.maps.LatLngBounds();

    this.visible = ko.observable(true);
    // Generate FourSqurare JSON to data mine
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
        this.lat + ',' + this.long + '&client_id=' + CLIENT_ID +
        '&client_secret=' + CLIENT_SECRET + '&v=20161114' +
        '&query=' + this.name;


    $.getJSON(foursquareURL).done(function(data) {
        var results = data.response.venues[0];
        self.twitter = results.contact.twitter;
        self.categories = results.categories[0].name;

        try {
            self.menu = results.menu.url;
        } catch (err) {
            self.menu = '';
        }

        // Logic to not display 'undefined'. Checks to see if string in
        // undefined, if so then leave blank.
        self.twitter = self.twitter ? self.twitter : "";
        self.menu = self.menu ? self.menu : "";

    }).fail(function() {
        alert("There was an error with the Foursquare API call. Please " +
            "refresh the page and try again to load Foursquare data.");
    });



    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    this.bounds.extend(this.marker.position);

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);



    google.maps.event.addListener(this.marker, 'click', function() {

        var oldInfo = "";

        // Add information to the #info-panel for more in-depth infomation
        // about the chosen location.
        self.infoContent = '<div class="infor-panel-content">' +
            '<div><strong><a href="https://foursquare.com/v/' +
            data.foursquareUrl + '" target="_blank">' + data.name +
            '</a></strong></div>';

        if (self.menu !== '') {
            self.infoContent += '<div><a href="' + self.menu +
                '" target="_blank">Click for Menu</a></div>';
        }

        // Add Twitter account if location has one
        if (self.twitter !== '') {
            self.infoContent += '<div class="info-content"><strong>Twitter' +
                '</strong> @<a href="https://twitter.com/search?q=' +
                self.twitter + '&src=typd" target="_blank">' + self.twitter +
                '</a></div>';
        }

        self.infoContent += '<div class="info-content"><strong>Categories: ' +
            '</strong>' + data.categories + '</div></div>';


        self.infoWindow.setContent(self.infoContent);

        if (oldInfo) self.infoWindow.close();

        oldInfo = self.infoWindow;

        map.panTo(self.marker.getPosition())

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
    var mapID = document.getElementById('map');
    var buttons = document.getElementById('buttonDiv');
    var locations = document.getElementById('locations');
    var search = document.getElementById('search');

    map = new google.maps.Map(mapID, {
        zoom: 13,
        center: {
            lat: 33.18247,
            lng: -117.299738
        },
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },

    });

    google.maps.event.trigger(map, "resize");

    buttons.index = 1;

    map.controls[google.maps.ControlPosition.TOP].push(search);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(buttons);
    map.controls[google.maps.ControlPosition.LEFT].push(locations);



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
                    var location = locationItem.name.toLowerCase();
                    var categroy = locationItem.categories.toLowerCase();
                    var result = (location.search(filter) >= 0 ||
                        categroy.search(filter) >= 0);
                    locationItem.visible(result);
                    return result;
                });
        }
    }, self);

    this.mapElem = document.getElementById('map');
    this.mapElem.style.height = window.innerHeight - 250;


    var locations = document.getElementById("locations");

    self.numberOfClicks = ko.observable(0);
    self.slideLocations = function() {
        if (document.getElementById("locations").style.display === "none") {
            document.getElementById("locations").style.display = "block";
        } else {
            document.getElementById("locations").style.display = "none";
        }


    };
}

function startApp() {
    ko.applyBindings(new ViewModel());
}

function errorHandling() {
    alert("Google Maps has failed to load. Please check your internet " +
        "connection and try again.");
}
