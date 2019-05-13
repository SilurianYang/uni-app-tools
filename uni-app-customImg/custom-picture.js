class Ctpic {
	constructor() {
		this.FunChunk = {
			0: {
				file: this.app_appendFile,
				toPath: this.app_URLtoBitmap,
			},
			1: {
				file: this.h5_appendFile,
				toPath: this.h5_URLtoBlob,
			},
			2: {
				file: this.applet_appendFile,
				toPath: this.applet_URLtoPath
			}
		};
		this.platform = this.platformChunk();
	}
	/**
	 * 运行环境判断
	 */
	platformChunk() {
		switch (uni.getSystemInfoSync().platform) {
			case 'android':
			case 'ios':
				if (typeof plus != 'undefined') {
					return 0; //app
				}
				return 1; //h5
				break;
			default:
				return 2; //小程序（微信）
				break;
		}
	}
	/**
	 *base64 转blob对象 
	 */
	async dataURLtoBlob({
		GetBase64 = false,
		filename = 'HHYANG',
		format = 'png',
		...args
	} = {}) {
		let platformFun = this.FunChunk[this.platform];
		let base64 = await platformFun.file({
			format,
			...args
		});
		if (GetBase64) {
			return base64;
		}
		let res = await platformFun.toPath({
			base64,
			filename,
			format,
		});
		return res;
	}
	/**
	 * h5端base64转File
	 */
	h5_URLtoBlob({
		base64,
		filename,
	} = {}) {
		return new Promise(resolve => {
			let arr = base64.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			let file=new File([u8arr], `${filename}.${mime.split('/')[1]}`,{ type: mime });
			let urlBlob=(window.URL || window.webkitURL).createObjectURL(file);
			resolve(urlBlob);
		})
	}
	/**
	 * h5端
	 */
	h5_appendFile({
		path = '',
		format = 'png',
		...args
	} = {}) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.setAttribute('crossOrigin', 'Anonymous');
			img.src = path;
			img.onload = function() {
					let w = this.width,
						h = this.height;
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.setAttribute('width', w);
					canvas.setAttribute('height', h);
					ctx.drawImage(this, 0, 0, w, h);
					let base64 = canvas.toDataURL(`image/${format}`, 1 || 0.8);
					resolve(base64);
				},
				img.onerror = err => {
					reject(err);
				}
		})
	}
	/**
	 * App端把base64转为图片
	 */
	app_URLtoBitmap({
		base64,
		filename,
		format
	} = {}) {
		return new Promise((resolve, reject) => {
			let bitmap = new plus.nativeObj.Bitmap(`HHYANG_BITMAP)`);
			bitmap.loadBase64Data(base64, res => {
				bitmap.save(`_doc/${filename}.${format}`, {
					overwrite: true
				}, res => {
					resolve(res);
					bitmap.clear();
				}, err => {
					reject(`检查文件是否已经存在:${err}`);
					bitmap.clear();
				});
			}, err => {
				reject('base64加载失败');
				bitmap.clear();
			});
		})
	}
	/**
	 * App 端
	 */
	app_appendFile({
		path = '',
		format = 'png',
		isNet = false,
		...args
	} = {}) {
		let promise_d = new Promise((resolve, reject) => {
			if (!isNet) {
				return resolve(path);
			}
			let dtask = plus.downloader.createDownload(path, {}, (d, status) => { //是网络路径，需要下载到本地
				if (status == 200) {
					resolve(d.filename);
				} else {
					reject(status);
				}
			});
			dtask.start();
		})
		let promise_b = (path, format) => {
			return new Promise((resolve, reject) => {
				let bitmap = new plus.nativeObj.Bitmap(`HHYANG_BITMAP)`);
				bitmap.load(path, res => {
					resolve(bitmap.toBase64Data().replace(/^data\:image\/.{0,}\;/, `data:image/${format};`));
					bitmap.clear();
				}, err => {
					bitmap.clear();
					reject(err);
				})
			})
		}
		return new Promise((resolve, reject) => {
			promise_d.then(path => {
				promise_b(path, format).then(base64 => {
					resolve(base64);
				}).catch(err => {
					reject(`文件加载失败：${err}`);
				})
			}).catch(err => {
				reject(`网络路径可能链接不通：${err}`);
			})
		})
	}
	/**
	 * 微信小程序base64转为路径对象
	 */
	applet_URLtoPath({
		base64,
		filename,
		format,
	} = {}) {
		return new Promise((resolve, reject) => {
			if (typeof wx === 'undefined') {
				return reject('很抱歉，小程序系列目前仅支持"微信小程序"');
			}
			if (!wx.canIUse('getFileSystemManager')) {
				return reject('当前小程序版本API不可用');
			}

			let FileSystemManager = wx.getFileSystemManager();
			let filePath = `${wx.env.USER_DATA_PATH}/${filename}.${format}`;

			FileSystemManager.writeFile({
				filePath,
				data: base64.replace(/^data.{0,}base64,/, ''),
				encoding: 'base64',
				success: () => {
					resolve(filePath);
				},
				fail: err => {
					reject(err);
				}
			})

		})
	}
	/**
	 * 微信小程序端转base64
	 */
	applet_appendFile({
		path = '',
		format = 'png',
		isNet = false,
		...args
	} = {}) {
		return new Promise((resolve, reject) => {
			if (typeof wx === 'undefined') {
				return reject('很抱歉，小程序系列目前仅支持"微信小程序"');
			}
			if (!wx.canIUse('getFileSystemManager') || !wx.canIUse('downloadFile')) {
				return reject('当前小程序版本API不可用');
			}
			let promise_d = new Promise((resolve, reject) => {
				if (!isNet) {
					return resolve(path);
				}
				wx.downloadFile({
					url: path,
					success: res => {
						if (res.statusCode === 200) {
							resolve(res.tempFilePath);
						} else {
							reject(res);
						}
					},
					fail: err => {
						reject(err);
					}
				})

			})
			let promise_b = (filePath, format) => {
				return new Promise((resolve, reject) => {
					let FileSystemManager = wx.getFileSystemManager();
					FileSystemManager.readFile({
						filePath,
						encoding: 'base64',
						success: res => {
							resolve(`data:image/${format};base64,${res.data}`)
						},
						fail: err => {
							resolve(err);
						}
					})

				})
			}
			promise_d.then(path => {
				promise_b(path, format).then(base64 => {
					resolve(base64);
				}).catch(err => {
					reject(`读取文件失败：${err}`);
				})
			}).catch(err => {
				reject(`网络路径可能链接不通：${err}`);
			})
		})
	}
}
export default Ctpic;
