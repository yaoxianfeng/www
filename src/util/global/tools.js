import moment  from 'moment'

const SOCKECT_ADDR = "ws://localhost:9999/chat";
const PREFIX_CODE= "code_";

function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function fomartDict(data) {
    if(!data || data.length  <1) {
        return null;
    }
    let _newobj = {};
    data.forEach((item, index)=> {
        _newobj[PREFIX_CODE+item.code] = item;
    })
    return _newobj;
}



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};


let Trim = function(str) {
    if (!str) {
        return "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

let tools ={

    initData: function () {
        //初始化方法
        global.data.deptlist = [];
        global.data.arealist = [];
        global.data.childDept = [];
        global.data.alldeptlist = [];
        global.data.childPoliceDeptList = [];       //子公安部门
        global.data.dict = {};
        global.data.dictObject = {};
        global.data.userNavUrl=[];
    },
    formartDate : function (value, formatString) {
        if(!value){return "";}
        formatString = formatString || 'YYYY-MM-DD HH:mm';
        return moment(value).format(formatString);
    },
    isNullString: function (str) {
        if (typeof(str) == undefined  || !str || !Trim(str)) {
            return true;
        }
        return false;
    },
    imgpathformat:function(value) {
        if (typeof (value) !=undefined && value && (value.indexOf("http") != 0 && value.indexOf("//")  != 0 ) ) {
            return global.config.weburl+'upload/'+value;
        } else {
            return value;
        }
    },
    clearspace:function(value){
        // console.log("pace:"+value)
        // let str;
        // //const ovalue=value.trim();
        // str=value.replace(/\s+/g,"");
        // console.log("str:"+str)
        // return str; 
    },
    getCurrentDate : function () {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today;
    },
    handleError : function (data) {
        let app = global.app;
        let router = global.router;
        if (data && data.code == 501) {
            app.$message({
                type: 'error',
                message: "请重新登陆"
            });
            router.push("/");
        } else {
            if (data && data.msg) {
                app.$message({
                    type: 'error',
                    message: data.msg
                });
            } else{
                app.$message({
                    type: 'error',
                    message: "出现异常，请稍后重新尝试"
                });
            }

        }
    },
    startEjingwu:function() {
        let app = global.app;
        var isWin = (window.navigator.platform == "Win32") || (navigator.platform == "Windows") || (window.navigator.platform == "Win64");
        const h = app.$createElement;
        var noClientMsg = {
            type: 'error',
            message: h('div', [
                h('span', '您尚未安装微警务客户端，请'),
                h('a', {attrs: {href: 'http://down.huaaotech.date/ejingwu/EJingwuV2.exe'}}, '点击安装客户端程序'),
                h('span', '后重试，谢谢！')
            ]),
            duration: 0,
            showClose: true
        };
        if(!isWin){
            app.$message({type: 'error', message: "视频会议需要安装微警务客户端，请使用Windows操作系统，谢谢！"});
            return false;
        }else if(window.ActiveXObject){


            try {
                var obj = new ActiveXObject("EJingwuV2");
                if(obj == null || typeof(obj) == undefined){
                    app.$notify(noClientMsg);
                    return false;
                }else{
                    window.location = 'EJingwuV2://'+global.data.getToken();
                    return true;
                }

            } catch (ex) {
                //IE10的问题
                app.$notify(noClientMsg);
                return false;
            }


        }else{
            var ws;
            try {
                ws = new WebSocket(SOCKECT_ADDR);
                ws.onerror = function(event){
                    console.log("WebSocket异常！" + event.toString());
                    app.$notify(noClientMsg);
                };
                ws.onclose = function(event){
                    console.log("WebSocket关闭！" + event.toString());
                };
                ws.onopen = function(event){
                    ws.send(1);
                    window.location = 'EJingwuV2://'+global.data.getToken();
                };
                ws.onmessage = function (event) { console.log("接收到服务器发送的数据：\r\n" + event.data); };


                //return true;
            } catch (ex) {
                //console.log(ex.message);
                app.$notify(noClientMsg);
                return false;
            }
        }
    },
    
  
    
    getAllArea : function () {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.arealist && global.data.arealist.length >0) {
                resolve(global.data.arealist);

            } else {
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }
                app.$http.post(global.config.weburl + "api/dept/findByUserPoliceStation.do", {token: token})
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                global.data.arealist = res.data.data;
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    getAllPoliceDeptsWithSelf : function () {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.alldeptlist && global.data.alldeptlist.length >0) {
                resolve(global.data.alldeptlist);
            } else {
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }                                      
                app.$http.post(global.config.weburl + "api/dept/findPoliceOffice.do", {token: token,type:2})
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                global.data.alldeptlist = res.data.data;
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    getAllPoliceDept : function () {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.deptlist && global.data.deptlist.length >0) {
                resolve(global.data.deptlist);
            } else {
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }
                app.$http.post(global.config.weburl + "api/dept/findPoliceOffice.do", {token: token})
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                global.data.deptlist = res.data.data;
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    getChildPoliceDept : function (parentId) {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.childPoliceDeptList && global.data.childPoliceDeptList.length >0) {
                resolve(global.data.childPoliceDeptList);
            } else {
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }
                app.$http.post(global.config.weburl + "api/dept/findByParent.do", {token: token, parentId: parentId, type : "公安"})
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                global.data.childPoliceDeptList = res.data.data;
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    getDept : function (parentId) {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.childDept && global.data.childDept.length >0) {
                resolve(global.data.childDept);

            } else {
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }
                app.$http.post(global.config.weburl + "api/dept/findByParent.do", {token: token, parentId: parentId})
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                global.data.childDept = res.data.data;
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    extend : function (obj) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        if (isObject(obj) && args.length > 0) {
            if (Object.assign) {
                return Object.assign.apply(Object, [obj].concat(args));
            }
            args.forEach(function (arg) {
                if (isObject(arg)) {
                    Object.keys(arg).forEach(function (key) {
                        obj[key] = arg[key];
                    });
                }
            });
        }

        return obj;
    },
    getDict(code, sortby, keyword) {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.dict && global.data.dict[code] && global.data.dict[code].length >0) {
                resolve(global.data.dict[code]);

            } else {
                let token = global.data.getToken();
                let _post_data = {token: token,code:code};
                ( !global.tools.isNullString(sortby)) && (_post_data[sortby] = sortby);
                ( !global.tools.isNullString(keyword)) && (_post_data[keyword] = keyword);

                app.$http.post(global.config.weburl + "api/dict/findByParent.do", _post_data)
                    .then(
                        function (res) {
                            if (res.data.code == 0) {
                                let _res_data = res.data.data;

                                global.data.dict[code] = _res_data;
                                global.data.dictObject[code] = global.tools.extend({}, fomartDict(_res_data));

                                //global.data.dictObject["code_" + code] = fomartDict(_res_data);
                                resolve(res.data.data)
                            } else {
                                global.tools.handleError(res.data);
                            }

                        }
                    );
            }
        });
    },
    getDictChildByCode(parentCode, code) {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.dictObject && global.data.dictObject[parentCode] && global.data.dictObject[parentCode].length >0) {
                resolve(global.data.dictObject[parentCode][ PREFIX_CODE + code]);

            } else {
                global.tools.getDict(parentCode).then(function(data) {
                    resolve(data[PREFIX_CODE + code]);
                })
            }
        });
    },
    getDictChild(parentCode) {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.dictObject && global.data.dictObject[parentCode] && global.data.dictObject[parentCode].length >0) {
                resolve(global.data.dictObject[parentCode]);
            } else {
                global.tools.getDict(parentCode).then(function(data) {
                    resolve(global.data.dictObject[parentCode]);
                })
            }
        });
    },
    getNavList() {
        let app = global.app;
        return new Promise(function(resolve,reject) {
            if (global.data.userNavUrl && global.data.userNavUrl.length >0) {
                resolve(global.data.userNavUrl);
            } else{
                let token = global.data.getToken();
                if(!token) {
                    return [];
                }
                let _post_data = {token: token};
                app.$http.get(global.config.weburl + "api/menu/user/list.do?",{
                    params: _post_data
                })
                .then(
                    function(res){
                        if (res.data.code == 0) {
                            global.data.userNavUrl=res.data.data;
                            global.data.userNavUrl.forEach(function(value,index,array){
                                if(value.menus.length){
                                    global.data.setNavsurl(value.url,value.menus);
                                }
                            });
                            resolve(res.data.data)
                        }else{
                             global.tools.handleError(res.data);
                        }
                    }
                );
            }
        });
    }

};

export default tools;