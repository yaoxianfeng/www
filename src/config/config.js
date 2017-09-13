//const BASEURL = "http://v3.huaaotech.tech/";
//const BASEURL = "//www.huaaotech.tech/";
//const BASEURL = "http://ejw.huaaotech.space/";
//let BASEURL = "//www.huaaotech.date/";
//const PRINT_BASEURL = "//www.huaaotech.tech/index.html/";

var url = window.location.href;
var domain = "www.huaaotech.tech";
var prefix = url.split("//")[0];

const BASEURL = prefix+"//"+domain+"/";

const config = {
    //全局设置
    weburl: BASEURL,
    weburl2: BASEURL,
    //printBaseUrl:PRINT_BASEURL,
    imgloadurl:BASEURL+"file/upload/image.do",
    imgbaseurl:BASEURL+"/upload/",
    webupload: BASEURL+"/upload/",
    db_prefix:"ha_gbl_"
    //回调
};

module.exports = config;