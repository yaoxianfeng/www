<template>
	<div class="mainDiv " :style="mainStyle">
		<div class="el-dialog__headerbtn" @click="close_yl"><i class="el-dialog__close el-icon-close"></i></div>
		<div class="f_main">
			<h3>{{content.title}}</h3>
			<div class="f_from">
				<span>{{content.name}}</span>
				<span>{{time | moment}}</span>
			</div>
			<div class="f_content" v-html="content.massage">
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        props: {
            content:{
            	type:Object,
            	default:function(){
            		return {}
            	}
            },
            confrom:''
        },
		data() {
            return {
                time:new Date(),
                mainStyle:{}
            }
        },
        methods: {
            close_yl(){
            	var Bus=global.eventHub;
		        Bus.$emit("close_yl");
            }
        },
        created() {
        	if(this.confrom){
        		this.mainStyle={
        			position:"absolute",
        			top:"5%",
        			left:"30%"
        		}
        	}else{
        			this.mainStyle={}
        		}
        }
    }
</script>

<style lang="less" scoped="scoped">
    .mainDiv{
        z-index: 300;
        background: url('/static/img/shoujimoxing.png') no-repeat;
        background-size: 100% 100%;
        width: 350px;
        height: 530px;
        display: flex;
        justify-content: center;
        position: relative;
        padding-top:30px;
        .el-dialog__headerbtn{
            position: absolute;
            top: 5px;
            right: 25px;
        }
        .f_main{
            width: 310px;
            height: 438px;
            overflow-y: scroll;
            background: #fff;
            padding: 0 15px;
            h3{
                font-size: 18px;
                font-weight: normal;
                padding: 20px 0 0;
                width: 100%;
                text-align: center;
                word-break: break-all;
                box-sizing:border-box;
            }
            .f_from{
                height: 35px;
                line-height: 35px;
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                border-bottom: 1px solid #cfcfcf;
                span{
                    color: #c1c1c1;
                    font-size: 8px;
                }
            }
        }

    }

    .mainDiv .f_content P{
        font-size: 14px;
        color: #555555;
        padding: 10px 0;
        line-height:24px ;
        
        box-sizing:border-box;
        word-break: break-all;

    }
    .mainDiv .f_content p img{
        width: 100%;
    }
    .f_content{
        word-break: break-all;
    }


</style>
