var request = require ('request'),
    TOKENS  = require ('./API_TOKENS');

var getWeatherReport = function (app, dataStore, callback) {
    request.get ({
        url: 'http://api.openweathermap.org/data/2.5/weather', 
        qs: {
            'zip': TOKENS.WEATHER_LOCATION,
            'units': 'Imperial'
        }
    }, function (err, resp, body) {
        body = JSON.parse(body);
        body['icons'] = {};
        body['icons']['sun'] = (body['weather'][0].main === 'Clear') ? 'active' : 'inactive';
        body['icons']['cloud'] = (body['weather'][0].main === 'Clouds') ? 'active' : 'inactive';
        body['icons']['rain'] = (body['weather'][0].main === 'Rain') ? 'active' : 'inactive';
        body['icons']['wind'] = (body['wind']['speed'] >= 3) ? 'active' : 'inactive';
        body['icons']['thunderstorm'] = (body['weather'][0].main === 'Thunderstorm') ? 'active' : 'inactive';

        app.render ('weather', body, function (err, html) {
            if (err) console.log (err);
            dataStore['weather'] = html;
            callback();
        })
    });
}

module.exports = getWeatherReport;