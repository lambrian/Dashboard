var request = require ('request'),
    debug_json = require ('./weather.json'),
    config = require ('../config.json');

var cachedAPI = {
    response: null,
    time: null
};

var getWeatherReport = function (app, dataStore, callback) {
    if (config.DEBUG) {
        generateWeatherModuleFunc(app, dataStore, callback)(null, null, JSON.stringify(debug_json));
    } else {
        if (new Date() - cachedAPI.time < (120 * 1000)) {
            console.log ('Cache valid. Using cached API response');
            generateWeatherModuleFunc(app, dataStore, callback)(null, null, JSON.stringify(cachedAPI.response));
        } else {
            console.log ('Refreshing cache.');
            request.get ({
                url: 'http://api.wunderground.com/api/c6d9a55c86081a82/conditions/q/CA/San_Francisco.json'
            }, generateWeatherModuleFunc(app, dataStore, callback));
        }
    }
}

var generateWeatherModuleFunc = function (app, dataStore, callback) {
    return function (err, resp, body) {
        body = JSON.parse(body);

        if (!config.DEBUG) {
            cachedAPI.response = body;
            cachedAPI.time = new Date();
        }

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
