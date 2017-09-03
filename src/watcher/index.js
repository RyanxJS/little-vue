import Dep from '../dependence';
import { expToFunc } from 'util';

// 实现表达式、依赖、回调三者的绑定
// 当依赖改变时，由observer触发其dep的notify，即调用dep列表中各watcher的update，从而重新计算表达式的值并调用绑定的回调函数更新dom
class Watcher {
    constructor (exp, scope, callback) {
        this.value = null;
        this.exp = exp;
        this.scope = scope;
        this.callback = callback;
        this.update();
    }
    get () {
        Dep.target = this;
        // 这一步间接调用了exp中所有依赖的get方法，自动把此watcher实例添加到依赖的dep列表
        let value = expToFunc(this.exp, this.scope)();
        Dep.target = null;
        return value;
    }
    update () {
        let newVal = this.get();
        if (this.value !== newVal) {
            this.value = newVal;
            this.callback && this.callback(newVal);
        }
    }
}

export default Watcher;