// import vue from 'vue'
import search from '../components/common/search/search.vue'
import formcard from '../components/common/card/src/formcard.vue'
import ha_dialog from '../components/common/dialog/src/dialog.vue'
import ha_rategroup from '../components/common/rate/src/rategroup.vue'


const install = function (Vue,options) {
	Vue.component(
		'ha-search',search
	);
	Vue.component(
		'ha-formcard',formcard
	);

	Vue.component(
		'ha-dialog',ha_dialog
	);

	Vue.component(
		'ha-dialog',ha_dialog
	);
	Vue.component(
		'ha-rate-group',ha_rategroup
	);




}

export default {
  install
}