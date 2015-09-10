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

        var groups = JSON.parse (body);
        var now = moment().startOf('day');
        var tasks = [];
        for (var dateI = 0; dateI < groups.length; dateI++) {
            for (var taskI = 0; taskI < groups[dateI].data.length; taskI++) {
                var currTask = groups[dateI].data[taskI];
                var date = moment (currTask['due_date'], 'ddd, DD MMM YYYY Z').subtract(7, 'hours').startOf('day');
                currTask['humanTime'] = getHumanTime(date.diff (now, 'days'));
                currTask['type'] = (currTask['humanTime'].match(/.*ago/)) ? 'warning' : 'normal';
                tasks.push (currTask);
            }
        }

        app.render ('todoist', {
            tasks: tasks
        }, function (err, html) {
            if (err) console.log (err);
            dataStore['todoist'] = html;
            callback();
        })
    });
};

module.exports = getTodoistItems;
