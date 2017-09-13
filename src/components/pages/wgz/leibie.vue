<template>
	<div>
	<div v-for="tag in dynamicTags">
		  <button type="button" class="el-button cs-tag el-button--primary" @click="tagclick(tag)">
		    <span>{{tag}}</span>
		  </button>
	</div>
	<el-input
	      class="input-new-tag"
	      v-if="inputVisible"
	      v-model="inputValue"
	      ref="saveTagInput"
	      size="large"
	      @keyup.enter.native="handleInputConfirm"
	      @blur="handleInputConfirm"
	    >
	</el-input>
	<el-button v-else class="button-new-tag" size="large" @click="showInput">+ New Button</el-button>
	<el-input
	      class="input-new-tag"
	      v-if="inputVisible2"
	      v-model="inputValue2"
	      ref="saveTagInput2"
	      size="large"
	      @keyup.enter.native="handleInputConfirm2"
	      @blur="handleInputConfirm2"
	    >
	</el-input>
	<el-button @click="bianji" size="large" v-if="bianjiif">编辑</el-button>

	</div>
</template>

<script>
	
	export default{
		methods:{
			bianji(){			//编辑
	              if(this.bianjiif){
	                this.bianjiif=false;
	              }
	              //console.log(this.bianjiif);
	            },
	        tagclick(tag){				//tag
	              this.tabnum=this.dynamicTags.indexOf(tag)
	              if(!this.bianjiif){		//修改类别名
	                this.inputVisible2=true;
	                this.inputValue2=tag;
	                this.$nextTick(_ => {
	                  this.$refs.saveTagInput2.$refs.input.focus();
	                });
	              }else{		//加载数据
	               // console.log(tag)
	              }
	              //console.log(this.bianjiif)
	            },
	        handleInputConfirm2(tag){		//修改类别名
	                let inputValue2 = this.inputValue2;
	                this.inputVisible2 = false;
	                this.inputValue2 = '';
	                this.bianjiif=true;
	                //console.log(inputValue2);
	                 this.dynamicTags.splice(this.tabnum, 1,inputValue2);
	                if(inputValue2.length<1){
	                  this.dynamicTags.splice(this.tabnum, 1);
	                }
	            },
	        handleInputConfirm() {     //删除分类
	              let inputValue = this.inputValue;
	              if (inputValue) {
	                this.dynamicTags.push(inputValue);
	              }
	              this.inputVisible = false;
	              this.inputValue = '';
	            },
	        handleClose(tag) {     //添加新分类
	              this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
	            },
	            showInput() {
	              this.inputVisible = true;
	              this.$nextTick(_ => {
	                this.$refs.saveTagInput.$refs.input.focus();
	              });
	            }
			},
			date:function(){
				return {
					dynamicTags: ['户籍业务', '居住业务', '企业业务','其他业务'],
			        inputVisible: false,
			        inputVisible2:false,
			        inputValue: '',
			        inputValue2:'',
			        bianjiif:true,
			        tabnum:null
				}
			},
			created:function(){

			}
        
	}
	

</script>