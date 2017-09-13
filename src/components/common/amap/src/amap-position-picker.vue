<template></template>
<script>
    import registerMixin from '../mixins/register-component';
    //位置获取组件

    export default {
        name: 'ha-amap-position-picker',
        mixins: [registerMixin],
        props: [
            "position"
        ],
        data() {
            return {
                convertProps() {

                },
                setPropWatchers() {

                },
                converters: {

                },
                handlers: {

                }
            };
        },
        methods: {
            initComponent(options) {
                //let options = this.convertProps();

                let that = this;
                AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
                    let positionPicker = new PositionPicker({
                        mode: 'dragMarker',
                        map: that.$amap
                    });

                    positionPicker.on('success', function(positionResult) {
                        //获取点成功
                        that.$emit('getPositionResultSuc', positionResult);

                    });

                    positionPicker.on('fail', function(positionResult) {
                        //获取点失败
                        that.$emit('getPositionResultFail', positionResult);
                    });

                    that.$amapComponent = positionPicker;


                    if (typeof(that.position) != undefined &&  that.position) {
                        positionPicker.start(new AMap.LngLat(that.position.lng, that.position.lat));
                    } else {
                        positionPicker.start();
                    }

                });

            }
        }
    };
</script>
