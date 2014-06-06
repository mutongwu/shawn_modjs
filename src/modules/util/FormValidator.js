
var $ = require("lib/jquery");
var validator = {
	clearInvalidFn: null,
    invalidCls: 'error',
    PHONE: /^1[358]\d{9}$/,
    NUM: /^\d+$/,
    BLANK: /^\s*$/,
    EMAIL: /^[\w\.\-]+@([\w\-]+\.)+[a-zA-Z]+$/,
    POSTCODE:  /^[1-9][0-9]{5}$/,
    IDCARD:/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
    PASSPORT: /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/,
    validate: function($form){
        var _this = this,pass = true,
            el = null, val = null,
            msg = '',
            rs = {};
        var fields = $form.get(0).querySelectorAll('input,select,textarea');
        $.each(fields, function(i,item){
        	if(!item.name){
        		return;
        	}
            pass = false;
            el = $(item);
            val = item.value;
            msg = el.attr("label") || el.closest('.field').children("label").text();
            msg = msg.replace(/^\*/,'').replace(/[:：]$/,'');
            vtype = el.attr("vtype");
            
            if(el.attr("required") && _this.BLANK.test(val)){
                msg += "不能为空";
                return pass;
            }else if(val){
                var tmp = parseInt(el.attr("minLength")||0, 10);
                if(tmp && val.length < tmp){
                    msg += "不能少于"+ tmp + "位";
                    return pass;
                }
                tmp = parseInt(el.attr("maxLength")|| 0,10);
                if(tmp > 0 && val.length > tmp){
                    msg += "不能大于"+ tmp + "位";
                    return pass;
                }
                
                if(vtype === "phone" && !_this.PHONE.test(val)){
                    msg = "请填写正确的"+ msg;
                    return pass;
                }
                if(vtype === "num" && !_this.NUM.test(val)){
                    msg = "请填写数字的" + msg;
                    return pass;
                }
                if(vtype === "email" && !_this.EMAIL.test(val)){
                    msg = "请填写正确的" + msg;
                    return pass;
                }
                if(vtype === "postcode" && !_this.POSTCODE.test(val)){
                    msg = "请填写正确的" + msg;
                    return pass;
                }
                if(vtype === "idcard" && !_this.IDCARD.test(val)){
                    msg = "请填写正确的" + msg;
                    return pass;
                }
                if(vtype === "passport" && !_this.PASSPORT.test(val)){
                    msg = "请填写正确的" + msg;
                    return pass;
                }
            }
            _this.clearInvalidFn ? _this.clearInvalidFn(el):  el.removeClass(_this.invalidCls);
            pass = true;
            if(item.type && item.type.toLowerCase() === 'radio'){
                if(item.checked){
                    rs[item.name] = val;
                }
            }else if(item.type && item.type.toLowerCase() === 'checkbox'){
                if(item.checked){
                    rs[item.name] = typeof rs[item.name] === "undefined" ?  val : rs[item.name] + "," + val;
                }
            }else{
                rs[item.name] = val;    
            }
            
        }); 
        if(!pass){
            return {
                el: el,
                msg: msg
            };
        }
        return rs; 
    },
    isEmail: function(val){
        return this.EMAIL.test(val);
    },
    isPhone: function(val){
        return this.PHONE.test(val);
    }
};

module.exports = validator;