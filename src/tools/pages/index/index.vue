<template>
	<view class="content">
		<view>
			<button type="primary" @click="testplatform">获取当前运行环境</button>
			<button type="primary" @click="testReq">测试ajax</button>
			<button type="primary" @click="gotoPage('../upFiles/upFiles')">去上传文件页面</button>
			<button type="primary" @click="testDown">测试下载文件</button>
			<button type="primary" @click="testProxy">通过代理设置数据</button>
			<button type="primary" @click="gotoPage('../customImg/customImg')">自定义图片格式</button>
			<button type="primary" @click="gotoPage('../customEvent/customEvent')">自定义事件</button>
			<button type="warn" @click="gotoPage('../chat/chat')">聊天测试</button>
			
			<!-- #ifdef APP-PLUS -->
			<button type="warn" @click="gotoPage('../tabbar/tabbar')">自定义原生tabbar</button>
			<!-- #endif -->
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
			this.$event.on('test', (title) => {
				uni.showToast({
					title,
				})
			})
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
			gotoPageTest(url){
				//this.$Router.replaceAll({name:'router1',params:{id:666}});
				//this.$Router.push({name:'router1'});
				//this.$Router.push({path:'/pages/router/router1/router1',query:{id:9999}});
				//this.$Router.push('/pages/router/router1/router1');
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
				const res = await this.$req.startDownFiles({
					// path: 'http://localhost:10086/static/hhyang.txt',
					path: 'http://192.168.0.29:10086/static/hhyang.txt,http://192.168.0.29:10086/static/cxq.jpg',
					//path: ['http://192.168.0.29:10086/static/hhyang.txt', 'http://192.168.0.29:10086/static/cxq.jpg'],
					title: '正在下载',
					abort: (bt, params) => {
						if (params.index == 0) {
							bt.abort();
						}
						bt.onProgressUpdate(ps => {
							console.log('下载进度' + ps.progress);
							console.log('已经下载的数据长度' + ps.totalBytesWritten);
							console.log('预期需要下载的数据总长度' + ps.totalBytesExpectedToWrite);
						})
					},

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
						abortFun: (info, bt) => {
							//bt.abort();
						},
						finishFun:(info)=>{
							console.log(info)
						}
					}, {
						parmas1: '我是额外参数1',
						parmas2: '我是额外参数2'
					})
					console.log(res)
				} catch (e) {
					console.error(e)
				}
			}
		}
	}
</script>

<style>
</style>
