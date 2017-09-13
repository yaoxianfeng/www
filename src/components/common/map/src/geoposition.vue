<template>
    <div class="ha-dialogPop geoposition-page" >
        <div class="ha-dialog__wrapper" @click="closeDialog"></div>

        <div class="ha-dialog">
            <div class="ha-dialog__header">
                <span class="ha-dialog__title">位置信息</span>
                <div class="ha-dialog__headerbtn"><i class="ha-dialog__close el-icon el-icon-close" @click="closeDialog"></i></div>
            </div>
            <div class="ha-dialog__body geo_map_body" :style="mapStyle">
                <div id="geo_position_map" :style="dbmapStyle"></div>
            </div>

            <div class="ha-dialog__footer" >
                <div class="ha-dialog__footer__btngroup">
                    <el-button type="ha_btn" @click="getPosition">确 定</el-button>
                </div>
            </div>
        </div>

    </div>

<!--    <el-dialog title="位置信息" v-model="dialogPositionVisible"  :modal-append-to-body="false" size="large">
        <div id="geo_position_map" :style="mapStyle"></div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="getPosition">确 定</el-button>
        </span>
    </el-dialog>-->

</template>

<script>
import mymap from '../map';

//用于获取地理位置
export default {
    name: 'geoposition',
    mixins: [mymap],
    props: {
        mypoint: {}
    },
    data() {
        return {
            map_id: "geo_position_map"

        };
    },
    watch: {

    },
    computed: {
        mapStyle() {
            let _height = this.$store.getters.getPageInfos.main_height;
            return {
                height: 600 + "px",
                width:"100%"
            }
        },
        dbmapStyle() {
            let _height = this.$store.getters.getPageInfos.main_height;
            return {
                height: 640 + "px",
                width:"100%"
            }
        }
    },
    methods: {

        createMap() {
            if (!this.map_id) {
                return;
            }
            //let BMap = this.$BMap;
            let map = new BMap.Map(this.map_id, {enableMapClick:false});

            this.map = map;     //设置map

            if (!!this.mypoint && !!this.mypoint.x && !!this.mypoint.y) {//如何用户已设置位置
                this.current_point  = this.mypoint;
                this.addEnableDraggingMarker(this.mypoint.x, this.mypoint.y, this.mypoint.address);
            }

            map.addEventListener("click", (e)=>{

                this.addPointDraggingEvent(e);
            });

            this.initUserDeptPolygon();     //初始化用户所在围栏

        },
        addPolygon() {
            //创建栅栏
            let that = this;
            //let BMap = that.$BMap;
            //that.map.centerAndZoom(new BMap.Point(this._point_x, this._point_y), MY_MAP_SIZE);

            let mapTypes = [BMAP_NORMAL_MAP];
            if (that.is_need_HYBRID_MAP) {
                mapTypes = [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP];
            }

            var mapType = new BMap.MapTypeControl({
                mapTypes
            });

            that.map.addControl(mapType);
            that.map.enableScrollWheelZoom();// 允许滚轮缩放
            that.map.addControl(new BMap.NavigationControl());
            //console.log(that.polygon_arr);
            that.map.setViewport(that.polygon_arr);
        },


        addEnableDraggingMarker(x, y, address) {//添加可移动覆盖点
            let that = this;
            //let BMap = that.$BMap;


            if (that.dragging_marker) {
                that.map.removeOverlay(that.dragging_marker);

                //如果已存在拖动点
                that.dragging_marker.setPosition(new BMap.Point(x,y));
                that.dragging_label.setContent(address);

                let label = new BMap.Label(address, {offset:new BMap.Size(20, -30)});
                label.setStyle({color : "#333", fontSize : "14px", padding: "5px 15px", borderColor: "#ccc" });
                that.dragging_marker.setLabel(label);
                that.map.addOverlay(that.dragging_marker);
            } else {
                let point = new BMap.Point(x, y);

                //let dragging_marker = new BMap.Marker(new BMap.Point(x, y), {icon: new BMap.Icon("/static/img/icon/jqbl.png", new BMap.Size(24,30))});
                let dragging_marker = new BMap.Marker(new BMap.Point(x, y));





                that.map.addOverlay(dragging_marker);
                dragging_marker.enableDragging();

                that.dragging_marker = dragging_marker;

                let label = new BMap.Label(address, {offset:new BMap.Size(20, -30)});
                label.setStyle({color : "#333", fontSize : "14px", padding: "5px 15px", borderColor: "#ccc" });
                that.dragging_marker.setLabel(label);
                that.dragging_label = label;
            }
        },
        addPointDraggingEvent (e) {//添加可移动覆盖点事件
            let x = e.point.lng, y = e.point.lat;
            let that = this;
            that.current_point = {
                x:x,
                y:y
            };
            that.getAddress(x, y, function(arr){
                let address = arr.formatted_address;
                that.addEnableDraggingMarker(x, y, address);
                that.current_point.address = address;
            });
        },
        closeDialog() {
          this.$emit("close");
        },

//        openDialog(data) {
//            this.point = data;
//            this.dialogPositionVisible = true;
//            const {getMapScript,initMap} = this;
//            getMapScript().then(initMap);
//        },
        getPosition() {
            this.dialogPositionVisible = false;
            //获取位置
            this.$emit("getCurrentPoint", this.current_point);
        }

    },
    created:function(){
//        const that = this;
//        const Bus = global.eventHub;
//        Bus.$on('doto_show_geo_position',function(data){
//            that.openDialog(data);
//        });

    },
    mounted: function() {
        const {getMapScript,initMap} = this;
        getMapScript().then(initMap);
    }
};

</script>

<style scoped="scoped">
.geo_map_body{
    overflow: hidden;
    padding-top:20px;
}
</style>