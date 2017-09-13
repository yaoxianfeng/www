<template>

    <ha-dialog title="位置信息" size="small" @close="closeDialog" class="geo-amap-page" :style="bjsqtop">
        <i class="cs-geo-position-backInitMap" @click="backinitposition"></i>
        <div class="geo_map_body" :style="mapStyle">
            <ha-amap :vid="'geo-amap-position-ovid'" :map-manager="amapManager" :zoom="map_option.zoom" :events="map_events" :center="position_center">

                <ha-amap-marker v-if="current_point" :vid="'geo-amap-position-marker'" :position="current_point" >

                </ha-amap-marker>

                <!--<ha-amap-position-picker :position="current_point" @getPositionResultSuc="getPositionResultSuc" @getPositionResultFail="getPositionResultFail"></ha-amap-position-picker>-->
            </ha-amap>
        </div>

        <div slot="footer">
            <div class="ha-dialog__footer__btngroup">
                <el-button type="ha_btn" @click="getPosition">确 定</el-button>
            </div>
        </div>
    </ha-dialog>

</template>
<script>
import { AMapManager } from '../../../common/amap';
import mystyle from '../../../../util/vue/style';
let amapManager = new AMapManager();

export default {
    name: 'geo_amap_position',
    mixins: [mystyle],
    props: {
        mypoint: {}
    },
    data() {
        return {
            amapManager: amapManager,
            map_option : {
                zoom : 20
            },
            positionResult : Object,
            current_point: null,
            init_point : [],
            position_center:[],
            map_events:{
                click : (event) => {
                    if (event && event.lnglat) {
                        this.current_point = [event.lnglat.lng, event.lnglat.lat];
                    }
                }
            }
        };
    },


    computed: {
        mapStyle() {
            let _height = this.$store.getters.getPageInfos.content_height*1-78 - this.$store.getters.getPageInfos.top_bar_height;
            return {
                height: _height + "px",
                width:"100%"
            }
        },
        bjsqtop(){
            return {
                top:this.$store.getters.getPageInfos.top_bar_height+'px',
                width:"50%"
            }
        }
    },

    methods: {
        closeDialog() {
            this.$emit('close');
        },
        getPositionResultSuc(positionResult) {
            this.positionResult = positionResult;
        },
        getPositionResultFail(positionResult) {
            this.$message({
                type: 'error',
                message: "获取位置信息失败"
            });
        },
        getPosition () {
//            console.log("getPosition : ")
//            console.log(this.positionResult);
//            this.$emit('getCurrentPoint', this.positionResult);
            this.regeocoder();

        },
        regeocoder() {
            let geocoder = new AMap.Geocoder();
            geocoder.getAddress(this.current_point, (status, result)=> {
                if (status === 'complete' && result.info === 'OK') {
                    this.geocoder_CallBack(result);
                }
            });

        },
        geocoder_CallBack(data) {
            let address = data.regeocode.formattedAddress; //返回地址描述
            let _location = {
                address: address,
                position: this.current_point
            };
            this.$emit('getCurrentPoint', _location);
        },
        backinitposition() {
            this.amapManager.getMap().setCenter(new AMap.LngLat(this.init_point[0],this.init_point[1]));
//            this.position_center = new AMap.LngLat(this.init_point[0],this.init_point[1]);
//            this.map_option.zoom = 20;
        }
    },

    created() {

        if (this.mypoint && this.mypoint.position ) {
            this.position_center = this.mypoint.position;
            this.current_point = this.mypoint.position;
            this.init_point = this.mypoint.position;
        }
    }
};
</script>
<style scoped>
    .geo-amap-page {
        width: 50%;
        position: absolute;
        z-index: 20;
        right: 0;
    }
    .cs-geo-position-backInitMap {
        position: absolute;
        bottom: 120px;
        left: 40px;
        z-index: 2;
        text-indent: -9999px;
        background: url('/static/img/position.png') no-repeat 0 0;
        width: 34px;
        height: 34px;
    }
</style>