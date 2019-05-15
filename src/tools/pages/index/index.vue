<template>
	<view class="content">
		<view>
			<button type="primary" @click="testplatform">获取当前运行环境</button>
			<button type="primary" @click="testReq">测试ajax</button>
			<button type="primary" @click="testUp">测试上传文件</button>
			<button type="primary" @click="testDown">测试下载文件</button>
			<button type="primary" @click="testProxy">通过代理设置数据</button>
			<button type="primary" @click="gotoPage('../customImg/customImg')">自定义图片格式</button>
			<button type="warn" @click="gotoPage('../chat/chat')">聊天测试</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad() {

			const users = [{
					id: 11,
					name: 'Adam',
					age: 23,
					group: 'editor',
					a: {
						id: 11,
						name: 'Adam',
						age: 23,
						group: null
					},
					b:{
						id: 0,
						name: undefined,
						age: null,
					}
				},
				{
					id: 47,
					name: 'John',
					age: 28,
					group: 'admin'
				},
				{
					id: 85,
					name: 'William',
					age: 34,
					group: 'editor'
				},
				{
					id: 97,
					name: 'Oliver',
					age: 28,
					group: 'admin'
				}
			];
			console.log(users);
			setTimeout(()=>{
			console.log(this.filterEmpty(users, '我是你爸爸'))	
			},5000)



			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen();
			// #endif
		},
		methods: {
			/**
			 * @param {Object} res	需要过滤的对象数据
			 * @param {Object} reStr	空数据自动替换
			 */
			filterEmpty(res, reStr) {
				if (typeof res != "object") {
					return res;
				}
				for (let key in res) {
					if (!res[key] && res[key] != 0) {
						res[key] = reStr;
					} else {
						this.filterEmpty(res[key], reStr);
					}
				}
				return res
			},
			
			gotoPage(url) {
				uni.navigateTo({
					url
				});
			},
			testProxy() {
				let proxyData = {
					name: 'hhyang',
					age: 21
				}
				this.$req.proxy(proxyData, (key, val, oldval) => {
					console.log(`${key}:从${oldval}变成了${val}`);
				})
				console.log(proxyData)
				setTimeout(() => {
					proxyData.age = 22;
				}, 2000)
			},
			testplatform() {
				let type = this.$req.platformChunk();
				console.log(type);
			},
			async testDown() {
				const res = await this.$req.downFiles({
					path: 'http://localhost:10086/static/hhyang.txt',
					abort: (bt) => {
						bt.onProgressUpdate(ps => {
							console.log('下载进度' + ps.progress);
							console.log('已经下载的数据长度' + ps.totalBytesWritten);
							console.log('预期需要下载的数据总长度' + ps.totalBytesExpectedToWrite);
						})
					}
				})
				console.log(res)
			},
			async testUp() {
				try {
					const res = await this.$ToolsUp.selectFiles({
						type: 2,
						maximum: 3,
						upload: {
							path: 'example/upload',
							files: ['image', 'image', 'image'],
							title: '正在上传'
						}
					})
					console.log(JSON.stringify(res))
				} catch (e) {
					console.log(e)
				}


			},
			async testReq() {
				try {
					const res = await this.$req.ajax({
						path: "example/query",
						title: "正在加载",
						data: {
							name: 'hhyang'
						},
						abortFun: bt => {
							//bt.abort();
						},
					}, {
						parmas1: '我是额外参数1',
						parmas2: '我是额外参数2'
					})
				} catch (e) {
					console.log(e)
				}
			}
		}
	}
</script>

<style>
</style>
