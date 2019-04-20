class Expand {
	constructor(arg) {
		this.os = {
			pf: plus.device.vendor === 'Apple' ? 'ios' : 'android',
			pubFun: {
				ios: {
					imgLcoal: this._ImgToLocal,
					CopyText: this._iosCopy
				},
				android: {
					imgLcoal: this._ImgToLocal,
					CopyText: this._androidCopy
				}
			}
		}
	}
	/**
	 * 获取平台信息
	 */
	getPlatform(key) {
		return new Promise((resolve, reject) => {
			try {
				let deviceInfo = {
					vendor: plus.device.vendor,
					imei: plus.device.imei,
					imsi: plus.device.imsi,
					model: plus.device.model,
					uuid: plus.device.uuid,
				}
				let currentVal = deviceInfo[key];
				if (currentVal) {
					return resolve(currentVal);
				}
				return resolve(deviceInfo);
			} catch (e) {
				reject(e);
			}
		})
	}
	/**
	 * 显示原始底部菜单按钮
	 * 仅5+App可用
	 */
	showActionSheet({
		buttons = [{
			title: "标题1"
		}],
		cancel = "取消",
	} = {}) {
		return new Promise((resolve, reject) => {
			const actionList = {
				buttons,
			}
			if (cancel) {
				actionList.cancel = cancel;
			}
			plus.nativeUI.actionSheet(actionList, e => {
				resolve(e);
			})
		})
	}
	/**
	 * 保存图片到本地
	 * 下载图片然后保存，支持ios、android 
	 * ios 支持base64
	 */
	_ImgToLocal(path) {
		return new Promise((resolve, reject) => {
			let imgDtask = plus.downloader.createDownload(path, {
				method: "GET"
			}, (d, status) => {
				if (status == 200) {
					plus.gallery.save(d.filename, () => {
						plus.io.resolveLocalFileSystemURL(d.filename, (entry) => {
							entry.remove();
						});
						resolve();
					});
				} else {
					reject();
				}
			});
			imgDtask.start();
		})
	}
	/**
	 *  android 保存base64格式的图片到本地
	 */
	_androidImgToLocal(path) {
		return new Promise(async (resolve, reject) => {
			let bitmap = new plus.nativeObj.Bitmap('my');
			bitmap.loadBase64Data(path, (data) => {}, (res) => {
				reject(res);
			})
			bitmap.save(`_downloads/${+new Date()}.png`, {}, (d) => {
				plus.gallery.save(d.target, () => {
					plus.io.resolveLocalFileSystemURL(d.filename, (entry) => {
						entry.remove();
					});
					resolve();
				});
			}, () => {
				reject(status);
			})
		})
	}
	/**
	 * 保存图片到本地
	 */
	saveImgToLocal({
		path = ''
	} = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.os.pubFun[this.os.pf].imgLcoal(path);
				resolve();
			} catch (e) {
				reject(e);
			}
		})
	}
	/**
	 * ios 复制文字
	 */
	_iosCopy(text) {
		return new Promise((resolve) => {
			let UIPasteboard = plus.ios.importClass("UIPasteboard");
			let generalPasteboard = UIPasteboard.generalPasteboard();
			generalPasteboard.plusCallMethod({
				setValue: text,
				forPasteboardType: "public.utf8-plain-text"
			});
			generalPasteboard.plusCallMethod({
				valueForPasteboardType: "public.utf8-plain-text"
			});
			resolve();
		})
	}
	/**
	 * android 复制文字
	 */
	_androidCopy(text) {
		return new Promise((resolve) => {
			let Context = plus.android.importClass("android.content.Context");
			let main = plus.android.runtimeMainActivity();
			let clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip, "setText", text);
			resolve();
		})
	}
	/**
	 * 复制文字
	 * 仅App支持
	 */
	copyText(text) {
		return new Promise((resolve, reject) => {
			this.os.pubFun[this.os.pf].CopyText(text).then(() => {
				resolve({
					success: true,
					msg: '复制成功'
				});
			}).catch(err => {
				reject({
					success: false,
					msg: err
				});
			})
		})
	}

	/**
	 * 文件转换为base64
	 * 仅App支持
	 */
	turnFileBase64({
		filePath = '',
		title = false
	} = {}) {
		return new Promise((resolve, reject) => {
			if (filePath === '') {
				return reject('文件路径不能为空,可以是临时路径也可以是永久路径');
			}
			if (title) {
				uni.showLoading({
					title,
					mask: true
				})
			}
			plus.io.resolveLocalFileSystemURL(filePath, entry => {
				entry.file(file => {
					let reader = new plus.io.FileReader();
					reader.onload = e => {
						if (title) {
							uni.hideLoading();
						}
						resolve(e.target.result);
					};
					reader.onerror = err => {
						if (title) {
							uni.hideLoading();
						}
						reject(err)
					};
					reader.readAsDataURL(file, 'UTF-8');
				}, err => {
					if (title) {
						uni.hideLoading();
					}
					reject(err)
				})
			})
		})
	}
}
export default Expand;
