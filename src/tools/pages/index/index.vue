<template>
	<view class="content">
		<view>
			<button type="primary" @click="testReq">测试ajax</button>
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
		onLoad() {

		},
		methods: {
			async testReq() {
				try {
					const res = await this.$req.ajax({
						path: "example/query",
						title:"正在加载",
						data: {
							token: '000-000-000-000-player125',
							tpName: 'TP427613'
						},
						abortFun: bt => {
						},
						finshFun: finsh => {
						}
					}, {
						name: 66,
						age: 99
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
