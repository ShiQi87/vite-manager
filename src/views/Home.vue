<template>
	<el-card>
		<div class="box">
			<img :src="userStore.avatar" alt="" class="avatar" />
			<div class="bottom">
				<h3 class="title">
					{{ getNowTime() }}好呀{{ userStore.username }}
				</h3>
				<p class="subtitle">电商后台管理平台</p>
			</div>
		</div>
	</el-card>
	<div class="bottoms"></div>
</template>

<script setup lang="ts">
import { getNowTime } from "@/utils/gettime";
//引入用户相关的仓库,获取当前用户的头像、昵称
import useUserStore from "@/store/module/user";
//获取存储用户信息的仓库对象
let userStore = useUserStore();
</script>

<style scoped lang="scss">
.box {
	display: flex;

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.bottom {
		margin-left: 20px;

		.title {
			font-size: 30px;
			font-weight: 900;
			margin-bottom: 30px;
		}

		.subtitle {
			font-style: italic;
			color: skyblue;
		}
	}
}
.bottoms {
	width: 100%;
	height: 80%;
	margin-top: 10px;
	display: flex;
	justify-content: center;
	background: linear-gradient(pink, skyblue);
}
</style>
