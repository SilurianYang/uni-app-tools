import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import req from './common/request/request.js';

req.defaultReq.url = 'https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'

req.defaultReq.type = "post";
Vue.prototype.$req = req;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
