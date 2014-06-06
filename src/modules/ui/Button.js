
var template = require('lib/template'),
    $ = require("lib/jquery");    

function Button(cfg){
    $.extend(this,{
        config:{},
        
        domEl: null
    });
    this.init(cfg);
}

$.extend(Button.prototype,{
    
    defaultCfg: {
        id: '',
        
        //(empty)/small/large
        size: '',
        
        cls: '',
        
        //greenbtn/redbtn/bluebtn/orangebtn/greybtn
        theme: 'greenbtn',
        
        style: '',
        
        text: '按钮',
        
        //字符串,或数组
        event: 'click',
        
        //事件处理函数,或数组，对应event属性
        handler: null
    },
    
    //编译过后的模板对象
    tplObj: null,
    tplStr:'<a id="{{id}}" class="btn {{theme}} {{size}} {{cls}}" href="javascript:;" style="{{style}}">{{text}}</a>',
    init: function(cfg){
        $.extend(this.config,this.defaultCfg);
        $.extend(true,this.config,cfg);
        this.initDom();
        this.bindEvents();
    },
    
    initDom: function(){
    	
        var tpl = this.tplObj = (this.tplObj ? this.tplObj : template.compile(this.tplStr)),
            cfg = this.config,
            data = {
                id: cfg.id?cfg.id: 'btn_' + new Date().getTime(),
                theme: cfg.theme,
                cls: cfg.cls,
                style: cfg.style,
                text: cfg.text
            };
        if(cfg.size === 'small' || cfg.size === 'large'){
            data.size = cfg.size + 'btn';
        }

        this.domEl = $(tpl(data));
    },
    
    bindEvents: function(){
        var _this = this,
            cfg = this.config;
        if(typeof cfg.event === 'string' && 
            typeof cfg.handler === 'function'){
            this.domEl.bind(cfg.event,function(){
                cfg.handler.call(_this);
            });    
        }else if($.isArray(cfg.event) && $.isArray(cfg.handler)){
            $.each(cfg.event,function(i,val){
                (function(i){
                    _this.domEl.on(val,function(){
                        cfg.handler[i].call(_this);
                    });
                })(i);
            });
        }
    }
});

module.exports = Button;