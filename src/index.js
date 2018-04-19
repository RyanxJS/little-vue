import Compiler from './compiler';
// import Observer from './observer';
import proxyObserver from './observer/proxy-observer';
import { nextTick } from 'util';

// 将options中的data、computed、methods挂载到Vue实例上
function proxy (options) {
    for (let prop in options.data) {
        Reflect.defineProperty(this, prop, {
            enumerable: true,
            configurable: true,
            get () {
                return this.$options.data[prop];
            },
            set (newVal) {
                this.$options.data[prop] = newVal;
            }
        })
    }
    for (let prop in options.computed) {
        Reflect.defineProperty(this, prop, {
            enumerable: true,
            configurable: true,
            get () {
                return this.$options.computed[prop].call(this);
            },
            set (newVal) {

            }
        })
    }
    Object.assign(this, options.methods);
}

// Vue实例，用observer监听data，用compile编译el，compile过程中调用watcher实现el与data的绑定
class Vue {
    constructor (options) {
        options.data = proxyObserver(options.data);
        // new Observer(options.data);
        this.$options = options;
        proxy.call(this, options);
        this.$el =
            typeof options.el === 'string'
            ? document.querySelector(options.el)
            : options.el;
        if (!(this.$el instanceof HTMLElement)) {
            this.$el = document.body;
        }
        if (options.template) {
            this.$el.innerHTML = options.template;
        }
        options.created && options.created.bind(this)();
        new Compiler(this.$el, this);
        options.mounted && options.mounted.bind(this)();
    }
    $nextTick (fn) {
        typeof fn === 'function' && nextTick(fn.bind(this));
    }
}

module.exports = Vue;