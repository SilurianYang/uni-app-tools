/**
 * 2019年4月7日14:17:12
 */
let _defaultFile = {
	filesFilter: {
		0: 'image',
		1: 'video',
		2: 'none'
	},
	upOpenDown: false
}
let _down = null; //下载文件对象

import {
	RQ
} from './request.js';
class UpFiles extends RQ {
	constructor(...arg) {
		super(arg);
		this.defaultFile = _defaultFile;
		this.FunChunk = {
			0: this.AppSelectFiles,
			1: this.otherSelectFiles
		};
		this.proxy(this.defaultFile, (key, value) => {
			if (key === 'upOpenDown' && value === true) {
				if (_down !== null) {
					return console.error(`'${key}' property is set repeatedly`, this);
				}
				_down = require('./request-downFiles.js').df;
			}
		});
	}
	/**
	 * 开始上传文件
	 * 2019年4月7日14:55:15
	 */
	startUpFiles({
		path = '',
		files = [],
		isUp = true,
		title = false,
		_ADMININDEX=null,	
		extra = {},
		...args
	} = {}, res) {
		return new Promise(async (resolve, reject) => {
			let upres = [];
			if (isUp) { //需要上传到服务器，然后再返回
				if (title) {
					uni.showLoading({
						title,
						mask: true,
					});
				}
				for (let i = 0; i < res.length; i++) {
					let fileName = files[i] != undefined ? files[i] : files[files.length - 1];
					try {
						upres.push(
							await this.ajaxFile({
								index: _ADMININDEX||i,
								path: path,
								title: false,
								filePath: res[i],
								fileName,
								extra,
								...args
							})
						)
					} catch (e) {
						upres.push(e)
					}
				}
				if (title) {
					uni.hideLoading();
				}
				resolve({
					uploaded: true,
					upres
				});
			}
			return resolve(res);
		})
	}
	/**
	 * 2019年4月7日15:07:54 
	 * 上传网络资源
	 */
	upnNetRes({
		netPath = '',
		upPath = '',
		files = [],
		abort = (finsh,bt) => {},
		title = false,
		extra = {},
		...args
	} = {}) {
		return new Promise(async (resolve, reject) => {
			const obj = {
				uploaded: true,
				upres:[],
			};
			if(netPath.constructor===String){
				netPath = netPath.split(',');
			}
			if(upPath.constructor===String){
				upPath=upPath.split(',');
			}
			for (let i = 0; i < netPath.length; i++) {
				try {
					const res = await _down.startDownFiles({
						path: [netPath[i]],
						...args
					});
					const uploadRes = await this.startUpFiles({
						path: upPath[i]||upPath[upPath.length-1],
						_ADMININDEX:i,
						files,
						isUp: true,
						abort,
						title,
						extra,
						...args
					}, res.FilePath);
					obj.upres.push(uploadRes.upres[0])
				} catch (e) {
					obj.upres.push(e)
				}
			}
			resolve(obj);
		})
	}
	/**
	 * 2019年4月6日16:19:20
	 * 选择文件
	 */
	selectFiles({
		type = 2,
		isUp=true,
		maximum = 1,
		multiple = true,
		sizeType = ['original', 'compressed'],
		sourceType = ['album','camera'],
		upload = {
			path: '',
			files: [],
			isUp: false,
			title: false,
			abort: bt => {},
			extra: {}
		},
		...extra
	} = {}) {
		return new Promise(async (resolve, reject) => {
			let merge = {
				type,
				maximum,
				sizeType,
				sourceType,
				multiple,
				...extra,
			}
			const res = await this.FunChunk[this.platform](merge);
			if(!isUp){
				return resolve(res);
			}
			try {
				const uploadRes = await this.startUpFiles(upload, res);
				resolve(uploadRes);
			} catch (e) {
				reject(e);
			}
		})
	}
	/**
	 * App选择文件
	 */
	AppSelectFiles(queryInfo) {
		return new Promise(async (resolve, reject) => {
			plus.gallery.pick(path => {
				resolve(path.files);
			}, err => {
				reject(err);
			}, {
				filter: _defaultFile.filesFilter[queryInfo.type],
				system: false,
				...queryInfo
			});
		})
	}
	/**
	 * 其他小程序，h5
	 */
	otherSelectFiles(queryInfo) {
		return new Promise(async (resolve, reject) => {
			uni.chooseImage({
				count: queryInfo.maximum,
				success: res => {
					resolve(res.tempFilePaths);
				},
				fail: err => {
					reject(err)
				},
				...queryInfo
			});
		})
	}
}
export default new UpFiles();
