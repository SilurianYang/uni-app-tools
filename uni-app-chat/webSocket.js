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
	onOpen: res => {
		console.log('连接成功')
	},
	onClose: err => {
		console.log('关闭了连接')
	},
	onReload: res => {
		console.log('重载：' + res)
	},
	onMsg: msg => {},
}).then(res => {
	Vue.prototype.$Socket = res;
})
