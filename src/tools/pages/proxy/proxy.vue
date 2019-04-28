<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		async onLoad() {
			let res = await uni.request({
				url: 'create-qr64',
				method: "POST",
				header:{
					"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
				},
				data:{
					appid: 'otn',
					_json_att: ""
				}
			})
			console.log(res)
		}
	}
</script>

<style lang="scss">

</style>
