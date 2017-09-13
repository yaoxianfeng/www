import  {myStore} from '../store/store.js'

let _store = myStore;

const HA_AO_USER_INFO = "ha_ao_user_info";  //用户信息
const HA_AO_TOKEN = "ha_ao_token";          //token
const HA_AO_DEPT_ID = "ha_ao_dept_id";

let global_data = {
    deptlist:[],
    arealist:[],
    childDept:[],
    dict : {},
    dictObject : {},

    getUserInfo: function () {
        return _store.get(HA_AO_USER_INFO);
    },
    setUserInfo: function(userinfo) {
        _store.set(HA_AO_USER_INFO, userinfo);
    },
    getToken : function (){
        let router = global.router;
        let _token = _store.get(HA_AO_TOKEN);
        if (!_token) {
            router.push("/");
            return null;
        }
        return _token;
    },
    setToken : function (token) {
        _store.set(HA_AO_TOKEN, token);
    },
    setDeptid : function (Deptid) {
        _store.set(HA_AO_DEPT_ID, Deptid);
    },
    getDeptid : function (){
        let router = global.router;
        var _Deptid = _store.get(HA_AO_DEPT_ID);
        if (!_Deptid) {
            router.push("/");
            return null;
        }
        return _Deptid;
    },
    setNavsurl:function(name,obj){
        _store.set(name, obj);
    },
    getNavsurl:function(name){
        return _store.get(name);
    }
};

export let data = global_data;