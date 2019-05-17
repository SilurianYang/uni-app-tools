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
		compress = 1,
		...args
	} = {}) {
		let platformFun = this.FunChunk[this.platform];
		let base64 = await platformFun.file({
			format,
			compress,
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
		resolvePath = true
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
			let file = new File([u8arr], `${filename}.${mime.split('/')[1]}`, {
				type: mime
			});
			let urlBlob = file;
			if (resolvePath) {
				urlBlob = (window.URL || window.webkitURL).createObjectURL(file)
			}
			resolve(urlBlob);
		})
	}
	/**
	 * h5端,网络图片，或者本地图片转base64
	 * @param {path}  	网络路径、本地路径
	 * @param {format}  自定义base64的类型，默认值png
	 * @param {compress}  压缩图片百分比，默认不压缩 0-1之间，值越大越清晰
	 */
	h5_appendFile({
		path = '',
		format = 'png',
		compress = 1,
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
					let base64 = canvas.toDataURL('image/jpeg', compress);
					base64 = base64.replace(/^data\:image.{0,}base64,/i, `data:image/${format};base64,`);
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
		filename = 'HHYANG',
		format = 'png'
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
	 * App 端 网络图片，或者本地图片转base64
	 * 
	 * 2019年5月17日11:22:55 新增压缩图片
	 * @param {path}  支持的网络图片，或者本地图片
	 * @param {isNet}	当前是否为网络图片，默认标识为本地图片  
	 * @param {format}	转换后的图片格式，支持"jpg"、"png"  
	 * @param {compress}  压缩图片百分比，默认不压缩 0-1之间，值越大越清晰
	 */
	app_appendFile({
		path = '',
		format = 'png',
		isNet = false,
		compress = 1,
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
		// 2019年5月17日11:25:38 新增压缩图片
		let promise_zip = (src, format, compress) => {
			return new Promise((resolve, reject) => {
				if(compress==1){		//不压缩
					return resolve({
						target:src
					});
				}
				plus.zip.compressImage({
					src,
					dst: `_doc/HHYANG.${format}`,
					overwrite:true,
					quality:compress*100,
					width:'50%',
					height:'50%',
				}, res => {
					resolve(res);
				}, err => {
					reject(err);
				});
			})
		}

		let promise_b = (path, format) => {
			return new Promise((resolve, reject) => {
				let bitmap = new plus.nativeObj.Bitmap(`HHYANG_BITMAP)`);
				bitmap.load(path, res => {
					let base64 = bitmap.toBase64Data();
					resolve(base64.replace(/^data\:image\/.{0,}\;/i, `data:image/${format};`));
					bitmap.clear();
				}, err => {
					bitmap.clear();
					reject(err);
				})
			})
		}
		return new Promise((resolve, reject) => {
			promise_d.then(async path => {
				let removePath=null;
				try {
					let {
						target
					} = await promise_zip(path, format, compress);
					let base64 = await promise_b(target, format);
					removePath=target;
					resolve(base64);
				} catch (e) {
					removePath=path;
					reject(e);
				}
				if(compress!=1){
					plus.io.resolveLocalFileSystemURL(removePath, entry =>entry.remove())
				}
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
		filename = 'HHYANG',
		format = 'png',
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
