
var $ = require("lib/jquery");
var Lang = require('lib/lang');

var errorTxt = Lang.i18n('validator.errorTxt'),
	numTxt = Lang.i18n('validator.numTxt'),
	reqTxt = Lang.i18n('validator.required');


var validator = {
	config: {
		clearInvalidFn: null, //清除错误样式函数
		
		getLabelFn: null,	//定位label提示的函数
		
	    invalidCls: 'error' //错误样式
	},
	
    PHONE: /^1[3578]\d{9}$/,
    NUM: /^\d+$/,
    BLANK: /^\s*$/,
    EMAIL: /^[\w\.\-]+@([\w\-]+\.)+[a-zA-Z]+$/,
    POSTCODE:  /^[1-9][0-9]{5}$/,
    IDCARD:/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
    PASSPORT: /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/,
    
    setConfig: function(args){
    	$.extend(this.config,args);
    },
    _getLabel: function(el){
    	if(this.config.getLabelFn){
    		return  this.config.getLabelFn(el);
    	}
    	return el.attr("label") || el.closest('.field').children("label").text();
    },
    _clearInvalid: function(el){
    	 this.config.clearInvalidFn ? this.config.clearInvalidFn(el):  el.removeClass(this.config.invalidCls);
    },
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
            msg = _this._getLabel(el);
            msg = msg.replace(/^\*/,'').replace(/[:：]$/,'');
            vtype = el.attr("vtype");
            
            if(el.attr("required") && _this.BLANK.test(val)){
                msg += reqTxt;
                return pass;
            }else if(val){
                var tmp = parseInt(el.attr("minLength")||0, 10);
                if(tmp && val.length < tmp){
                    msg += Lang.i18n('validator.minlength',tmp);
                    return pass;
                }
                tmp = parseInt(el.attr("maxLength")|| 0,10);
                if(tmp > 0 && val.length > tmp){
                    msg += Lang.i18n('validator.maxlength',tmp);
                    return pass;
                }
                
                if(vtype === "phone" && !_this.PHONE.test(val)){
                    msg = errorTxt + msg;
                    return pass;
                }
                if(vtype === "num" && !_this.NUM.test(val)){
                    msg = numTxt + msg;
                    return pass;
                }
                if(vtype === "email" && !_this.EMAIL.test(val)){
                    msg = errorTxt + msg;
                    return pass;
                }
                if(vtype === "postcode" && !_this.POSTCODE.test(val)){
                    msg = errorTxt + msg;
                    return pass;
                }
                if(vtype === "idcard" && !_this.IDCARD.test(val)){
                    msg = errorTxt + msg;
                    return pass;
                }
                if(vtype === "passport" && !_this.PASSPORT.test(val)){
                    msg = errorTxt + msg;
                    return pass;
                }
            }
            _this._clearInvalid(el);
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