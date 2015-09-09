var express = require ('express'),
    http    = require ('http-request'),
    path    = require ('path'),
    assert  = require ('assert'),
    request = require ('request'),
    TOKENS  = require ('./API_TOKENS'),
    app     = express ();

app.set ('view engine', 'hbs');
app.use(express.static('public'));

app.get ('/', function (req, res) {
    var requestDates = ['overdue'];
    for (var i = -1; i < 7; i++) {
        var d = new Date();
        d.setDate (d.getDate() + i);
        requestDates.push (d);
    }
    request.get ({url: 'https://todoist.com/API/v6/query',
        qs : {   'token': TOKENS.TODOIST, 
            'queries': JSON.stringify(requestDates)
        }
    }, function (err, resp, body) {
        var tasks = JSON.parse (body);
        var overdue = tasks[0].data;
        var current = [];
        for (var i = 1; i < tasks.length; i++) {
            for (var j = 0; j < tasks[i].data.length; j++) {
                current.push (tasks[i].data[j]);
            }
        }

        res.render ('index', { 
            'overdue': overdue,
            'current': current
        }, function (err, html) {
            res.send (html);
        });
    });
});

var server = app.listen (process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log ('Listening at http://%s:%s', host, port);
});

