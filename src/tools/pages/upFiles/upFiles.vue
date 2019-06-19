<template>
	<view>
		<button type="primary" @click="testUp">选择并上传文件</button>
		<button type="primary" @click="upnNetRes">上传网络文件</button>
	</view>
</template>

<script>
	// import rup  from '@/common/request/request-upFiles.js';
	export default {
		data() {
			return {

			};
		},
		methods: {
			async testUp() {
				try {
					const res = await rup.selectFiles({
						type: 2,
						maximum: 3,
						upload: {
							path: 'example/upload',
							files: ['image'],
							title: '正在上传'
						}
					})
					console.log(JSON.stringify(res))
				} catch (e) {
					console.log(e)
				}
			},
			/**
			 * 上传网络文件
			 */
			async upnNetRes(){
				//rup.defaultFile.upOpenDown=true;
				// let res=	await rup.upnNetRes({
				// 		netPath:'https://img.alicdn.com/imgextra/i3/117331861/TB24K.sayMnBKNjSZFCXXX0KFXa_!!0-saturn_solar.jpg_180x180.jpg',
				// 		upPath:'example/upload',
				// 		files: ['image'],
				// 		title:'正在上传'
				// 	})
				// 	console.log(res)
			}
		},
	}
</script>

<style lang="scss">

</style>
