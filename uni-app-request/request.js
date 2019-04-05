/**
 * 2019年4月5日12:44:58
 * 简单封装uni-app请求，下载，上传。
 */
class Request {
	constructor(arg) {
		this.defaultReq = {
			isreq: true, //是否已经打开ajax，默认为true
			baseData: {}, //ajax基本参数
			url: '', //请求默认前面部分
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			type: 'GET',
			dataType: 'json',
			responseType: 'text',
			testFun: (_data, _status) => {
				return true
			}
		}
	}
	/**
	 * 基本ajax请求
	 */
	ajax({
		path = '', //请求路径
		title = false, //请求头部 默认为false不显示, 传入字符串则显示 推荐7个字内
		header = this.defaultReq.header, //请求header 默认为"application/x-www-form-urlencoded"
		data = {}, //请求数据，默认为空对象
		method = this.defaultReq.type, //请求类型 默认为'GET'
		dataType = this.defaultReq.dataType, //返回数据类型，默认为json。会对返回数据做一个JSON.parse
		responseType = this.defaultReq.responseType, //设置响应的数据类型默认为'text'
		finshFun = _f => {},
		abortFun = _bt => {}
	} = {}, ...extra) {
		return new Promise((resolve, reject) => {
			if (!this.defaultReq.isreq) {
				return reject('要想使用ajax，请开放isreq 设置为true');
			}
			if (title) { //显示请求提示
				uni.showLoading({
					title,
					mask: true,
				});
			}
			Object.assign(data, this.defaultReq.baseData); //合并参数
			if (typeof header === 'string') { //如果用户只想设置content-type
				header = {
					'content-type': header
				};
			}
			const requestTask = uni.request({
				url: this.defaultReq.url + path,
				method,
				dataType,
				responseType,
				data,
				header,
				success: ({
					statusCode = 0,
					..._res
				} = {}) => {
					let callData = Object.assign({
						extra
					}, _res);
					if (statusCode == 200) {
						let testRes = this.defaultReq.testFun(_res, statusCode) || true;
						if (testRes) {
							return resolve(callData);
						}
					}
					return reject(callData)
				},
				fail: err => {
					reject(Object.assign({
						extra
					}, err));
				},
				complete: finsh => {
					if (title) {
						uni.hideLoading();
					}
					finshFun(finsh);
				}
			});
			abortFun(requestTask);
		})
	}
}

export default new Request();
