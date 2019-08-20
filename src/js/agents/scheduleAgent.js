const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const math = require(path.join(__dirname, '../util/math'));
const config = file.read(path.join(__dirname, '../../../config/server.json'));

// "schedule": [{
//     "startRange": "17:00",
//     "endRange": "20:00",
//     "minDelay": 24*60*60*1000
//     "chance": 1,
//     "action": "Message",
//     "params": {
//         "target": "Michael#3038",
//         "message": "wanna play something?"
//     }
// }],

module.exports = function () {
    var DAY_TO_MS = 86400000;

    function start(group, done) {
        var schedule = config.groups[group].agents.schedule;
        if (schedule && schedule.length) {
            for (var i in schedule) {
                interpret(schedule[i], done);
            }
        }
    }

    function interpret(schedule, done, count = 0, prevTime) {
        var req = {
            'agent': {
                'action': schedule.action,
                'params': schedule.params
            }
        };
        var enabled = math.randomRange(0, 1) < schedule.chance;
        var startRange = schedule.startRange.split(':');
        var endRange = schedule.endRange.split(':');
    }

    return { start };
}();
