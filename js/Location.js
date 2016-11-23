var Location = Base.extend({
    constructor: function(name, lat, lng, foursquareUrl) {
        this.name = ko.observable(name);
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.foursquareUrl = ko.observable(foursquareUrl);

    }
});
