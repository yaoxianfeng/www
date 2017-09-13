<template>
	<div class="evidence_print" >
		<el-button @click="close" class="noprint"><span>返回</span></el-button>
		<el-button @click="print" class="noprint"><span>打印预览</span></el-button>
		<div  @click="print" title="左键点击打开打印预览">
			<div class="stub">
				<p class="topdata"><b><span>{{this.year}}</span>年<span>{{this.month}}</span>月<span>{{this.day}}</span>日</b> </p>
				<p ><h2>无犯罪记录证明（存根）</h2></p>
				<i>N<i>o</i>：</i>
				<p class="topm">要求出具证明的单位：<span>{{_index.unitName}}</span></p>
				<p>证明的用途：<span>{{_index.target}}</span></p>
				<p class="indent">经查,截止<span>{{this.year}}</span>年<span>{{this.month}}</span>月<span>{{this.day}}</span>日，未发现居民<span>{{_index.name}}</span>(公民身份证号码：<span>{{_index.idcardNo}}</span>)有犯罪记录。</p>
				<p>申请人姓名<span>{{_index.name}}</span>，公民身份证号码<span>{{_index.idcardNo}}</span></p>
				<p>联系电话：<span>{{_index.userPhone}}</span></p>
				<p>承办民警：<span>{{_index.policeName}}</span></p>
				<p class="topdata butdata"><b><span>{{this.year}}</span>年<span>{{this.month}}</span>月<span>{{this.day}}</span>日</b> </p>
			</div>
			<div class="xuxian">——————————————————————————————————————————————————————————————————————</div>
			<div class="nostub">
				<h2>无犯罪记录证明</h2>
				<i>N<i>o</i>：</i>
				<p class="topm"><span>{{_index.unitName}}：</span></p>
				<p class="indent">经核查，截止<span>{{this.year}}</span>年<span>{{this.month}}</span>月<span>{{this.day}}</span>日，未发现居民<span>{{_index.name}}</span>(公民身份证号码：<span>{{_index.idcardNo}}</span>)有犯罪记录。</p>
				<p class="indent">特此证明</p>
				<p class="indent">承办民警：<span>{{_index.policeName}}</span><span></span>联系电话：<span>{{_index.policePhone}}</span></p>
				<p class="indent">此证明仅限持有人办理<span>{{_index.target}}</span>使用，有效期40日。</p>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			_index:'',
			year:'',
			month:'',
			day:''
		}
	},
	created() {
        this. _index = sessionStorage.getItem("printData");
        this. _index = JSON.parse(this._index)
        let strs=this._index.auditTimeStr.split(" ");
        strs=strs[0].split("-");
        this.year=strs[0];
        this.month=strs[1];
        this.day=strs[2];
        this.print();
    },
    methods:{
    	close(){  //关闭窗口
    		window.close();
    	},
    	print(){  //打印
    		window.print();
    	}
    }
}
</script>
<style lang="less">
	.evidence_print{

		width: 80%;
		font-size: 18px;
		color: #000;
		background: #fff;
		margin: 0px auto;
		font-family: STFangsong;
		cursor:pointer;
		letter-spacing:4px;
		overflow:hidden;

		@media print {
			.noprint { display: none;color:green }
		}

		span{
			display:inline-block;
			min-width: 20px;
			text-decoration:underline;
		}
		hr{border-bottom: 1px dotted #000;}
		/* b{float: right; display: block;font-weight:100;} */
		h2{margin: 0px auto; text-align: center;font-weight:100;letter-spacing:0px;}
		p{
			line-height: 28px;
		}
		.indent{
			text-indent:2.5em; padding:0px; margin:0px;
		span{
			text-indent:0em; padding:0px; margin:0px;
		}
		}

		h2{
			margin-top: 40px;
		}

		.butdata{margin-bottom: 40px;}
		.topdata{
			height: 1px;
			margin-top: 20px;
		b{
			float: right;font-weight: 100;
		}
		}

		i{
			letter-spacing:0px;
			font-style:normal;margin-left:65%;
		i{
			text-decoration:underline;margin: 0;
		}
		}
		.topm{margin-top:15px;}
		.xuxian{
			display: block;
			white-space:nowrap;
			width:100%;
			height:2px;
		}

	}

</style>
