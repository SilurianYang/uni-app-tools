import * as util from './helpers/util.js'
import {
	methods,
	route,
	lifeCycle
} from './helpers/config.js'

import * as lifeMothods from './lifeCycle/hooks.js'

class Router {
	constructor(arg) {
		if (arg && arg.constructor !== Object) {
			return console.error(`Routing configuration must be an Object`);
		}
		Router.$root = this;
		this.routers = arg;
		this.methods = methods;
		this.lifeCycle = lifeCycle;
		this.lastVim = null;

	}
	push(rule,next=true) {
		const _from = util.resolveRule(this, {
			path: '/' + this.lastVim.$mp.page.route
		}, this.lastVim.$mp.query);
		
		const _to = util.normalizeParams(JSON.parse(JSON.stringify(rule)), this.routers);
		
		lifeMothods.resolveLife(this, _from, {
			..._to.rule,
			...route(),
			query:util.parseQuery('query',_to.query,true).query
		}, function() {

			const cloneRule = util.normalizeParams(JSON.parse(JSON.stringify(rule)), this.routers);
			uni[this.methods['push']]({
				url: `${cloneRule.url}?${cloneRule.query}`
			})

		});


	}
	replace() {

	}
	replaceAll() {

	}
	pushTab() {

	}
	back() {

	}
	getQuery(Vim) {
		return util.resolveRule(this, {
			path: '/' + Vim.$mp.page.route
		}, Vim.$mp.query);
	}
	beforeEach(fn) {
		return lifeMothods.registerHook(this.lifeCycle.beforeHooks, fn);
	}
}
Router.$root = null;
Router.install = function(Vue) {
	Object.defineProperty(Vue.prototype, '$Router', {
		get: function() {
			Router.$root.lastVim = this;
			return Router.$root;
		}
	})
	Object.defineProperty(Vue.prototype, '$Route', {
		get: function() {
			return Router.$root.getQuery(this);
		}
	})
}

export default Router;
