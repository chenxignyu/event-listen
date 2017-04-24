"use strict";

var Event = (function () {
    var global = this;
    var Event;
    var _default = 'default';

    Event = function () {
        var _listen;
        var _trigger;
        var _remove;
        var _shift = Array.prototype.shift;
        var _unshift = Array.prototype.unshift;
        var namespaceCache = {};
        var _create;

        var each = function (arr, fn) {
            var ret;
            for (var i = 0, len = arr.length; i < len; i++) {
                var n = arr[i];
                ret = fn.call(n, i, n);
            }
            return ret;
        };

        //监听
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };

        //删除
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var len = cache[key].length; len >= 0; len--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }

                } else {
                    cache[key] = [];
                }
            }
        };

        //触发
        _trigger = function () {
            var cache = _shift.call(arguments);
            var key = _shift.call(arguments);
            var args = arguments;
            var _self = this;
            var ret;
            var stack = cache[key];

            if (!stack || !stack.length) {
                return;
            }

            return each(stack, function () {
                return this.apply(_self, args);
            })
        };

        _create = function (namespace) {
            namespace = namespace || _default;
            var cache = {};
            var offlineStack = []; //离线事件
            var ret = {
                listen: function (key, fn, last) {
                    _listen(key, fn, cache);

                    if (offlineStack === null) {
                        return;
                    }

                    if (last === 'last') {
                        offlineStack.length && offlineStack.pop()();
                    } else {
                        if (offlineStack.length > 0) {
                            each(offlineStack, function () {
                                debugger;
                                this();
                            });
                        }
                    }
                    //如果是先监听 ，离线事件栈则为null
                    offlineStack = null;
                },
                one: function (key, fn, last) {
                    _remove(key, cache);
                    this.listen(key, fn, cache);
                },
                remove: function (key, fn) {
                    _remove(key, cache, fn);
                },
                trigger: function () {
                    debugger;
                    var fn;
                    var _self = this;
                    var args;

                    _unshift.call(arguments, cache);
                    args = arguments;
                    fn = function () {
                        return _trigger.apply(_self, args);
                    };

                    //如果存在离线事件
                    if (offlineStack) {
                        //添加当前函数进入离线事件 ， 并返回
                        return offlineStack.push(fn);
                    }

                    return fn();
                }
            };

            var result;
            if (namespace) {
                if (namespaceCache[namespace]) {
                    result = namespaceCache[namespace];
                } else {
                    result = namespaceCache[namespace] = ret;
                }
            } else {
                result = ret;
            }

            return result;
        };


        return {
            create: _create,
            one: function (key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            off: function (key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            on: function (key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function () {
                debugger;
                var event = this.create();
                event.trigger.apply(this, arguments);
            }
        }

    }();

    return Event;
})();

module.exports = Event;