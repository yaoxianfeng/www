<template>
    <el-dialog title="选择发送对象" v-model="isaddobject" @close="close" @open="open" class="adobect">
        <div class="cs-searchBox" >
            <!-- <input type="text" v-model="keyword" placeholder="" autocomplete="off" class="el-input__inner cs-search_input" @keyup.enter="sousuo" :on-icon-click="sousuo" /><img v-on:click="sousuo" src="../../img/lookup.png" alt="搜索" /> -->
        </div>
        <el-table :data="gridData" border  highlight-current-row   @selection-change="handleSelectionChange">
        	<el-table-column  type="selection"></el-table-column>
		    <el-table-column prop="name" label="名称"></el-table-column>
		    <el-table-column prop="address" label="地址"></el-table-column>
		</el-table>
		<div class="cs-adjct-button">
			<el-button type="primary" @click="cancel()">关闭</el-button>
			<el-button type="primary" @click="Deter()">确定</el-button>
		</div>
  </el-dialog>
</template>

<script>
export default{
	props:{
		isaddobject:{
			type:Boolean,
			default:false
		},
		numflag:'',
		RowDataid:''
	},
	data(){
		return {
			keyword:'',
			gridData:[],
			multipleSelection:'',
			multipleSelectionID:'',
			editorOption: {
	              placeholder: "请输入内容",
	              modules: {
	                toolbar: [
	                  ['bold', 'italic', 'image','link'],
                      [{ 'list': 'bullet' }]
	                ]
	              }
	        }
		}
	},
	methods:{
		Deter(){   //确定
			this.$emit('addobject', {data:this.multipleSelection});
		},
		cancel(){  //取消
			this.isaddobject=false;
		},
		handleSelectionChange(val){
			console.log(val)
			this.multipleSelection = val;
		},
		close(){  //关闭弹框时
			var that=this;
			var Bus=global.eventHub;
			Bus.$emit("obec",this.isaddobject)
		},
		open(){//打开弹框时
			let token = global.data.getToken();
            if(!token) {
                return false;
            }
            let _deptid = (global.data.getUserInfo() && global.data.getUserInfo().dept) ? global.data.getUserInfo().dept.id: "";
            this.$http({
                method:'POST',
                url:global.config.weburl +"api/dept/findByParent.do",
                params:{token:token,parentId:_deptid}
            }).then(
                function(res){
                	this.gridData=res.data.data;
                }
            );
		}
	},
	created:function(){
	}
}
</script>

<style scoped>
.adobect{z-index: 5222!important;}
.cs-searchBox{margin-bottom: 15px;}
.cs-adjct-button{width: 100%; text-align: center;margin: 10px 0;}
</style>