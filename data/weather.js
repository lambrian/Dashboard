var request = require ('request'),
    TOKENS  = require ('./API_TOKENS'),
    debug_json = require ('./weather.json'),
    config = require ('../config.json');
var getWeatherReport = function (app, dataStore, callback) {

    if (config.DEBUG) {
        generateWeatherModuleFunc(app, dataStore, callback)(null, null, JSON.stringify(debug_json));
    } else {

        request.get ({
            url: 'http://api.wunderground.com/api/c6d9a55c86081a82/conditions/q/CA/San_Francisco.json'

        }, generateWeatherModuleFunc(app, dataStore, callback));
    }
}

var generateWeatherModuleFunc = function (app, dataStore, callback) {
    return function (err, resp, body) {
        body = JSON.parse(body);

        co = body.current_observation;
        body['icons'] = {};
        body['icons']['sun'] = (co.weather === 'Clear') ? 'active' : 'inactive';
        body['icons']['cloud'] = (co.weather.match(/.*Cloud.*/)) ? 'active' : 'inactive';
        body['icons']['rain'] = (co.precip_today_metric > 0) ? 'active' : 'inactive';
        body['icons']['wind'] = (co.wind_mph >= 3) ? 'active' : 'inactive';
        body['icons']['thunderstorm'] = (co.weather.match(/.*Thunderstorm*/)) ? 'active' : 'inactive';
        body['icons']['fog'] = (co.weather.match(/.*Fog*/)) ? 'active' : 'inactive';


        app.render ('weather', body, function (err, html) {
            if (err) console.log (err);
            dataStore['weather'] = html;
            callback();
        })
    }
}

module.exports = getWeatherReport;
