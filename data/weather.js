var request = require ('request'),
    TOKENS  = require ('./API_TOKENS');

var getWeatherReport = function (app, dataStore, callback) {
    request.get ({
        url: 'http://api.openweathermap.org/data/2.5/weather', 
        qs: {
            'id' : TOKENS.WEATHER_CITY_ID,
            'units': 'Imperial'
        }
    }, function (err, resp, body) {
        body = JSON.parse(body);
        app.render ('weather', body, function (err, html) {
            dataStore['weather'] = html;
            callback();
        })
    });
}

module.exports = getWeatherReport;