'use strict'

const unbounded = require('./')
const { equal } = require('assert-helpers')
const kava = require('kava')

const context = {
	hello: 'world',
}

kava.suite('unbounded', function (suite, test) {
	test('binder works', function () {
		function a() {
			return this.hello
		}
		const b = unbounded.binder.call(a, context)
		equal(b(), context.hello, 'context was correct')
		equal(b.unbounded, a, 'unbounded was correct')
	})
	test('patch works', function () {
		unbounded.patch()
		function a() {
			return this.hello
		}
		const b = a.bind(context)
		equal(b(), context.hello, 'context was correct')
		equal(b.unbounded, a, 'unbounded was correct')
	})
	test('nested binds work', function () {
		function a() {
			return this.hello
		}
		const b = a.bind(context).bind({})
		equal(b(), context.hello, 'context was correct')
		equal(b.unbounded, a, 'unbounded was correct')
	})
})
