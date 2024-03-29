import { binder, define, patch } from './index.js'
import { equal } from 'assert-helpers'
import kava from 'kava'

interface Context {
	str: string
}

kava.suite('unbounded', function (suite, test) {
	test('define works', function () {
		const a = function () {}
		const b = function () {}
		const c = function () {}
		define(b, c)
		define(a, b)
		equal(a.unbounded, c, 'unbounded was correct')
	})
	test('binder works', function () {
		const context: Context = {
			str: 'a',
		}
		function a(this: Context, value?: string) {
			this.str = value || this.str
			return this.str
		}

		const b = binder.call(a, context)
		equal(b.unbounded, a, 'unbounded was correct')
		equal(b(), context.str, 'context was correct')
		equal(context.str, 'a', 'context was correct')
		equal(b('b'), context.str, 'context was correct')
		equal(context.str, 'b', 'context was correct')

		const c = binder.call(a, context, 'c')
		equal(c.unbounded, a, 'unbounded was correct')
		equal(c(), context.str, 'context was correct')
		equal(context.str, 'c', 'context was correct')

		equal(b.unbounded, a, 'unbounded was correct')
	})
	test('patch works', function () {
		patch()
		const context: Context = {
			str: 'a',
		}
		function a(this: Context, value?: string) {
			this.str = value || this.str
			return this.str
		}

		const b = a.bind(context)
		equal(b.unbounded, a, 'unbounded was correct')
		equal(b(), context.str, 'context was correct')
		equal(context.str, 'a', 'context was correct')
		equal(b('b'), context.str, 'context was correct')
		equal(context.str, 'b', 'context was correct')

		const c = a.bind(context, 'c')
		equal(c.unbounded, a, 'unbounded was correct')
		equal(c(), context.str, 'context was correct')
		equal(context.str, 'c', 'context was correct')
	})
	test('nested binds work', function () {
		// patch is still applied
		const discardContext: Context = {
			str: 'z',
		}
		const context: Context = {
			str: 'a',
		}
		function a(this: Context, value?: string) {
			this.str = value || this.str
			return this.str
		}

		const b = (a.bind(discardContext).unbounded as typeof a).bind(context)
		equal(b.unbounded, a, 'unbounded was correct')
		equal(b(), context.str, 'context was correct')
		equal(context.str, 'a', 'context was correct')
		equal(b('b'), context.str, 'context was correct')
		equal(context.str, 'b', 'context was correct')

		const c = (a.bind(discardContext).unbounded as typeof a).bind(context, 'c')
		equal(c.unbounded, a, 'unbounded was correct')
		equal(c(), context.str, 'context was correct')
		equal(context.str, 'c', 'context was correct')
	})
})
