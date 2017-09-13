<template>
<div class="cs_zdtxl">
	<el-row class="_name">
	    <el-col :span="10"><span>站点通讯录</span></el-col>
	    <el-col :span="10"><div class="_search"><input class="txt" type="text" /><i class="el-icon-search"></i></div></el-col>
	    <el-col :span="4"><i class="_close el-icon-close"></i></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
	<el-row class="_details">
	    <el-col :span="6" :offset="2">A民警</el-col>
	    <el-col :span="11" :offset="3"><div>联系电话：<span>13612121212</span></div></el-col>
	</el-row>
</div>
</template>
<style>
	.cs_zdtxl{
		position: fixed;
		top: 20%;
		width: 370px;
		height: 533px;
		border: 1px solid #ccc;
	}
	._name{
		background-color: rgba(242, 242, 242, 1);
		height: 51px;
	}
	._name span{
		color: #333;
		line-height: 51px;
		font-family: 'Arial';
		font-weight: 700;
		font-size: 20px;
		padding-left: 20px;
	}
	._search{
		line-height: 51px;
	}
	._search .txt{
		width: 130px;
		height: 30px;
		background: rgba(180, 180, 180, 1);
		border-radius: 15px!important;
		margin-right: 5px;
		padding: 0 15px;
		outline: none;
		border: none;
	}
	._search .el-icon-search{
		font-size: 18px;
	}
	._name .el-icon-close{
		font-weight: 600;
		font-size: 26px;
		line-height: 51px;
		margin-left: 20px;
	}
	._details{
		height: 60px;
		line-height: 60px;
		border-top: 1px solid #ccc;
		font-size: 14px;
	}
</style>