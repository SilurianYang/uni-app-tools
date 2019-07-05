import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {df}  from './common/request/request-downFiles.js';

import rup  from '@/common/request/request-upFiles.js';

df.baseuUrl = 'https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
df.defaultReq.type = "POST";


let timeout=function(){
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve();
		},3000)
	})
}

df.defaultReq.beforeSend=async res=>{
	// await timeout();
	// delete res.data
	return res;
}
df.defaultReq.beforeFinsh = (res, status) => {
	if (!res.data.success) { //退出登录
		uni.reLaunch({
			url: 'login?userOut=true'
		});
	}
	return res
}


df.defaultReq.baseData = { //设置公共参数，默认为空，设置此参数后每次发送请求都会带上此参数
	token: '000-000-000-000-player125'
}
//上传测试工程
rup.defaultUp.url='https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
rup.defaultUp.baseData = { //设置公共参数，默认为空，设置此参数后每次发送请求都会带上此参数
	token: '000-000-000-000-defaultUp'
}

//聊天测试
//import'./common/chat/useSocket.js';
import store from "./common/chat/store.js";
Vue.prototype.$store = store;
//聊天测试结束

//自定义事件引入
import event from './common/uni-app-customEvent/custom-event.js'
const Event=new event();
Vue.prototype.$event=Event;
//自定义事件引入结束

//自定义tabbar引入
import {draw} from './common/uni-app-tabbar/useTabbar.js'
Vue.prototype.$draw=draw;
//自定义tabbar引入结束



Vue.prototype.$req = df;
Vue.prototype.$rup = rup;
Vue.config.productionTip = false;

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
