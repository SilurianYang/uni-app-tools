import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {
	req
} from './common/request/request.js';
import ToolsUp from './common/request/request-upFiles.js';
import ToolsdDown from './common/request/request-downFiles.js';

// req.baseuUrl = 'https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
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
req.defaultUp.url='https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'
req.defaultUp.baseData = { //设置公共参数，默认为空，设置此参数后每次发送请求都会带上此参数
	token: '000-000-000-000-defaultUp'
}

//聊天测试
import store from "./common/chat/store.js";
import socket from "./common/chat/socket.js";
let count =0;
async function TestSocket() {
	try{
		const Socket = await new socket({
			url: 'ws://192.168.137.1:9999/',		//连接地址 必填
			SocketState: {	//必填存储数据的地方
				store,
				success: ['SocketState', 'setSocketState'],		
				err: ['SocketStateErr', 'setSocketStateErr']
			},
			onOpen:res=>{
				console.log('连接成功')
				count=0;
			},
			onClose:err=>{
				console.log('关闭了连接')
			},
			onReload:res=>{
				console.log('重载：'+res)
			},
			onMsg: msg => {}
		});
		console.log(Socket)
		setInterval(()=>{
			count++;
			if(count==10){
				Socket.nclose();	//关闭连接
				setTimeout(()=>{
					Socket.nrconnect();	//重新连接
				},5000)
			}
			Socket.nsend('我是测试的哦')
		},2000)
	}catch(e){
		console.log(e)
	}
};
TestSocket();

Vue.config.productionTip = false;
Vue.prototype.$store = store;
//聊天测试结束


Vue.prototype.$req = req;
Vue.prototype.$ToolsUp = ToolsUp;


App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
