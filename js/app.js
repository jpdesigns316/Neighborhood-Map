'use strict';

// Declaring global variables now to satisfy strict mode
var map;
var clientID;
var clientSecret;

// Foursquare API settings
clientID = "TP2NQO5LEORRMRP52IGDGN2MGOJKTBV4A3VNVOGAV5JMG23M";
clientSecret = "1AEYC4PEHVPBR12QRVTXHVOSSHASE4YLM1FMNELLFSG10CVJ";


// Model
var initialLocations = [
	{name: 'Chik-Fil-A', lat: 33.1779847, long: -117.29627310000001},
	{name: 'Buffalo Wild Wings', lat: 33.18185649999999, long: -117.32919190000001},
	{name: 'Fresh MXN Food', lat: 33.138909, long: -117.19882010000003},
	{name: 'KFC', lat: 33.2104598, long: -117.23445939999999},
	{name: 'Miracosta College', lat: 33.1908, long: -117.3029},
	{name: 'Ocean\'s 11 Casino', lat: 33.1992609, long: -117.36803050000003},
	{name: 'Pair-A-Dice Games', lat: 33.1841, long: -117.2846},
	{name: 'Teri Cafe I', lat: 33.1858874, long: -117.32724159999998},
	{name: 'Teri Cafe II', lat: 33.1823806, long: -117.29232430000002}

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


// View
var Location = function(data)
{
	// Declaration of variables
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.URL = "";
	this.street = "";
	this.description = "";
	this.city = "";
	this.phone = "";
	this.twitter =  "";
	this.contentString = "";

	this.visible = ko.observable(true);


	// Generate FourSqurare JSON to data mine
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		self.description = data.response.description;
		self.street = results.location.formattedAddress[0];
   	self.city = results.location.formattedAddress[1];
		self.phone = results.contact.phone;
		self.twitter = '@' + results.contact.twitter;

		// Logic to not display 'undefined'
		if (typeof self.URL === 'undefined'){
			self.URL = "";
		}

		if (typeof self.description === 'undefined'){
			self.description = "";
		}

    if (typeof self.phone === 'undefined')
		{
			self.phone = "";
		} else
		{
			self.phone = formatPhone(self.phone);
		}

		if (typeof self.twitter === '@undefined')
		{
			self.twitter = "";
		}
	}).fail(function()
	{
		alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
	});



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
		self.contentString = '<div class="info-window-content text-left"><div class="content">Name: <strong>' + data.name + '</strong></div>' +
				'<div class="content">' + self.description + '</div>' +
        '<div class="content"><a href="' + self.URL +'">' + self.URL + '</a></div>' +
        '<div class="content">Address:' + self.street + '</div>' +
        '<div class="content">' + self.city + '</div>';


		if (self.twitter != "@undefined") {
			self.contentString +=  '<div class="content"><a href="https://twitter.com/search?q=' + self.twitter + '&src=typd" target="_blank">' + self.twitter + '</div>' +
														 '<div class="content">Phone: <a href="tel:' + self.phone +'">' + self.phone + '</a></div></div>'
		}
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

// ViewModel
function AppViewModel()
{
	var self = this;

	this.searchTerm = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'),
	{
			zoom: 13,
			center: {lat: 33.18247, lng: -117.299738},
			mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.BOTTOM_CENTER
          },

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
