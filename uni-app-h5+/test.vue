<template>
	<view>
		<button type="primary" @click="savePic">保存到本地</button>
	</view>
</template>

<script>
	import Expand from '@/common/expand.js';
	const exjs=new Expand();
	export default {
		data() {
			return {

			};
		},
		onLoad() {
			console.log(exjs.os.pf);
		},
		methods: {
			async savePic() {
				let {index=0} = await exjs.showActionSheet({
					buttons: [{
						title: '保存到本地',
						style: 'destructive'
					}]
				});
				if(index==1){
					try{
						await	exjs.saveImgToLocal({
							path:'http://img2.imgtn.bdimg.com/it/u=3557183367,2739413271&fm=11&gp=0.jpg'
						})
						uni.showToast({
							title:'保存成功',
							icon:"success"
						})
					}catch(e){
						uni.showToast({
							title:'保存失败',
							icon:"none"
						})
						console.log(JSON.stringify(e))
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
