var request = require ('request'),
    TOKENS  = require ('./API_TOKENS');

var getTodoistItems = function (app, dataStore, callback) {
    var requestDates = ['overdue'];
    for (var i = -1; i < 7; i++) {
        var d = new Date();
        d.setDate (d.getDate() + i);
        requestDates.push (d);
    }
    request.get ({url: 'https://todoist.com/API/v6/query',
        qs : {   
            'token': TOKENS.TODOIST, 
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

        app.render ('todoist', {
            overdue: overdue, 
            current: current
        }, function (err, html) {
            dataStore['todoist'] = html;
            callback();
        })
    });
};

module.exports = getTodoistItems;