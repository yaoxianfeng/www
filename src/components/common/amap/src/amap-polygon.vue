<template>
</template>
<script>
import registerMixin from '../mixins/register-component';
import editorMixin from '../mixins/editor-component';
export default {
  name: 'ha-amap-polygon',
  mixins: [registerMixin, editorMixin],
  props: [
    'vid',
    'zIndex',
    'path',
    'bubble',
    'strokeColor',
    'strokeOpacity',
    'strokeWeight',
    'fillColor',
    'editable',
    'fillOpacity',
    'extData',
    'strokeStyle',
    'visible',
    'strokeDasharray',
    'events',
    'onceEvents'
  ],
  data() {
    return {
      converters: {},
      handlers: {
        visible(flag) {
          flag === false ? this.hide() : this.show();
        },
        zIndex(num) {
          this.setOptions({zIndex: num});
        },
        editable(flag) {
          flag === true ? this.editor.open() : this.editor.close();
        }
      }
    };
  },
  methods: {
    register() {

      this.initComponent && this.initComponent(this.convertProps());
      this.registerEvents();
      if (this.events && this.events.init) this.events.init(this.$amapComponent, this.$amap, this.amapManager || this.$parent.amapManager);
      this.initProps();
      this.setPropWatchers();
      this.registerToManager();

      this.$emit("setFitView");
    },
    initComponent(options) {
      //let options = this.convertProps();
      this.$amapComponent = new AMap.Polygon(options);
      this.$amapComponent.editor = new AMap.PolyEditor(this.$amap, this.$amapComponent);


//      console.log(this.$amapComponent);

      //console.log(this.$amap.getCenter());
    }
  }
};
</script>
