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
	 * 内部下载文件，仅内部调用
	 */
	_downFiles(extra) {
		return new Promise((resolve, reject) => {
			const downloadTask = uni.downloadFile({
				...extra,
				complete: ({
					statusCode = 0,
					...finsh
				} = {}) => {
					extra.abort(downloadTask, Object.assign({}, {
						statusCode,
						...finsh
					}));
					if (statusCode === 200) {
						return resolve(finsh);
					}
					return reject(finsh)
				},
			})
			extra.abort(downloadTask);
		})
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
				tempFileInfo:[],
				FilePath:[]
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
					let res = await this._downFiles({
						url,
						abort,
						...extra
					})
					obj.FilePath.push(res.tempFilePath)
					obj.tempFileInfo.push({
						url,
						filePath:res.tempFilePath
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
