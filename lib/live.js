/**
 * $l - andy.lv
 * (C) 2014 - Andy.Lv
 * License: MIT
 * Source: https://github.com/microlv/Livejs/
 * Description: powerful promise library. simple and faster!
 */

(function (root, definition, undefined) {
    'use strict';

    if (typeof module !== 'undefined' && module.exports !== 'undefined') {
        module.exports = definition(undefined);
    }
    else if (typeof define === 'function' && define.amd === 'object') {
        define(definition);
    }
    else {
        root.$l = definition(undefined);
    }

})(typeof window === 'object' ? window : this, function (undefined) {
    'use strict';

    var isArray = Array.isArray;
    var _setImmediate;
    if (typeof setImmediate === 'function') {
        _setImmediate = setImmediate;
    } else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
        _setImmediate = process.nextTick;
    } else {
        _setImmediate = setTimeout;
    }
    var nextTick = function (callback, delay) {
        _setImmediate(callback, delay || 0);
    };

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function Livejs(resolve) {
        if (!(this instanceof Livejs)) {
            return new Livejs(resolve);
        }
        this.defer = new Defer(this);
        processQueue(this, resolve);
        nextProcessQueue(this);
    }

    Livejs.fn = Livejs.prototype = {
        version: '1.1.5',
        constructor: Livejs,
        then: function (resolve, reject) {
            processQueue(this, resolve, reject);
            return this;
        },
        all: function () {

        }
    };

    function processQueue(self, resove, reject) {
        var fns = wrap(self, resove, reject);
        self.defer.queue.push(fns);
    }

    function nextProcessQueue(self, type, val) {
        var i = 0,
            fn,
            current = self.defer.current,
            q = self.defer.queue;
        if (!current) {
            current = self.defer.current = q[0];
            nextTick(function () {
                current.fn(val);
            });
            return;
        }
        i = q.indexOf(current);
        current = self.defer.current = q[++i];
        if (!current) {
            return;
        }
        fn = (type === 'resolve' ? current.fn : current.err) || function (d) {
            d.resolve();
        };
        nextTick(function () {
            fn(val);
        });
    }

    function wrap(self, resolve, reject) {
        function ex(fn) {
            var exec = false;
            return function (val) {
                if (exec) {
                    return;
                }
                exec = true;
                fn = fn || function (d) {
                    d.resolve();
                };
                fn.call(self, self.defer, val);
            };
        }

        return {fn: ex(resolve), err: ex(reject)};
    }

    function Defer(self) {
        this.current = undefined;
        this.queue = [];
        this.$$parent = self;
    }

    Defer.prototype = {
        resolve: function (val) {
            nextProcessQueue(this.$$parent, 'resolve', val);
        },
        reject: function (val) {
            nextProcessQueue(this.$$parent, 'reject', val);
        }
    };

    /**
     * extend the object,dst is the return value
     * @param dst
     * @returns {*}
     */
    function extend(dst) {
        for (var i = 1, ii = arguments.length; i < ii; i++) {
            var obj = arguments[i];
            if (obj) {
                var keys = Object.keys(obj);
                for (var j = 0, jj = keys.length; j < jj; j++) {
                    var key = keys[j];
                    dst[key] = obj[key];
                }
            }
        }
        return dst;
    }

    function createLivejs(self) {
        return (self instanceof Livejs) ? self : new Livejs();
    }

    Livejs.series = function (fn, callback) {
        var q = createLivejs(this);
        if (isArray(fn)) {
            for (var i = 0; i < fn.length; i++) {
                processQueue(q, fn[i]);
            }
        } else {
            processQueue(q, fn);
        }
        processQueue(q, callback);
        return q;
    };

    Livejs.parallel = function (fn, callback) {
        var q = createLivejs(this);
        var r = [];
        if (isArray(fn)) {
            processQueue(q, function () {
                for (var i = 0; i < fn.length; i++) {
                    if (isFunction(fn[i])) {
                        r.push(fn[i].call(q));
                    }
                }
                callback.call(q, q.defer, r);
            });
        } else {
            if (isFunction(fn)) {
                callback.call(q, fn.call(q));
            }
        }
        return q;
    };

    Livejs.each = function (params, fn, callback) {

    };

    extend(Livejs.fn, {
        series: Livejs.series,
        parallel: Livejs.parallel,
        each: Livejs.each,
        extend: extend
    });

    return Livejs;
});