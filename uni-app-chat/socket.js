class Socket {
	constructor({
		url = '',
		onOpen = res => {},
		onMsg = msg => {},
		onClose = err => {},
		onError = err => {},
		SocketState = {},
		...args
	} = {}) {
		this.SocketTask = {};
		this.STORE = SocketState.store; //当前vuex 实例
		this.SUCCESSVAL = this.STORE.state[SocketState.success[0]]; //当前存储成功数据的对象
		this.SUCCESSFUN = SocketState.success[1]; //当前存储成功数据的提交方法
		this.ERRVAL = this.STORE.state[SocketState.err[0]]; //当前存储失败数据的对象
		this.ERRFUN = SocketState.err[1]; //当前存储成功数据的提交方法
		return this.initChat({
			url,
			onOpen,
			onMsg,
			onClose,
			onError
		});
	}
	
	/**
	 * websocket监听事件
	 */
	SocketEvents({
		onOpen,
		onMsg,
		onClose,
		onError,
	} = {}) {
		return new Promise(async (resolve, reject) => {
			uni.onSocketOpen((res = '{}') => {
				res = JSON.parse(JSON.stringify(res));
				onOpen(res);
				resolve();
			})
			uni.onSocketMessage((msg = '{}') => {
				msg =JSON.parse(msg.data);
				let newMsg = {};
				Object.assign(newMsg, this.SUCCESSVAL, msg);
				this.STORE.commit(this.SUCCESSFUN, newMsg);
				onMsg(msg);
			})
			uni.onSocketClose((err = '{}') => {
				err = JSON.parse(err);
				let newErr = {};
				Object.assign(newErr, this.ERRVAL, err);
				this.STORE.commit(this.ERRFUN, newErr);
				onClose(err);
			})
			uni.onSocketError((err = '{}') => {
				err =  JSON.parse(err);
				let newErr = {};
				Object.assign(newErr, this.ERRVAL, err);
				this.STORE.commit(this.ERRFUN, newErr);
				onError(err);
			})
			this.SocketTask.nsend = text => {
				uni.sendSocketMessage({
					data: text
				})
			}
		})
	}
	/**
	 * 开始初始化chat
	 */
	async initChat({
		url,
		onOpen,
		onMsg,
		onClose,
		onError,
		...args
	} = {}) {
		return new Promise((resolve, reject) => {
			Promise.all([this.connectSocket(url, args), this.SocketEvents({
				onOpen,
				onMsg,
				onClose,
				onError
			})]).then(res => {
				resolve(this.SocketTask);
			}).catch(err => {
				reject();
			})
		})
	}
	/**
	 * 连接webSocket
	 */
	connectSocket(url, args) {
		return new Promise((resolve, reject) => {
			uni.connectSocket({
				url,
				success: res => {
					resolve(res);
				},
				fail: err => {
					reject(err);
				},
				...args
			})
		})
	}

}
export default Socket
