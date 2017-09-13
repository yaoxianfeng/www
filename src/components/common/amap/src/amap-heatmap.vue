<template></template>
<script>
    import registerMixin from '../mixins/register-component';
    //热力图组件

    export default {
        name: 'ha-amap-heatmap',
        mixins: [registerMixin],
        props: [
            'options',
//            'radius',
//            'opacity',
//            'gradient',
            'heatmapData',
            'max'
        ],
        data() {
            return {
                convertProps() {
                    let props = {};
                    if (this.$amap) props.map = this.$amap;
                    if (!this.$options.propsData) return props;
                    for (let key in this.$options.propsData.options) {
                        let propsValue = this.convertSignalProp(key, this.$options.propsData[key]);
                        if (propsValue === undefined) continue;
                        props[key] = propsValue;
                    }
                    return props;
                },
                setPropWatchers() {
//                    if (!this.$options.propsData) return false;

//                    for (let prop in this.$options.propsData.options) {
//                        console.log("prop : " + prop);
//                        let handleFun = this.getHandlerFun(prop);
//                        if (!handleFun) continue;
//                        this.$watch(prop, nv => {
//                            if (prop === 'events') {
//                                this.unregisterEvents();
//                                this.registerEvents();
//                                return;
//                            }
//                            if (handleFun === this.$amapComponent.setOptions) {
//                                return handleFun.call(this.$amapComponent, {[prop]: this.convertSignalProp(prop, nv)});
//                            }
//                            handleFun.call(this.$amapComponent, this.convertSignalProp(prop, nv));
//                        });
//                    }
                },
                handlers: {

                }
            };
        },
        methods: {
            initComponent(options) {
                console.log(options);
                //let options = this.convertProps();
//                let props = {};
//                if (this.$amap) props.map = this.$amap;

                let that = this;


                let heatmap;
                that.$amap.plugin(["AMap.Heatmap"], function() {
                    //初始化heatmap对象
                    heatmap = new AMap.Heatmap(that.$amap, {
                        radius: that.options.radius, //给定半径
                        opacity: that.options.opacity
                        /*,gradient:{
                         0.5: 'blue',
                         0.65: 'rgb(117,211,248)',
                         0.7: 'rgb(0, 255, 0)',
                         0.9: '#ffea00',
                         1.0: 'red'
                         }*/
                    });
                    that.heatmap = heatmap;


                });


            }
        },
        watch : {
            heatmapData : function() {
                let that = this;
                that.heatmap.setDataSet({
                    data: that.heatmapData,
                    max: that.max
                });


            }
        }
    };
</script>
