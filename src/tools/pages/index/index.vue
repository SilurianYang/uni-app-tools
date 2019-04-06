<template>
	<view class="content">
		<view>
			<button type="primary" @click="testReq">测试ajax</button>
			<button type="primary" @click="testUp">测试上传文件</button>
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
			this.$ToolsUp.test();
		},
		methods: {
		async	testUp() {
			const res=await	this.$ToolsUp.selectFiles({
					type:0,
					maximum:3,
// 					upload:{
// 						path:'example/upload',
// 						files:['image','image','image'],
// 						isUp:true
// 					}
				})
				console.log(JSON.stringify(res))


			},
			async testReq() {
				try {
					const res = await this.$req.ajax({
						path: "example/query",
						title: "正在加载",
						data: {
							token: '000-000-000-000-player125',
							tpName: 'TP427613'
						},
						abortFun: bt => {},
						finshFun: finsh => {}
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
