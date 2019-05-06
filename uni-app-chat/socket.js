class Socket {
	static stopTime = 0;
	constructor({
		url = '',
		onOpen = res => {},
		onMsg = msg => {},
		onClose = err => {},
		onError = err => {},
		onReload = info => {},
		onRdFinsh = () => {},
		maxInterValCount = 10,
		interValTime = 1000,
		SocketState = {},
		...args
	} = {}) {
		this.SocketTask = {  
			nsend: text => {},
			nclose: t => {},
			nrconnect: () => {},
			isconnect: false,
			uniColse: false,
			maxInterValCount,
			interValTime,
			InterValCount: 0,
			eventPatch:null,
			url,
			onOpen,
			onMsg,
			onClose,
			onError,
			onReload,
			onRdFinsh,
			extra: args
		};
		this._EventDispath();
		this.STORE = SocketState.store; //当前vuex 实例
		this.SUCCESSVAL = this.STORE.state[SocketState.success[0]]; //当前存储成功数据的对象
		this.SUCCESSFUN = SocketState.success[1]; //当前存储成功数据的提交方法
		this.ERRVAL = this.STORE.state[SocketState.err[0]]; //当前存储失败数据的对象
		this.ERRFUN = SocketState.err[1]; //当前存储成功数据的提交方法
		return this.initChat(this.SocketTask, this.SocketTask.extra);
	}
	/**
	 * 仅供内部使用，事件注册
	 */
	_EventDispath() {
		let events={
				onOpen:[],
				onMsg:[],
				onClose:[],
				onError:[],
				onReload:[],
				onRdFinsh:[],
			}
		function EventDispatcher() {
			this.events = events;
		}
		for (let key in events) {
			EventDispatcher.prototype[key]=function(handler){
				 if (typeof handler != 'function') return;
				this.events[key].push(handler)
			}
		}
		EventDispatcher.prototype.dispatchEvent =function(type,msg){
			let evenArr=this.events[type];
			if(evenArr.length>0){
				for (let i = 0; i < evenArr.length; i++) {
					evenArr[i](msg)
				}
			}
		}
		this.SocketTask.eventPatch=new EventDispatcher();  
	}
	/**
	 * 心跳检测
	 */
	async hbDetection() {
		if (this.SocketTask.uniColse) {
			return false;
		}
		clearTimeout(Socket.stopTime);
		if (!this.SocketTask.isconnect) { //未连接则启动连接
			try {
				if (this.SocketTask.maxInterValCount > this.SocketTask.InterValCount) {
					Socket.stopTime = setTimeout(async () => {
						this.SocketTask.InterValCount++;
						await this.initChat(this.SocketTask, this.SocketTask.extra);
						return this.hbDetection();
					}, this.SocketTask.interValTime)
				} else {
					this.SocketTask.onRdFinsh(this.SocketTask.maxInterValCount, this.SocketTask);
				}
			} catch (e) {
				console.log(JSON.stringify(e))
			}
		}

	}
	/**
	 * websocket监听事件
	 */
	SocketEvents({
		onOpen,
		onMsg,
		onClose,
		onError,
		onReload
	} = {}) {
		return new Promise(async (resolve, reject) => {
			uni.onSocketOpen((res = '{}') => {
				this.SocketTask.isconnect = true;
				this.SocketTask.InterValCount = 0;
				this.SocketTask.uniColse = false;
				if (typeof res !== "object") {
					res = JSON.parse(JSON.stringify(res));
				}
				resolve();
				onOpen(res, this.SocketTask);
				this.SocketTask.eventPatch.dispatchEvent('onOpen',{res,sk:this.SocketTask})
			})
			uni.onSocketMessage((msg = '{}') => {
				if (typeof res !== "object") {
					msg = JSON.parse(msg.data);
				}
				let key = Object.keys(msg)[0];
				let newMsg = [];
				if (key) {
					newMsg = JSON.parse(JSON.stringify(this.SUCCESSVAL[key] || []));
					newMsg.push(msg[key]);
				}
				this.SUCCESSVAL[key] = newMsg;
				this.STORE.commit(this.SUCCESSFUN, Object.create(this.SUCCESSVAL));
				onMsg(msg, this.SocketTask);
				this.SocketTask.eventPatch.dispatchEvent('onMsg',{msg,sk:this.SocketTask})
			})
			uni.onSocketClose((err = '{}') => {
				this.SocketTask.isconnect = false;
				this.hbDetection();
				if (typeof res !== "object") {
					err = JSON.parse(err);
				}
				let newErr = {};
				Object.assign(newErr, this.ERRVAL, err);
				this.STORE.commit(this.ERRFUN, newErr);
				reject(err);
				onClose(err, this.SocketTask);
				this.SocketTask.eventPatch.dispatchEvent('onClose',{err,sk:this.SocketTask})
			})
			uni.onSocketError((err = '{}') => {
				uni.closeSocket();
				if (typeof res !== "object") {
					err = JSON.parse(err);
				}
				let newErr = {};
				Object.assign(newErr, this.ERRVAL, err);
				this.STORE.commit(this.ERRFUN, newErr);
				reject(err);
				onError(err, this.SocketTask);
				this.SocketTask.eventPatch.dispatchEvent('onError',{err,sk:this.SocketTask})
			})
			this.SocketTask.nsend = text => {
				uni.sendSocketMessage({
					data: text
				})
			}
			this.SocketTask.nclose = t => {
				this.SocketTask.uniColse = true;
				uni.closeSocket();
			}
			this.SocketTask.nrconnect = async t => {
				this.SocketTask.uniColse = true;
				uni.closeSocket();
				let reloadStatus = false;
				try {
					await this.initChat(this.SocketTask, this.SocketTask.extra);
					reloadStatus = true
				} catch (e) {
					console.log(JSON.stringify(e))
				}
				onReload(reloadStatus, this.SocketTask);
				this.SocketTask.eventPatch.dispatchEvent('onReload',{reloadStatus,sk:this.SocketTask})
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
		onReload
	} = {}, args) {
		return new Promise((resolve, reject) => {
			Promise.all([this.connectSocket(url, args), this.SocketEvents({
				onOpen,
				onMsg,
				onClose,
				onError,
				onReload
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
