<template>
	<view>
		<image :src="src" mode=""></image>
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
				});
				let filePath = '';

				// #ifdef APP-PLUS
				filePath = filePath.target
				// #endif

				// #ifndef APP-PLUS
				filePath = res;
				// #endif

				uni.uploadFile({
					url: 'http://192.168.0.29:1111/upload_images',
					filePath,
					name: 'upload',
					success: (uploadFileRes) => {
						console.log(uploadFileRes.data);
					}
				});

			} catch (e) {
				console.log(e)
			}
		},
		methods: {}
	}
</script>

<style>

</style>
