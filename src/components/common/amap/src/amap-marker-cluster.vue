<template></template>
<script>
import registerMixin from '../mixins/register-component';

export default {
  name: 'ha-amap-marker-cluster',
  mixins: [registerMixin],
  props: [
    'options',
    'clusterMarkers'
  ],
  data() {
    return {
      converters: {

      },
      handlers: {

      }
    };
  },
  methods: {
    convertProps() {

    },
    setPropWatchers() {

    },
    loadMyMarkers() {
      let that = this;
      let _markers = [];

      if (that.$amapComponent) {
        that.$amapComponent.setMap(null);
      }

      that.clusterMarkers.concat([]).forEach(function(item, index) {
        let marker = new AMap.Marker(item);
        _markers.push(marker);
      })

      that.$amap.plugin(["AMap.MarkerClusterer"], function() {
        if (_markers &&  _markers.length>0) {
          that.$amapComponent = new AMap.MarkerClusterer(that.$amap, _markers);
        }


      });

    },
    initComponent(options) {
      this.loadMyMarkers();

    }
  },
  watch : {
    clusterMarkers : function() {
      this.loadMyMarkers();
    }
  }
};
</script>
