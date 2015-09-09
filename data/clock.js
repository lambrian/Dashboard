var getClock = function (app, dataStore, callback) {
    app.render ('date', function (err, html) {
        dataStore['date'] = html;
    })

    callback();
};

module.exports = getClock;