import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {req} from './common/request/request.js';
import  ToolsUp from './common/request/request-upFiles.js';

req.baseuUrl = 'https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
req.defaultReq.type = "POST";
Vue.prototype.$req = req;
Vue.prototype.$ToolsUp = ToolsUp;


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
