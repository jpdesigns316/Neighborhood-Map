// Declaring global variables now to satisfy strict mode
var map;
var clientID;
var clientSecret;
var locationInfomation;

// Foursquare API settings
clientID = "TP2NQO5LEORRMRP52IGDGN2MGOJKTBV4A3VNVOGAV5JMG23M";
clientSecret = "1AEYC4PEHVPBR12QRVTXHVOSSHASE4YLM1FMNELLFSG10CVJ";


// Model
var initialLocations = [
	{name: 'Chik-Fil-A', lat: 33.1779847, long: -117.29627310000001},
	{name: 'Buffalo Wild Wings', lat: 33.18185649999999, long: -117.32919190000001},
	{name: 'Fresh MXN Food', lat: 33.138909, long: -117.19882010000003},
	{name: 'KFC', lat: 33.2104598, long: -117.23445939999999},
	{name: 'Teri Cafe I', lat: 33.1858874, long: -117.32724159999998},
	{name: 'Teri Cafe II', lat: 33.1823806, long: -117.29232430000002}

];

// View
var Location = function(data)
{
	// Declaration of variables t collect infomation for the FourSqurare API
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.URL = '';
	this.street = '';
	this.description = '';
	this.city = '';
	this.phone = '';
	this.twitter =  '';
	this.categories = '';
	this.menu = '';
	this.contentString = '';

	this.visible = ko.observable(true);


	// Check to see if client web browser is a mobile device. Credit:  detectmobilebrowsers.com
	self.isMobile = function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	};


	// Generate FourSqurare JSON to data mine
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];


		self.URL = results.url;
		self.street = results.location.formattedAddress[0];
   	self.city = results.location.formattedAddress[1];
		self.phone = results.contact.formattedPhone;
		self.twitter = results.contact.twitter;
		self.categories = results.categories[0].name;

		if (!self.mobile)
		{
				self.menu = results.menu.url;
		} else
		{
				self.menu = results.menu.mobileUrl;
		}



		// Logic to not display 'undefined'. Checks to see if string in undefined, if so then leave blank.

    if (self.phone === undefined)
		{
			self.phone = '';
		}

		if (self.url === undefined)
		{
			self.url = '';
		}

		if (self.twitter === 'undefined')
		{
			self.twitter = '';
		}

		if (self.menu === 'undefined')
		{
			self.url = '';
			self.mobileUrl = '';
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

		// Add basic infmation to the info window.
		self.contentString = '<div class="information-panel-content"><div class="content"><strong>' + data.name + '</strong></div>' +
        '<div class="content">' + self.street + '</div>' +
        '<div class="content">' + self.city + '</div>' +
				'<div class="content"><em>Click info button for more information</em></div>';

		// Add information to the #info-panel for more in-depth infomation about the chosen location.
		self.infoContent = '<div class="information-panel-content text-left"><div><strong>Name: </strong>' + data.name + '</div>' +
						    				'<div class="info-content"><strong>URL: </strong><a href="' + self.URL +'">' + self.URL + '</a></div>' +
												'<div class="info-content"><strong>Address 1: </strong>Address:' + self.street + '</div>' +
												'<div class="info-content"><strong>Address 2: </strong>' + self.city + '</div>' +
												'<div class="info-content"><strong>Menu:</strong> <a href="' + self.menu + '" target="_blank">'+self.menu+'</a></div>';

		// Add Twitter account if location has one
		if (typeof self.twitter !== 'undefined') {
			self.infoContent +=  '<div class="info-content"><strong>Twitter</strong> @<a href="https://twitter.com/search?q=' + self.twitter + '&src=typd" target="_blank">' + self.twitter + '</a></div>';
		}

		self.infoContent += '<div class="info-content"><strong>Phone:</strong><a href="tel:' + self.phone +'">' + self.phone + '</a></div>' +
												'<div class="info-content"><strong>Categories: </strong>' + self.categories + '</div></div>';

		// Add an informtion to the #info-panel to be displayed there.
		$("#info-panel").html(self.infoContent);
		$(".info-content").css({"padding-top": "10px"});


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
function ViewModel()
{
	var self = this;

	this.searchTerm = ko.observable('');

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
	ko.applyBindings(new ViewModel());
}

function errorHandling()
{
	alert("Google Maps has failed to load. Please check your internet connection and try again.");
}
