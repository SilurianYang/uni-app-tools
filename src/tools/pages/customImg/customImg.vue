<template>
	<view>
		<image :src="src" mode="" class="image"></image>
	</view>
</template>

<script>
	import Ctpic from '@/common/uni-app-customImg/custom-picture.js';
	const ctpic = new Ctpic();
	export default {
		data() {
			return {
				src: ''
			}
		},
		async onLoad() {
			try {
				let res = await ctpic.dataURLtoBlob({
					path: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=299253315,3157332866&fm=26&gp=0.jpg',
					isNet: true,
					filename: '程玉琪',
					GetBase64:true,
					compress:0.5,
				});
				this.src=res;
				console.log(res);
				return false;
				
				let file= await ctpic.h5_URLtoBlob({
					base64,
					filename:'这是转换回来的file对象',
					resolvePath:false
				})
				console.log(file);
				
				let filePath = '';

				// #ifdef APP-PLUS
				filePath = filePath.target
				// #endif

				// #ifndef APP-PLUS
				filePath = res;
				// #endif

				// uni.uploadFile({
				// 	url: 'http://192.168.0.29:1111/upload_images', //本地接口，换成自己的
				// 	filePath,
				// 	name: 'upload',
				// 	success: (uploadFileRes) => {
				// 		console.log(uploadFileRes.data);
				// 	}
				// });

			} catch (e) {
				console.log(e)
			}
		},
		methods: {}
	}
</script>

<style lang="scss">
.image{
	width: 100vw;
	height: 100vh
}
</style>
