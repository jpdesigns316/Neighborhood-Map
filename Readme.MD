# Neighborhood Map

This is a Udacity project as part the Full-Statck Web Developer nanodegree. The
purpose of this project is to learn how to use multiple different API's. Also
using the javascript library Knockout.js to get information from the API's and
use the fuctions of the javascript library to display them.

# Used

 Languages - HTML5, CSS3, Javascript, Knockout.js, jQuery
 API used - Google Maps API, Foursquare API

# Installation

1. Clone this project
```
git clone https://github.com/jpdesigns316/Neighborhood-Map.git neighborhood-map
```

2. If you don't have 'Flask' type, if you do skip to step 3:
```
pip install Flask
```
3.  Run the webserver in the neighborhood-map directory
```
python webserver.py
```
5. Edit app.js and input your CLIENT_ID and CLIENT_SECRET from the Foursquare
application that you created at https://developers.foursquare,con/

4. In your browser go to `http://127.0.0.1:5000`
---
If you with to add locations use the following format in the initialLocations
variable.

|   	|   	|
|---	|---	|
| name	|  The name of the location you want to create a marker for. 	|
| lat  	|  The longitude of the location. 	|
| long  	|  The longitude of the location. 	|
| foursquareLink | The location and id used on Foursqure. |

# Breakdown of app.js

_initialLocations_ - This is the variable in which the locations are going to be
placed in. It is the model of the MVVM

_Location_ - This is the section where the View gets create. This is the View
of the MVVM structure

_ViewModel_ - This is the section in which data is collected from the Model and
then sent to the View. This is the ViewModel of the MVVM structure.

_initMap_ - This section holds the information that goes into creating the Maps
and any controls which are added to the Mao.

For an example of this project check my portfolio site at:
http://jpdesigns316.com/neighborhood-map/
