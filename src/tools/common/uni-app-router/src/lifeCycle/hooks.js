export const registerHook = function(list, fn) {
	list.push(fn);
	return () => {
		const i = list.indexOf(fn)
		if (i > -1) list.splice(i, 1)
	}
}
export const executeHook = function(list, ...args) {
	for (let i = 0; i < list.length; i++) {
		list[i](args);
	}
}
export const resolveLife =async function(router, fromRule, toRule, fn) {
	const beforeHooks =await new Promise(async (resolve, reject) => {
		await router.lifeCycle.beforeHooks[0](toRule, fromRule, resolve);
	})
	console.log(beforeHooks)
}
