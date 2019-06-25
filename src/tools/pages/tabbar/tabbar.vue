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
		onLoad() {
			const subNVue = (key) => {
				const subNVue = uni.getSubNVueById(key);
				subNVue.show();
			}
			subNVue('tabbar1');
			this.$draw({
				navigateTo(item, list, keys) {
					for (let i = 0; i < keys.length; i++) {
						const otherKey = keys[i];
						if (otherKey != item.key) {
							const subNVue = uni.getSubNVueById(otherKey);
							subNVue.hide();
						}
					}
					subNVue(item.key);
				},
			}).renderTabBar(this.$mp.page.$getAppWebview(), 'tabbar1');
		}
	}
</script>

<style lang="scss">
.h1{
	height: 300px;
}
</style>
