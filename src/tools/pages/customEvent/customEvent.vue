<template>
	<view>
		<button type="primary" size="mini" @click="customEvent">向首页触发一个弹框事件</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {

		},
		methods: {
			customEvent() {
				this.$event.notify('test','我传递给首页')
			}
		},
	}
</script>

<style lang="less">

</style>
