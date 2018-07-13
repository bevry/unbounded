'use strict'

const bind = Function.prototype.bind

function binder (...args) {
	const unbounded = this.unbounded || this
	const result = bind.apply(this, args)
	Object.defineProperty(result, 'unbounded', {
		value: unbounded,
		enumerable: false,
		configurable: false,
		writable: false
	})
	return result
}

function patch () {
	if (Function.prototype.bind !== binder) {
		/* eslint no-extend-native:0 */
		Function.prototype.bind = binder
	}
}

module.exports = { bind, binder, patch }
