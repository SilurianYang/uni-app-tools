<template>
	<view class="content">
		<view>
			<button type="primary" @click="testplatform">获取当前运行环境</button>
			<button type="primary" @click="testReq">测试ajax</button>
			<button type="primary" @click="testUp">测试上传文件</button>
			<button type="primary" @click="testDown">测试下载文件</button>
			<button type="primary" @click="testProxy">通过代理设置数据</button>
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
		onLoad() {},
		methods: {
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
