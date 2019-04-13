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
			try {
				if (title) {
					uni.showLoading({
						title,
						mask: true,
					});
				}
				path = path.toString().split(',');
				for (let i = 0; i < path.length; i++) {
					let url = path[i];
					let res = await this.downFiles({
						url,
						abort,
						...extra
					})
					obj.FilePath.push(res.tempFilePath)
					obj.tempFileInfo.push({
						url,
						filePath: res.tempFilePath
					});
				}
				resolve(obj);
				if (title) {
					uni.hideLoading();
				}

			} catch (e) {
				throw e
			}
		})
	}
}
export const DF = DonwFiles;
export const df = new DonwFiles();
