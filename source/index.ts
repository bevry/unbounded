declare global {
	interface Function {
		/** The original function, before any binding. */
		unbounded?: this
	}
}

/** The original native bind function, before {@link patch} wraps it. */
export const bind = Function.prototype.bind

/**
 * Attach the `unbounded` property on the `bounded` function.
 * If `unbounded.unbounded` already exists, then it is used instead, to ensure that the `unbounded` property is always the original function.
 * @param bounded the bounded function
 * @param unbounded the original function, before any binding
 */
export function define<T extends Function>(bounded: T, unbounded: T): T {
	if (bounded.unbounded !== unbounded) {
		Object.defineProperty(bounded, 'unbounded', {
			value: unbounded.unbounded || unbounded,
			enumerable: false,
			configurable: false,
			writable: false,
		})
	}
	return bounded
}

/**
 * Alternative to `Function.prototype.bind` that sets the `unbounded` property on the bounded function.
 * Types of this are not intelligent, as using the intelligent bind types causes this/unknown incompatibility. This is not important however, as the masquerading binder of {@link patch} has the intelligent types.
 * @example `a.bind(context, arg1, arg2)` is equivalent to `binder.call(a, context, arg1, arg2)`
 * @param this the function that will be bounded
 * @param newThis the new `this` context to attach to the bounded function
 * @param prefilledArguments the arguments to prefill the bounded function with
 */
export function binder(
	this: Function,
	newThis: any,
	...prefilledArguments: any[]
): any {
	const unbounded = this
	const bounded = bind.call(unbounded, newThis, ...prefilledArguments)
	return define(bounded, unbounded)
}

/** Patch the native `Function.prototype.bind` so that it sets the `unbounded` property on the bounded function. */
export function patch(): void {
	if (Function.prototype.bind !== binder) {
		/* eslint no-extend-native:0 */
		Function.prototype.bind = binder
	}
}
