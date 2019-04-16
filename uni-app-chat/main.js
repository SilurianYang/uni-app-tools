import Vue from 'vue'
import App from './App'

import store from "./common/store.js";
import socket from "./common/socket.js";

async function TestSocket() {
	try{
		const Socket = await new socket({
			url: 'ws://192.168.0.29:9999/',		//连接地址 必填
			SocketState: {	//必填存储数据的地方
				store,
				success: ['SocketState', 'setSocketState'],		
				err: ['SocketStateErr', 'setSocketStateErr']
			},
			onMsg: msg => {}
		});
		setInterval(()=>{
			Socket.nsend('我是测试的哦')
		},3000)
	}catch(e){
		console.log(e)
	}
};
TestSocket();

Vue.config.productionTip = false;
Vue.prototype.$store = store;

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
