<template>
	<view>
		<view class="cu-chat">
			<div class="prop" v-if="propHide">
				<div class="box">
					<input type="text" v-model="selfName" placeholder="请输入用户名" class="userIput" />
					<button type="primary" @click="suerName">确定</button>
				</div>
			</div>

			<view class="cu-item" v-for="(item,index) in SocketState.chartPage" :key="index" :class="{'self':item.msg.selfName==selfName}">
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


		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus"
			 @blur="InputBlur" v-model="userMsg"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="sendMsg">发送</button>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				InputBottom: 0,
				selfName: '',
				userMsg: '',
				propHide: true
			};
		},
		computed: {
			...mapState(['SocketState'])
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: `聊天室`
			});
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
			suerName() {
				if (this.selfName !== '') {
					this.propHide = false
				}
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
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
