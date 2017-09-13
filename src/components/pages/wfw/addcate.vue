<template>
     <!-- <el-dialog title="办事指类别" v-model="addcate" @close="close" > -->
     <el-dialog title="提示" v-model="isaddcate" @close="close">
        <div class="catename">
            <div class="cates">
                <i>类别名称：</i>
                <input type="text" maxlength='7' class="" v-model="catename">
            </div>
            <div class="cates ">
                <i>选择图标：</i>
                <div class="icons" :style="dialogMainStyle">
                    <img src="#" ><img src="#" ><img src="#" >
                    <img src="#" ><img src="#" ><img src="#" >
                    <img src="#" ><img src="#" ><img src="#" >
                    <img src="#" ><img src="#" ><img src="#" >
                </div>
            </div>
            <div class="cates" >
                <el-button @click="cancelcate">取消</el-button>
                <el-button @click="savecate">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
	export default{
		props:{
			caterow:'',
			isaddcate:''
		},
		data:function(){
			return{

			}
		},
		methods:{
			close() { //关闭弹窗
	            this.$emit('cancelcate');
	        },
	        cancelcate(){
	        	this.$emit('cancelcate')
	        },
	        savecate() {  //保存
	          this.$emit('savecate',caterow)
	        },
		},
		created:{
			console.log(this.isaddcate)
		}
		
	}
</script>

