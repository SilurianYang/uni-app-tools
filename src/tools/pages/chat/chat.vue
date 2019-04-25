<template>
	<view>
		<view class="cu-chat">
			<div class="prop" v-if="propHide">
				<div class="box">
					<input type="text" v-model="selfName" placeholder="请输入用户名" class="userIput" />
					<button type="primary" @click="suerName">确定</button>
				</div>
			</div>
			<scroll-view :scroll-y="true" class="scroll-y" :scroll-top="scrollTop" :scroll-with-animation="true">
				<div class="chatBox">
					<view class="cu-item" v-for="(item,index) in chartPage" :key="index" :class="{'self':item.msg.selfName==selfName}">
						<view class="main" v-if="item.msg.selfName==selfName">
							<view class="content bg-green shadow">
								<text>{{item.msg.text}}</text>
							</view>
						</view>
						<view class="cu-avatar radius" v-if="item.msg.selfName!=selfName" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>

						<view class="main" v-if="item.msg.selfName!=selfName">
							<view class="content shadow">
								<text>{{item.msg.text}}</text>
							</view>
						</view>

						<view class="cu-avatar radius" v-if="item.msg.selfName==selfName" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
						<view class="date">{{item.msg.selfName}}</view>
					</view>
				</div>
			</scroll-view>


		</view>

		<view class="cu-bar foot input" id="foot" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus"
			 @blur="InputBlur" v-model="userMsg"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="sendMsg" v-if="isIos">发送</button>
			<button class="cu-btn bg-green shadow" @touchend.stop="sendMsg" v-else="">发送</button>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';

	let scrennH = 0;
	let androidH = 0;
	let androidOff = 0;
	export default {
		data() {
			return {
				isIos: true, //ios 使用点击事件
				scrollTop: 0,
				InputBottom: 0,
				selfName: '',
				userMsg: '',
				propHide: true,
				chartPage: [],
			};
		},
		computed: {
			...mapState(['SocketState'])
		},
		onLoad() {
			// #ifdef APP-PLUS
			if (plus.device.vendor !== 'Apple') {
				this.isIos = false;
			}
			// #endif
			setTimeout(() => {
				let crSelect=uni.createSelectorQuery();
				crSelect.select('.scroll-y').boundingClientRect(res => {
					scrennH = res.height;
				}).exec()
			}, 300)
			uni.setNavigationBarTitle({
				title: `聊天室`
			});
			uni.onWindowResize((res) => {
				androidH = res.size.windowHeight;
				if (scrennH < androidH) {
					androidOff = androidH - scrennH;
				}
				this.isScrollBottom();
			})
		},
		watch: {
			'SocketState.chartPage': function(val) {
				this.chartPage = val;
				this.isScrollBottom();
			}
		},
		methods: {
			sendMsg() {
				if (this.userMsg == '') {
					return false;
				}
				let msg = {
					type: 'self',
					selfName: this.selfName,
					text: this.userMsg,
					time: new Date().toLocaleTimeString()
				};
				this.$Socket.nsend(JSON.stringify(msg));
				this.userMsg = '';
			},
			isScrollBottom() {
				setTimeout(() => {
					uni.createSelectorQuery().select('.chatBox').boundingClientRect(res => {
						if (this.isIos) {
							if (scrennH < res.height) {
								this.scrollTop = res.height - scrennH
							}
						} else {
							if (androidH < res.height) {
								this.scrollTop = res.height - androidH + androidOff
							}
						}
					}).exec()
				}, 100)
			},
			suerName() {
				if (this.selfName !== '') {
					this.propHide = false
				}
			},
			InputFocus(e) {
				// #ifndef APP-PLUS
				this.InputBottom = e.detail.height;
				// #endif
			},
			InputBlur(e) {
				this.InputBottom = 0;
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/colorui/icon.css";
	@import "../../common/colorui/main.css";

	page {
		padding-bottom: 100upx;
	}

	.scroll-y {
		/* #ifdef H5 */
		height: calc(100vh - 55px - 100upx);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 100upx);
		/* #endif */
	}

	.prop {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
		background-color: rgba(0, 0, 0, 0.2);

		.box {
			width: 80%;
			height: 300upx;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -40%;
			margin-top: -150upx;
			background-color: #fff;

			.userIput {
				margin: 60upx 0;
				text-align: center;
			}
		}
	}
</style>
