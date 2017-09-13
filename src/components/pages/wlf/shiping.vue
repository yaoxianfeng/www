<template>
	<el-dialog title="视频" ref="shiping" v-model="dialogTableVisible" :modal-append-to-body="false" @close="handleclose">
	  <video-player ref="videoPlayer" style="font-size: 5px;padding-top: 20px;height: 360px;" :options="videoOptions" ></video-player>
	</el-dialog>
</template>
<script>
import { videoPlayer } from 'vue-video-player';
export default{
  props:{
    videodata:[String,Object]
  },
  data:function(){
    return {
    	dialogTableVisible:true,
    	videoOptions: {}
    }
  },
  components: {
       videoPlayer
  },
  methods:{
    handleclose(){
      this.$parent.is_shiping=false;
    }
  },
  created:function(){
  	  const that = this;
  		that.videoOptions={
			    source: {
			      type: "video/mp4",
			      src:this.videodata
            // "http://www.laikabase.de/videos/Shift.mp4"
			    },
			    muted: false,
			    controls:true,
			    live: true,
			    autoplay: false,
			    height: 300
			}
    },
    mounted(){

    }
}

</script>
<style>
.cs-my-video-player{z-index: 2500}
</style>
