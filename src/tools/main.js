import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {
	req
} from './common/request/request.js';
import ToolsUp from './common/request/request-upFiles.js';
import ToolsdDown from './common/request/request-downFiles.js';

req.baseuUrl = 'https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
req.defaultReq.type = "POST";
req.defaultReq.testFun = (_res, _status) => {
	if (!_res.success) { //退出登录
		uni.reLaunch({
			url: 'login?userOut=true'
		});
	}
	return false
}
req.defaultReq.baseData = { //设置公共参数，默认为空，设置此参数后每次发送请求都会带上此参数
	token: '000-000-000-000-player125'
}
//上传测试工程
// req.defaultUp.url='https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
req.defaultUp.baseData = { //设置公共参数，默认为空，设置此参数后每次发送请求都会带上此参数
	token: '000-000-000-000-defaultUp'
}

//聊天测试
//import'./common/chat/webSocket.js';
import store from "./common/chat/store.js";
Vue.prototype.$store = store;
//聊天测试结束

Vue.prototype.$req = req;
Vue.prototype.$ToolsUp = ToolsUp;
Vue.config.productionTip = false;

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
