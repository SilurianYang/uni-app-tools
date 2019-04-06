let _defaultFile = {
	filesFilter: {
		0: 'image',
		1: 'video',
		2: 'none'
	}
}
import {
	RQ
} from './request.js';
class UpFiles extends RQ {
	constructor(...arg) {
		super(arg);
		this.defaultFile = _defaultFile;
		this.platform = this.platformChunk();
		this.FunChunk = {
			0: this.AppSelectFiles,
			1: this.otherSelectFiles
		};
		console.log(this.platform)
	}
	/**
	 * 2019年4月6日16:19:20
	 * 选择文件
	 */
	selectFiles({
		type = 2,
		maximum = 1,
		multiple = true,
		upload = {
			path:'',
			files:[],
			isUp:false
		},
		...extra
	} = {}) {
		return new Promise(async (resolve, reject) => {
			let merge = {
				type,
				maximum,
				multiple,
				...extra,
			}
			try{
			const res= await this.FunChunk[this.platform](merge);
			if(upload.isUp){		//需要上传到服务器，然后再返回
			uni.showLoading({
				title:'正在上传',
				mask: true,
			});
				for(let i=0;i<res.length;i++){
					if(upload.showProgress){
						title=`${(i+1)}/${res.length}`
					}
				let upres=await this.ajaxFile({
					path:upload.path,
					title:false,
					filePath:res[i],
					fileName:upload.files[i],
				});
				}
				uni.hideLoading();
				resolve({
					upload:true
				});
			}
			return resolve(res);
			}catch(e){
				uni.hideLoading();
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
	otherSelectFiles() {

	}
	/**
	 * 运行环境判断
	 */
	platformChunk() {
		if (typeof plus == 'undefined') {
			return 1;
		}
		return 0;
	}
	test() {
		console.log(666)
	}
}
export default new UpFiles();
