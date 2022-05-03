<template>
	<view class="content">
		<image class="logo" src="../../static/logo-1.png" mode="widthFix"></image>
		<view class="title">OFFICE企业在线办公系统</view>
		<view class="version">Version 1.1</view>
		<button class="login-btn" @click="login()">登录系统</button>
		<view class="register-container">
			<view>没有账号？</view>
			<navigator url="">立即注册</navigator>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		login() {
			const that = this;
			uni.login({
				provider: 'weixin',
				success: function(resp) {
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							that.$request(
								that.$urls.login,
								'POST',
								{
									code: resp.code
								},
								res => {
									uni.setStorageSync('permissions', res.data.permissions);
									uni.setStorageSync('token', res.data.token);
									console.log("跳转");
									uni.switchTab({
										url: '../index/index'
									});
								}
							);
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('./login.less');
</style>
