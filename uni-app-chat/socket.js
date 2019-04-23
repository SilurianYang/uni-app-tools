class Socket {
	constructor({
		url = '',
		onOpen = res => {},
		onMsg = msg => {},
		onClose = err => {},
		onError = err => {},
		onReload=info=>{},
		maxInterValCount = 10,
		SocketState = {},
		...args
	} = {}) {
		this.SocketTask = {
			nsend: text => {},
			nclose:t=>{},
			nrconnect:()=>{},
			isconnect: false,
			uniColse: false,
			maxInterValCount,
			InterValCount:0,
			url,
			onOpen,
			onMsg,
			onClose,
			onError,
			onReload,
			extra:args
		};
		this.STORE = SocketState.store; //当前vuex 实例
		this.SUCCESSVAL = this.STORE.state[SocketState.success[0]]; //当前存储成功数据的对象
		this.SUCCESSFUN = SocketState.success[1]; //当前存储成功数据的提交方法
		this.ERRVAL = this.STORE.state[SocketState.err[0]]; //当前存储失败数据的对象
		this.ERRFUN = SocketState.err[1]; //当前存储成功数据的提交方法
		return this.initChat(this.SocketTask,this.SocketTask.extra);
	}
	/**
	 * 心跳检测
	 */
	async hbDetection() {
		if(this.SocketTask.uniColse){
			return false;
		}
		if(!this.SocketTask.isconnect){	//未连接则启动连接
			try{
				if(this.SocketTask.maxInterValCount>this.SocketTask.InterValCount){
					this.SocketTask.InterValCount++;
					await this.initChat(this.SocketTask,this.SocketTask.extra);
					return	this.hbDetection();
				}
			}catch(e){
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
				this.SocketTask.isconnect=true;
				this.SocketTask.InterValCount=0;
				this.SocketTask.uniColse=false;
				res = JSON.parse(JSON.stringify(res));
				onOpen(res);
				resolve();
			})
			uni.onSocketMessage((msg = '{}') => {
				msg = JSON.parse(msg.data);
				let key=Object.keys(msg)[0];
				let newMsg = [];
				if(key){
					newMsg=JSON.parse(JSON.stringify(this.SUCCESSVAL[key]||[]));
					newMsg.push(msg[key]);
				}
				this.SUCCESSVAL[key]=newMsg;
				this.STORE.commit(this.SUCCESSFUN, Object.create(this.SUCCESSVAL));
				onMsg(msg);
			})
			uni.onSocketClose((err = '{}') => {
				this.SocketTask.isconnect=false;
				this.hbDetection();
				err = JSON.parse(err);
				let newErr = {};
				Object.assign(newErr, this.ERRVAL, err);
				this.STORE.commit(this.ERRFUN, newErr);
				onClose(err);
				reject(err);
			})
			uni.onSocketError((err = '{}') => {
				uni.closeSocket();
				err = JSON.parse(err);
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
			this.SocketTask.nclose=t=>{
				this.SocketTask.uniColse=true;
				uni.closeSocket();
			}
			this.SocketTask.nrconnect=async t=>{
				this.SocketTask.uniColse=true;
				uni.closeSocket();
				let reloadStatus=false;
				try{
					await this.initChat(this.SocketTask,this.SocketTask.extra);
					reloadStatus=true
				}catch(e){
					console.log(JSON.stringify(e))
				}
				onReload(reloadStatus);
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
	} = {},args) {
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
