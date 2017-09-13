<template>
    <el-dialog title="位置信息" v-model="dialogPositionVisible"  :modal-append-to-body="false" @close="closeDialog">

        <div class="cs-map-position_box">
            <ha-amap :vid="'position-amap-vue'" :zoom="map_option.zoom" :center="map_option.center">
                <!-- 警情 -->
                <ha-amap-marker v-for="marker in marker_arr"  :key="this" :icon="marker.icon"  :position="marker.position"></ha-amap-marker>
            </ha-amap>
        </div>

    </el-dialog>
</template>
<script>

export default{

    props: {
        position_data: {}
    },

    data:function(){
        return {
            map_option : {
                zoom : 18,
                center:[]
            },
            dialogPositionVisible:false,
            location:{
                type:String,
                default:""
            },
            type :null,
            marker_arr : []
        }
    },
    methods: {
        createJQMap() {
            if (!this.location) {
                return;
            }
            var local=this.location.split(",");

            this.map_option.center = local;

            let marker_data = {position : local};
            switch (this.type) {
                case 1 :
                    marker_data["icon"] = "/static/img/icon/yjbj.png";
                    break;
                case 2 :
                    marker_data["icon"] = "/static/img/icon/ssj.png";
                    break;
                case 3 :
                    marker_data["icon"] = "/static/img/icon/ssp.png";
                    break;
                case 4 :
                    marker_data["icon"] = "/static/img/icon/jqbl.png";
                    break;
            }
            this.marker_arr[0] = marker_data;

        },
        initSmallMap () {
            this.createJQMap();
        },
        openDialog() {
            let that = this;
            that.location = this.position_data.location;
            that.type = this.position_data.type;
            that.dialogPositionVisible=true;
            that.initSmallMap();
        },
        closeDialog() {
            this.$emit('closePositionDialog');
        }
    },
    created:function(){

    },
    mounted:function() {
        this.openDialog();
    }
}

</script>
<style>
.cs-map-position_box{height: 400px;width: 100%;overflow: hidden;}
</style>

