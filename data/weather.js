var request = require ('request'),
    TOKENS  = require ('./API_TOKENS');

var getWeatherReport = function (app, dataStore, callback) {
    request.get ({
        url: 'http://api.wunderground.com/api/c6d9a55c86081a82/conditions/q/CA/San_Francisco.json'

    }, function (err, resp, body) {
        body = JSON.parse(body);
        body['icons'] = {};

        body['icons']['sun'] = (body.current_observation.weather === 'Clear') ? 'active' : 'inactive';
        body['icons']['cloud'] = (body.current_observation.weather === 'Clouds') ? 'active' : 'inactive';
        body['icons']['rain'] = (body.current_observation.weather === 'Rain') ? 'active' : 'inactive';
        body['icons']['wind'] = (body.current_observation.wind_mph >= 3) ? 'active' : 'inactive';
        body['icons']['thunderstorm'] = (body.current_observation.weather === 'Thunderstorm') ? 'active' : 'inactive';

        app.render ('weather', body, function (err, html) {
            if (err) console.log (err);
            dataStore['weather'] = html;
            callback();
        })
    });
}

module.exports = getWeatherReport;