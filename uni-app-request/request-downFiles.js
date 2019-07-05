/**
 * 2019年4月7日15:33:06
 */
import {
	RQ
} from './request.js';
class DonwFiles extends RQ {
	constructor(...arg) {
		super(arg);
	}
	/**
	 * 下载文件
	 */
	startDownFiles({
		path = '',
		title = false,
		abort = (bt, finsh) => {},
		...extra
	} = {}) {
		return new Promise(async (resolve, reject) => {
			let obj = {
				tempFileInfo: [],
				FilePath: []
			};
			if (title) {
				uni.showLoading({
					title,
					mask: true,
				});
			}
			if(path.constructor===String){
				path = path.toString().split(',');
			}
			for (let i = 0; i < path.length; i++) {
				let url = path[i];
				try {
					let res = await this.downFiles({
						path: url,
						index:i,
						abort,
						...extra
					})
					obj.FilePath.push(res.tempFilePath)
					obj.tempFileInfo.push({
						url,
						filePath: res.tempFilePath
					});
				} catch (e) {
					//TODO handle the exception
				}
			}
			resolve(obj);
			if (title) {
				uni.hideLoading();
			}

		})
	}
}
export const DF = DonwFiles;
export const df = new DonwFiles();
