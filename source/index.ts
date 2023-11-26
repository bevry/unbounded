const bind = Function.prototype.bind

declare global {
	interface Function {
		/** The original function, before any binding. */
		unbounded?: this
	}
}

/**
 * Attach the `unbounded` property on the `bounded` function.
 * If `unbounded.unbounded` already exists, then it is used instead, to ensure that the `unbounded` property is always the original function.
 */
function define<T extends Function>(bounded: T, unbounded: T): void {
	if (bounded.unbounded !== unbounded) {
		Object.defineProperty(bounded, 'unbounded', {
			value: unbounded.unbounded || unbounded,
			enumerable: false,
			configurable: false,
			writable: false,
		})
	}
}

/**
 * Alternative to `Function.prototype.bind` that sets the `unbounded` property on the bounded function.
 * Types of this are not intelligent, as using the intelligent bind types causes this/unknown incompatibility. This is not important however, as the masquerading binder of {@link patch} has the intelligent types.
 */
export function binder(this: Function, thisArg: any, ...argArray: any[]): any {
	const bounded = bind.call(this, thisArg, ...argArray)
	define(bounded, this)
	return bounded
}

/** Patch the native `Function.prototype.bind` so that it sets the `unbounded` property on the bounded function. */
export function patch(): void {
	if (Function.prototype.bind !== binder) {
		/* eslint no-extend-native:0 */
		Function.prototype.bind = binder
	}
}
