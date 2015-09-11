var express = require ('express'),
    app     = express ();

app.set ('view engine', 'hbs');
app.use(express.static('public'));

var dataEndpoints = [
        require ('./data/todoist.js'),
        require ('./data/weather.js')
    ];

var generateDashboard = function (req, res) {
    var aggregatedData = {};
    var semaphore = dataEndpoints.length;
    var completionCallback = function () {
        semaphore -= 1;
        if (semaphore === 0) {
            res.render ('index', aggregatedData, function (err, html) {
                res.send (html);
            });
        }
    };

    for (var i = 0; i < dataEndpoints.length; i++) {
        dataEndpoints[i](app, aggregatedData, completionCallback);
    }
};

app.get ('/', generateDashboard);

var server = app.listen (process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log ('Listening at http://%s:%s', host, port);
});

