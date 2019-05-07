import Vue from 'vue'
import store from "./store.js"; //引入vuex	重要
import socket from "./socket.js"; //引入socket.js 重要
new socket({
	url: 'ws://192.168.0.29:9999/', //连接地址 必填
	SocketState: { //必填存储数据的地方
		store,
		success: ['SocketState', 'setSocketState'],
		err: ['SocketStateErr', 'setSocketStateErr']
	},
	maxInterValCount:10,
	interValTime:2000,
	onOpen: (res, sk) => {
		console.log('连接成功')
		let msg = {
			type: 'self',
			selfName: '老司机',
			text: '连接成功了',
			time: new Date().toLocaleTimeString()
		};
		sk.nsend(JSON.stringify(msg));
	},
	onClose: (err, sk) => {
		console.log('关闭了连接')
	},
	onReload: (err, sk) => {
		console.log('重载：' + res)
	},
	onRdFinsh:(count,sk)=>{
		console.log(count+'次重连已完成')
	},
	onMsg: (msg,sk) => {
		//console.log(msg)
	}
}).then(res => {
	Vue.prototype.$Socket = res;
})
