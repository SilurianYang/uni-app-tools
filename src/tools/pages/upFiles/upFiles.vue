<template>
	<view>
		<button type="primary" @click="testUp(2)">选择并上图片或视频</button>
		<!-- #ifdef APP-PLUS -->
		<button type="primary" @click="testUp(0)">选择并上图片</button>
		<button type="primary" @click="testUp(1)">选择并上视频</button>

		<button type="warn" @click="AppSelectFiles">app选择文件</button>

		<!-- #endif -->
		<button type="warn" @click="otherSelectFiles">H5选择文件</button>
		
		<button type="primary" @click="upnNetRes">上传网络文件</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			async otherSelectFiles(){
				const res = await this.$rup.otherSelectFiles({
					maximum: 3,
				})
				console.log(res);
			},
			async AppSelectFiles() {
				const res = await this.$rup.AppSelectFiles({
					type: 0,
					maximum: 3,
					multiple: true
				})
				console.log(res);
			},
			async testUp(type) {
				try {
					const res = await this.$rup.selectFiles({
						type,
						maximum: 2,
						sourceType:['camera'],
						upload: {
							path: 'example/upload',
							files: ['image'],
							title: '正在上传',
							abort: (info, bt) => {
								if (info.args.index == 0) {
									bt.abort();
								}
							},
							extra: {
								name: '我是你爸爸',
								ages: 21
							},
							username: 'hhyang'
						},

					})
					console.log(res)
				} catch (e) {
					console.log(e)
				}
			},
			/**
			 * 上传网络文件
			 */
			async upnNetRes() {
				this.$rup.defaultFile.upOpenDown = true;
				let res = await this.$rup.upnNetRes({
					netPath: [
						'https://img.alicdn.com/imgextra/i3/117331861/TB24K.sayMnBKNjSZFCXXX0KFXa_!!0-saturn_solar.jpg_180x180.jpg',
						'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=421118981,56990953&fm=27&gp=0.jpg'
					],
					upPath: 'example/upload',
					abort: (info, bt) => {
						// if(info.args.index==0){
						// 	bt.abort();
						// }
						// console.log(info)
					},
					files: ['image'],
					title: '正在上传',
					extra: {
						name: '我是你爸爸'
					},
					username: 'hhyang'
				})
				console.log(res)
			}
		},
	}
</script>

<style lang="scss">

</style>
