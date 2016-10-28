var map;
var las_vegas = {lat: 36.082479 , lng: -115.008526};

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map)
{

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.className = 'controlUI';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);


  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.className = 'controlText';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function()
  {
    map.setCenter(las_vegas);
  });

}

function initMap(item)
{
  map = new google.maps.Map(document.getElementById('map'),
  {
    zoom: 11,
    center: las_vegas
  });

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


  var self = this;

  function casino(venue, lat, lng)
  {
    this.name = venue;
    this.lat = lat;
    this.lng = lng;
  }

  self.markers = ko.observableArray(
    [
      new casino('Eastside Cannery Hotel and Casino',  36.107847, -115.05640399999999),
      new casino('Arizona Charlie\'s Boulder', 36.1241978, -115.0758045 ),
      new casino('Boulder Station', 36.13269199999999, -115.084768),
      new casino('Club Fortune', 36.017758, -114.948167),
      new casino('Eldorado Casino',  36.032018, -114.983564),
      new casino('Emerald Island Casino',36.032655, -114.984652),
      new casino('Joker\'s Wild',  36.051963 ,-114.994669),
      new casino('Kahootz Bar',  36.130155 ,-115.082661),
      new casino('Lake Mead Casino',  36.052813 ,-114.968051),
      new casino('Longhorn Casino',  36.107087 ,-115.059146),
      new casino('My Casino',  36.024121 ,-114.962872),
      new casino('Railroad Pass Hotel & Casino',  35.972519 ,-114.91197),
      new casino('Rainbow Club',  36.032702 ,-114.983688),
      new casino('Skyline Restaurant and Casino',  36.062479 ,-115.008526),
      new casino('Sunset Station Hotel & Casino',  35.981265 ,-114.916838),
      new casino('Terrible\s Town Casino & Bowl', 35.981265 ,-114.916838),
      new casino('Dotty\'s #62 & #80',  36.130324 ,-115.082407),
      new casino('Dotty\'s #76',  36.030153 ,-114.971208),
      new casino('Dotty\'s #8',  36.050587 ,-114.994591)
    ]);





    var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });
}, viewModel);

      setMarkers(markers);

      ko.applyBindings(markers);
}
function setMarkers(markers)
{

  var infowindow = new google.maps.InfoWindow();
  var marker;
  for(var i = 0; i < markers().length; i++)
  {

    marker = new google.maps.Marker(
    {
        position: new google.maps.LatLng(markers()[i].lat, markers()[i].lng),
        map: map,
        animation: google.maps.Animation.DROP,
        title: markers()[i].title
    });

    var content = markers()[i].title;

    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow)
    {
        return function()
        {
          infowindow.setContent(content);
          infowindow.open(map,marker);
        };
    })(marker,content,infowindow));
  }
}
