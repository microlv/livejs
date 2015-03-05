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
    define([], definition);
  }
  else {
    root.$l = definition(undefined);
  }

})(typeof window === 'object' ? window : this, function (undefined) {
  'use strict';

  var _setImmediate;
  if (typeof setImmediate === 'function') {
    _setImmediate = setImmediate;
  }
  else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    _setImmediate = process.nextTick;
  }
  else {
    _setImmediate = setTimeout;
  }
  var nextTick = function (callback, delay) {
    _setImmediate(callback, delay || 0);
  };

  var isArray = Array.isArray;

  function isFunction(fn) {
    return typeof fn === 'function';
  }

  function Livejs(resolve) {
    if (!(this instanceof Livejs)) {
      return new Livejs(resolve);
    }
    this.defer = new Defer(this);
    this.fail = function () {
    };
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

  function processFailQueue() {
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

  var _each = function (arr, fn) {
    if (arr.forEach) {
      return arr.forEach(fn);
    }
    for (var i = 0; i < arr.length; i++) {
      fn(arr[i], i, arr);
    }
  };

  var _eachArr = function (arr, callback) {
    var q = createLivejs(this);
    if (isArray(arr)) {
      if (!arr.length) {
        return processQueue(q, callback);
      }
      for (var i = 0; i < arr.length; i++) {
        processQueue(q, arr[i]);
      }
    }
    else {
      processQueue(q, arr);
    }
    processQueue(q, callback);
    return q;
  };

  function doEach(execFn, callback) {
    var q = createLivejs(this);
    callback = callback || function () {
    };
    processQueue(q, execFn);
    processQueue(q, callback);
    return q;
  }

  Livejs.series = function (arr, callback) {
    return _eachArr.call(this, arr, callback);
  };

  Livejs.parallel = function (arr, callback) {
    var r = [], that = this;
    return doEach.call(that, function (d) {
      _each(arr, function (k) {
        if (isFunction(k)) {
          r.push(k.call(that));
        }
      });
      d.resolve(r);
    }, callback);
  };

  Livejs.each = function (arr, iterator, callback) {
    var r = [];
    return doEach.call(this, function (d) {
      _each(arr, function (k) {
        iterator(k);
      });
      d.resolve(r);
    }, callback);
  };

  Livejs.fail = function (fn) {
    return processFailQueue(this, fn);
  };

  Livejs.finally = function () {

  };

  extend(Livejs.fn, {
    series: Livejs.series,
    parallel: Livejs.parallel,
    each: Livejs.each,
    forEach: Livejs.each,
    extend: extend
  });

  return Livejs;
});