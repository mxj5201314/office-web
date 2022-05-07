<template>
	<view class="message">
		<view class="header">
			<view class="desc">{{ sendTime }}</view>
			<view class="opt" @tap="deleteMsg">删除</view>
		</view>
		<view class="content">{{ msg }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			readFlag: null,
			refId: null,
			sendTime: '',
			msg: ''
		};
	},
	onShow() {
		let that = this;
		uni.setNavigationBarTitle({
			title: '系统通知'
		});
		that.$request(that.$urls.getMessageById, 'POST', { id: that.id }, resp => {
			let result = resp.data;
			that.sendTime = result.sendTime;
			that.msg = result.msg;
		});
	},
	onLoad(options) {
		let that = this;
		that.id = options.id;
		that.readFlag = options.readFlag == 'true' ? true : false;
		that.refId = options.refId;
		if (!that.readFlag) {
			that.$request(that.$urls.updateUnreadMessage, 'POST', { id: that.refId }, resp=> {
				console.log('消息更新成已读状态');
			});
		}
	},
	methods: {
		deleteMsg() {
			let that = this;
			uni.showModal({
				title: '提示信息',
				content: '是否要删除这条消息？',
				success: function(resp) {
					if (resp.confirm) {
						that.$request(that.$urls.deleteMessageRefById, 'POST', { id: that.refId }, resp=> {
							uni.showToast({
								icon: 'success',
								title: '删除成功',
								complete: function() {
									setTimeout(function() {
										uni.navigateBack({
											delta: 1
										});
									}, 1000);
								}
							});
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('message.less');
</style>
