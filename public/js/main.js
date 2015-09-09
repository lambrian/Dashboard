/* Set Time */
setInterval (function () {
    var curr = moment();
    var str = "";
    str += curr.year() + '.';
    str += ('0' + curr.month()).slice(-2) + '.';
    str += ('0' + curr.day()).slice(-2) + '.';
    str += ('0' + curr.hour()).slice(-2) + '.';
    str += ('0' + curr.minute()).slice(-2) + '.';
    str += ('0' + curr.second()).slice(-2) + '.';
    str += ('00' + curr.millisecond()).slice(-3).slice(0,2);
    $("#date").html(str);
}, 10);
