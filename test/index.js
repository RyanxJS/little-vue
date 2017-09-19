import Vue from '../src/index';

describe('little-vue api test', () => {
    let vm;
    beforeEach(done => {
        vm = new Vue({
            el: document.createElement('div'),
            template:
                `<div>
                    <span id="data">{{ text }}</span>
                    <span id="computed">{{ textLen }}</span>
                    <span id="v-bind" :attr="attr"></span>
                    <span id="v-if">
                        <span v-if="true" data-true></span>
                        <span v-if="false" data-false></span>
                    </span>
                    <span id="v-on" @click="onClick"></span>
                    <span id="arr">{{ JSON.stringify(arr[arr.length - 1]) }}</span>
                </div>`,
            data: {
                text: 'text',
                attr: 'attr',
                clicked: false,
                arr: ['a', 'r', 'r'],
            },
            computed: {
                textLen () {
                    return this.text.length;
                }
            },
            methods: {
                onClick () {
                    this.clicked = true;
                }
            },
        });
        vm.$nextTick(done);
    });

    it('compile textNode', () => {
        expect(vm.$el.querySelector('#data').innerText).toBe('text');
        expect(vm.$el.querySelector('#computed').innerText).toBe('4');
    });

    it('compile attributes(v-bind)', () => {
        expect(vm.$el.querySelector('#v-bind').getAttribute('attr')).toBe('attr');
    });

    it('compile attributes(v-if)', () => {
        let container = vm.$el.querySelector('#v-if');
        expect(container.querySelector('[data-true]')).not.toBe(null);
        expect(container.querySelector('[data-false]')).toBe(null);
    });

    it('compile methods(v-on)', () => {
        expect(vm.clicked).toBe(false);
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', true, true);
        vm.$el.querySelector('#v-on').dispatchEvent(evt);
        expect(vm.clicked).toBe(true);
    });

    it('check reactive', (done) => {
        vm.text = 'text2';
        vm.attr = 'attr2';
        vm.$nextTick(() => {
            expect(vm.$el.querySelector('#data').innerText).toBe('text2');
            expect(vm.$el.querySelector('#computed').innerText).toBe('5');
            expect(vm.$el.querySelector('#v-bind').getAttribute('attr')).toBe('attr2');
            done();
        });
    });

    it('check reactive array', async (done) => {
        let container = vm.$el.querySelector('#arr');
        expect(container.innerText).toBe('"r"');
        let item = {a: 1};
        vm.arr.push(item);
        await new Promise(resolve => vm.$nextTick(resolve));
        expect(container.innerText).toBe(JSON.stringify(item));
        item.a = 2;
        await new Promise(resolve => vm.$nextTick(resolve));
        expect(container.innerText).toBe(JSON.stringify(item));
        done();
    });
});
