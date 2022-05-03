<template>
	<view class="content">
		<image src="../../static/logo-2.png" mode="widthFix" class="logo"></image>
		<view class="register-container">
			<input placeholder="输入你的邀请码" class="register-input" type="text" v-model="inviteCode" maxlength="6" />
			<view class="register-desc">管理员创建员工证账号之后，你可以从你的个人邮箱中获得注 册邀请码</view>
			<button class="register-btn" @click="register()">执行注册</button>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			inviteCode: ''
		};
	},
	methods: {
		register() {
			const that = this;
			if (!that.inviteCode) {
				uni.showToast({
					icon: 'none',
					title: '请输入邀请码'
				});
				return;
			}
			if (!/^[0-9]{6}$/.test(that.inviteCode)) {
				uni.showToast({
					title: '邀请码必须是6位数字',
					icon: 'none'
				});
				return;
			}

			uni.login({
				provider: 'weixin',
				success: function(resp) {
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							let data = {
								nickname: infoRes.userInfo.nickName,
								photo: infoRes.userInfo.avatarUrl,
								registerCode: that.inviteCode,
								code: resp.code
							};
							that.$request(that.$urls.register, 'POST', data, res => {
								let permission = res.data.permissions;
								uni.setStorageSync('permissions', permission);
								uni.switchTab({
									url: '../index/index'
								});
							});
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('./register.less');
</style>
