import * as types from './mutations_types';

export default {
	show_loading: ({
		commit
	}) => {
		return new Promise((resolve, reject) => {
			commit(types.SHOW_LOADING);
			resolve()
		});
	},

	hide_loading: ({
		commit
	}) => {
		return new Promise((resolve, reject) => {
			commit(types.HIDE_LOADING);
			resolve()
		});
	},
	update_page_info: ({
		commit
		}, pageinfo)=> {
		commit(types.UPDATE_PAGE_INFO, pageinfo);
	},

	tr_home_wxx: ({
		commit
	}) => {
		return new Promise((resolve, reject) => {
			commit(types.TR_HOME_WXX);
			resolve()
		});
	},

	fl_home_wxx: ({
		commit
	}) => {
		return new Promise((resolve, reject) => {
			commit(types.FL_HOME_WXX);
			resolve()
		});
	}
};