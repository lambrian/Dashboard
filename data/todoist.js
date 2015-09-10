var request = require ('request'),
moment  = require ('moment'),
TOKENS  = require ('./API_TOKENS');

var getHumanTime = function (diff) {
    if (diff === 0)
        return 'Today';


    var str = '' + Math.abs(diff) + ' day';
    if (Math.abs(diff) > 1)
        str += 's'
    if (diff < 0) {
        str += ' ago';
    } else {
        str = 'In ' + str;
    }

    return str;
}

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
        var now = moment().startOf('day');
        for (var i = 0; i < tasks[0].data.length; i++) {
            var date = moment (tasks[0].data[i]['due_date'], 'ddd, DD MMM YYYY ZZ').startOf('day');
            tasks[0].data[i]['humanTime'] = getHumanTime(date.diff(now, 'days'));
        }
        var overdue = tasks[0].data;
        var current = [];
        for (var i = 1; i < tasks.length; i++) {
            for (var j = 0; j < tasks[i].data.length; j++) {
                var date = moment (tasks[i].data[j]['due_date'], 'ddd, DD MMM YYYY ZZ').startOf('day');
                tasks[i].data[j]['humanTime'] = getHumanTime(date.diff(now, 'days'));
                current.push (tasks[i].data[j]);
            }
        }

        app.render ('todoist', {
            overdue: overdue, 
            current: current
        }, function (err, html) {
            if (err) console.log (err);
            dataStore['todoist'] = html;
            callback();
        })
    });
};

module.exports = getTodoistItems;
