<template>
    <div :class="[yulan_type?'el-dialog__wrapper csf_bszn_el-dialog__wrapper':'']">
    	<div class="bs-mainDiv" >
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
            is_yulan:'',
            confrom:'',
            yulan_type:false,
        },
		data() {
            return {
                time:new Date(),
                mainStyle:{},
                maintype:{},
                yuan:false
            }
        },
        methods: {
            close_yl(){
            	var Bus=global.eventHub;
		        Bus.$emit("close_yl");
            }
        },
        created() {
            if(this.is_yulan){
                this.yuan=true;
            }
            if(this.yulan_type){
                this.maintype={
                    position:"absolute",
                    top:"50%",
                    left:"50%"
                }
            }
        	if(this.confrom){
        		this.mainStyle={
        			position:"absolute",
        			top:"5%",
        			left:"30%"
        		}
        	}
        }
    }
</script>

<style lang="less" >
    .bs-mainDiv{
        a{
            color: #47acff;
        }
        z-index: 330;
        background: url('/static/img/shoujimoxing.png') no-repeat;
        background-size: 100% 100%;
        height: 580px;
        display: flex;
        justify-content: center;
        position: relative;
        padding-top:60px;
        .el-dialog__headerbtn{
            font-size: 10px;
            position: absolute;
            .el-dialog__close {
               color: #499edb; 
           }
            top: 10px;
            right: 25px;
            .el-dialog__close{color: #fff;font-size: 15px;margin-top:3px; }
            .el-dialog__close:hover{color: #275e8b;}
        }
        .f_main{
            width: 310px;
            height: 438px;

            overflow-y: auto;
            background: transparent;
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
            .f_content{
                width: 280px;
                overflow-x: auto;
                padding-top: 20px;
            }
            .f_content p{
                word-break: break-all;
            }
        }
    }
    .csf_bszn_el-dialog__wrapper{
        z-index: 10;
        background: rgba(0, 0, 0, 0.8);
        .bs-mainDiv{
            width: 360px;
            position:absolute;
            top:50%;
            left:50%;
            margin-left: -180px;
            margin-top: -290px;
            .el-dialog__headerbtn{
                right: 0px;
            }
        }
    }


   
</style>
