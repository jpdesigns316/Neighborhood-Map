'use strict';

// Declaring global variables now to satisfy strict mode
var map;
var clientID;
var clientSecret;

// Foursquare API settings
clientID = "TP2NQO5LEORRMRP52IGDGN2MGOJKTBV4A3VNVOGAV5JMG23M";
clientSecret = "1AEYC4PEHVPBR12QRVTXHVOSSHASE4YLM1FMNELLFSG10CVJ";


var initialLocations = [
	{name: 'Calvary Chapel Vista', lat: 33.2106, long: -117.2333},
	{name: 'Calvary Chapel Carlsbad', lat: 33.1202596, long: -117.27769219999999},
	{name: 'Chik-Fil-A', lat: 33.1779847, long: -117.29627310000001},
	{name: 'Miracosta College', lat: 33.1908, long: -117.3029},
	{name: 'Ocean\'s 11 Casino', lat: 33.1992609, long: -117.36803050000003},
	{name: 'Pair-A-Dice Games', lat: 33.1841, long: -117.2846},
	{name: 'Teri Cafe II', lat: 33.1823806, long: -117.29232430000002},

];


// formatPhone function referenced from
// http://snipplr.com/view/65672/10-digit-string-to-phone-format/

function formatPhone(phonenum)
{
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum))
		{
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    }
    else
		{
        //invalid phone number
        return phonenum;
    }
}

var Location = function(data)
{
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.URL = "";
	this.street = "";
	this.description = "";
	this.city = "";
	this.phone = "";

	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		if (typeof self.URL === 'undefined'){
			self.URL = "";
		}
		self.street = results.location.formattedAddress[0];
   	self.city = results.location.formattedAddress[1];
		self.phone = results.contact.phone;
    if (typeof self.phone === 'undefined')
		{
			self.phone = "";
		} else
		{
			self.phone = formatPhone(self.phone);
		}
	}).fail(function()
	{
		alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
	});

	this.contentString = '<div class="info-window-content"><div><b>' + data.name + "</b></div>" +
				'<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";

	this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

	this.marker = new google.maps.Marker(
		{
			position: new google.maps.LatLng(data.lat, data.long),
			map: map,
			title: data.name
	});

	this.showMarker = ko.computed(function()
	{
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else
		{
			this.marker.setMap(null);
		}
		return true;
	}, this);

	this.marker.addListener('click', function()
	{
		self.contentString = '<div class="info-window-content"><strong>' + data.name + "</strong></div>" +
        '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

    self.infoWindow.setContent(self.contentString);

		self.infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
  	setTimeout(function()
		{
  		self.marker.setAnimation(null);
 		}, 2100);
	});

	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

function AppViewModel()
{
	var self = this;

	this.searchTerm = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'),
	{
			zoom: 12,
			center: {lat: 33.18247, lng: -117.299738}
	});


	initialLocations.forEach(function(locationItem)
	{
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function()
	{
		var filter = self.searchTerm().toLowerCase();
		if (!filter)
		{
			self.locationList().forEach(function(locationItem)
			{
				locationItem.visible(true);
			});
			return self.locationList();
		} else
		{
			return ko.utils.arrayFilter(self.locationList(), function(locationItem)
			{
				var string = locationItem.name.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, self);

	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}

function startApp()
{
	ko.applyBindings(new AppViewModel());
}

function errorHandling()
{
	alert("Google Maps has failed to load. Please check your internet connection and try again.");
}
