# FlatQ

![node version][version-image]
[version-image]: https://img.shields.io/badge/flatq-v1-green.svg?style=livejs-square

## Introduce

```
1.powerful promise library. simple and faster!
2.use to do something like promise.
3.shortcut name use $l.

test case will coming soon...
more function will coming soon...
```
## Download
```
Check out [https://github.com/microlv/FlatQ.git];
GitHub: https://github.com/microlv/FlatQ/;
Wiki: http://microlv.github.io/FlatQ;
```
## Features
```
1.like q/async, but the code is simple and powerful and useful.
2.every function will inject a argument name 'defer', you can use it to resolve/reject.
3.detect the defer.err to see parent function has error or not.
```
## Support

Chrome, Nodejs

## Installation
```
npm install flatq --save
```
## Usage

sample use:

```js
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
```

```js
$l(function (d) {
    console.log('factory task 1');
    d.resolve();
}).then(function (d) {
    console.log('factory task 2');
    d.resolve();
}).series([
    function (d) {
        console.log('series task 3');
        d.resolve();
    }, function (d) {
        console.log('series task 4');
        d.resolve();
    }
], function (d) {
    console.log('series task 5');
}).then(function () {
    //why here don't work??
    //because task 5 don't resolve the it!!!
    console.log('I can\'t execute');
});
```

series:

```js
$l.series([function (d) {
    //use resolve will make the series execute next task!
    d.resolve();

    //step pass data
    var passData = {hello: 'world'};
    d.resolve(passData)

    //reject will make series stop.
    d.reject();

}], function (d, data) {

    //I can get the data from //step pass data
    console.log(data);
});
```

series example:

```js
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
```

## Author

```
Andy.lv@live.com;
Any problem contact with me.
```
## Contributors
