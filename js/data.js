var my = my || { }; //my namespace

my.dataservice = (function (my) {

    "use strict";
    var getDataSet = function () {
        return my.sampleData;
    };

    return {
        getData: getDataSet
    };
})(my);

my.sampleData = (function (my) {

    "use strict";

    var data = {

        geoCoordinates : [
          {'category': 'casino', 'name': 'Eastside Cannery Hotel and Casino', 'lat': 36.107847, 'lon': -115.05640399999999},
          {'category': 'casino', 'name': 'Arizona Charlie\'s Boulder', 'lat': 36.1241978, 'lon': -115.0758045 },
          {'category': 'casino', 'name': 'Boulder Station', 'lat': 36.13269199999999, 'lon': -115.084768},
          {'category': 'casino', 'name': 'Club Fortune', 'lat': 36.017758, 'lon': -114.948167},
          {'category': 'casino', 'name': 'Eldorado Casino',  'lat': 36.032018, 'lon': -114.983564},
          {'category': 'casino', 'name': 'Emerald Island Casino', 'lat': 36.032655, 'lon': -114.984652},
          {'category': 'casino', 'name': 'Joker\'s Wild', 'lat': 36.051963, 'lon': -114.994669},
          {'category': 'casino', 'name': 'Kahootz Bar', 'lat': 36.130155, 'lon': -115.082661},
          {'category': 'casino', 'name': 'Lake Mead Casino', 'lat': 36.052813, 'lon': -114.968051},
          {'category': 'casino', 'name': 'Longhorn Casino', 'lat': 36.107087, 'lon': -115.059146},
          {'category': 'casino', 'name': 'My Casino', 'lat': 36.024121, 'lon': -114.962872},
          {'category': 'casino', 'name': 'Railroad Pass Hotel & Casino', 'lat': 35.972519, 'lon': -114.91197},
          {'category': 'casino', 'name': 'Rainbow Club', 'lat': 36.032702, 'lon': -114.983688},
          {'category': 'casino', 'name': 'Skyline Restaurant and Casino', 'lat': 36.062479 , 'lon': -115.008526},
          {'category': 'casino', 'name': 'Sunset Station Hotel & Casino', 'lat': 35.981265 , 'lon': -114.916838},
          {'category': 'casino', 'name': 'Terrible\s Town Casino & Bowl', 'lat': 35.981265 , 'lon': -114.916838},
          {'category': 'casino', 'name': 'Dotty\'s #62 & #80', 'lat': 36.130324, 'lon': -115.082407},
          {'category': 'casino', 'name': 'Dotty\'s #76', 'lat': 36.030153, 'lon': -114.971208},
          {'category': 'casino', 'name': 'Dotty\'s #8', 'lat': 36.050587, 'lon': -114.994591}
            
        ],
        centerCoordinates : [25.754296, -80.377531],
        zoomLevel : 16
    }

    return {
        geoCoordinates : data.geoCoordinates,
        centerCoordinates: data.centerCoordinates,
        zoomLevel: data.zoomLevel
    };

})(my);
