<template>
	<el-dialog class="cs_imgdetail" title="证件照片" v-model="dialogTableVisible">
	  <img :src="imgsrc">
	</el-dialog>
</template>
<script>
export default{
  data:function(){
    return {
    	dialogTableVisible:false,
      imgsrc:"",
    }
  },
  created:function(){
  	  const that = this;
      const Bus = global.eventHub;
      Bus.$on("detailimg",function(msg){
          that.dialogTableVisible=true;
          that.imgsrc=msg;

      })

    }
}

</script>

<style>
    .cs_imgdetail img{
        width: 100%;
    }

</style>
