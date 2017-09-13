<template>
    <el-dialog title="位置信息" v-model="dialogPositionVisible"  :modal-append-to-body="false" >
        <div id="current_position" class="cs-map-bjxq"></div>
        <el-button type="primary">确认</el-button>
    </el-dialog>
</template>
<script>

export default{
    data:function(){
        return {
            dialogPositionVisible:false
        }
    },
    methods: {
        getPoint(){
            var geocoding = function(x, y, fan){
                var url = "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location="+y+","+x+"&output=json&pois=1&ak=pYyi0ezfhpE9Exceq26QAcge";
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'JSONP',//here
                    success: function (data) {
                        if(data.status == 0){
                            fan(data.result);
                        }
                    }
                });
            }
            var map = new BMap.Map("current_position");
                map.centerAndZoom("武汉",12);
                var x = "114.469358", y = "30.640694";
                var marker = new BMap.Marker(new BMap.Point(x, y));
                map.addOverlay(marker);
                marker.enableDragging();
                var label = new BMap.Label("",{offset:new BMap.Size(20,-30)});
                label.setStyle({color : "#333", fontSize : "14px", padding: "5px 15px", borderColor: "#ccc" });

                marker.setLabel(label);

                geocoding(x, y, function(arr){
                    var address = arr.formatted_address;
                    label.setContent(address);
                })
                map.addEventListener("click",function(e){
                    var x = e.point.lng, y = e.point.lat;
                    geocoding(x, y, function(arr){
                        marker.setPosition(new BMap.Point(x,y));
                        var address = arr.formatted_address;
                        label.setContent(address);
                    });
                });
        },
        openDialog() {
            const that = this;
            that.dialogPositionVisible=true;
            that.getPoint();
        }
    },
    created:function(){
        const that = this;
        const Bus = global.eventHub;
        Bus.$on('doto_show_addposition',function(){
            that.openDialog();
        });
    },
    mounted:function() {

    }
}

</script>
<style>
.cs-map-bjxq{height: 300px;width: 100%;}
</style>

