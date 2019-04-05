<template>
	<view>
		<div class="box">
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad(option) {
			if(option.update=='true'){
				plus.navigator.closeSplashscreen();
				console.log('从更新页面过来的')
			}
		}
	}
</script>

<style lang="scss">
.box{
	background: url('~@/static/img/1.png') 0 0 no-repeat;
	width: 100%;
	height: 100vh;
	background-size: cover;
}
</style>
