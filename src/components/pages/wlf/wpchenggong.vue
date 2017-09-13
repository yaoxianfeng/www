<template>
  <el-dialog title="提示" v-model="dialogVisible" size="tiny">
    <h3>警情已委派成功！</h3>
    <div><span>该提示将在3秒后自动关闭</span></div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style>
  h3{
    text-align: center;
    font-size: 16px;
  }
  div{
    text-align: center;
  }

</style>
<script>
  export default {
    data() {
      return {
        dialogVisible: true
      };
    }
  };
</script>