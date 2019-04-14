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
		showProgress=false,
		extra = {}
	} = {}, res) {
		return new Promise(async (resolve, reject) => {
			try {
				if (isUp) { //需要上传到服务器，然后再返回
					if (title) {
						uni.showLoading({
							title,
							mask: true,
						});
					}
					for (let i = 0; i < res.length; i++) {
						if (showProgress) {
							title = `${(i+1)}/${res.length}`
						}
						let fileName = files[i] != undefined ? files[i] : files[files.length - 1];
						let upres = await this.ajaxFile({
							path: path,
							title: false,
							filePath: res[i],
							fileName,
							extra: extra
						});
					}
					if (title) {
						uni.hideLoading();
					}
					resolve({
						upload: true
					});
				}
				return resolve(res);
			} catch (e) {
				uni.hideLoading();
				reject(e);
			}
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
		abort = (bt, finsh) => {},
		title = false,
		...extra
	} = {}) {
		return new Promise(async (resolve, reject) => {
			const res = await _down.startDownFiles({
				path: netPath,
				abort,
				...extra
			});
			try {
				const uploadRes = await this.startUpFiles({
					path: upPath,
					files,
					isUp: true,
					title,
					extra
				}, res.FilePath);
				resolve(uploadRes);
			} catch (e) {
				reject(e);
			}
		})
	}
	/**
	 * 2019年4月6日16:19:20
	 * 选择文件
	 */
	selectFiles({
		type = 2,
		maximum = 1,
		multiple = true,
		sizeType = ['original', 'compressed'],
		sourceType = ['album'],
		upload = {
			path: '',
			files: [],
			isUp: false,
			title: false,
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
