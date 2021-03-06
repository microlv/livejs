var $l = require('../lib/live');

$l(function (d) {
    setTimeout(function () {
        console.log('function 1');
        d.resolve('pass data to next function!');
        console.log('function 1 step 2');
    }, 0);
    console.log('function 1 step 1');
}).then(function (d, data) {
    console.log('function 2');
    console.log(data);
    d.reject();
}).then(function () {
    console.log('function 3,function2 resolve will go here');
}, function () {
    console.log('function 3 function2 reject will go here');
}).then(function () {
    console.log('function 4');
});

$l.series([
    function (d) {
        console.log('series 1');
        setTimeout(function () {
            d.resolve('series 2 finish!');
        }, 0);
    },
    function (d) {
        console.log('series 2');
        setTimeout(function () {
            d.resolve('series 2 finish!');
        }, 0);
    },
    function (d) {
        console.log('series 3');
        setTimeout(function () {
            d.resolve('series 3 finish!');
        }, 0);
    }
], function (d,result) {
    console.log('finish');
    d.resolve();
}).then(function (d) {
    console.log('then start');
});