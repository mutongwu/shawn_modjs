/**
 * @author shawn
 * @require css/msgBox.css
*/

    var $ = require("lib/jquery"),
    	template = require("lib/template"),
    	BomHelper = require("util/BomHelper"),
    	Mask = require("ui/Mask"),
    	Button = require("ui/Button");
    
    var Lang = require('lib/lang');
    function MsgBox(cfg){
    	if(this instanceof MsgBox === false){
    		return new MsgBox(cfg);
    	}
        $.extend(this,{
            config:{},
            
            /**
             * @public {ui/Mask}
             */
            mask : null,
            
            /**
             * @public {$ element}
             */
            domEl: null
        });
        this.init(cfg);
    }
    
    $.extend(MsgBox.prototype,{
    
        defaultCfg:{

            id: '',
            
            title: '',
            
            //弹出框的位置参考对象。默认为空，参考对象是页面文档
            el: null,
            
            //对于el的参考位置,当el存在时候生效。tl(左上角),tr(右上角),lb(左下角),rb(右下角),lm(左侧居中),rm(右侧居中),mm(垂直居中)。默认值为mm 
            elPos: "mm",
            
            // 内容区域的宽度，不包括title和底部按钮。默认自适应
            width: '',
            
            //内容区域的高度，不包括title和底部按钮。默认自适应
            height: '',
            
            //body内容
            body:'',
            
            // alert/confirm/none
            type:'alert',
            
            //info/warn/error/success/question/loading/(empty)
            msgType: '',

            //启用tip的样式
            tipStyle: false,
            
            //显示关闭图标
            closable: true,
            
            //自定义class
            cls: '',

            //自定义样式
            style: null,
            
            //是否采用fixed定位，默认为true.(不支持IE6.)
            fixed:true,
            
            //是否显示遮盖层
            noMod: false,
            
            //自动关闭延迟，单位Ms。默认为0，不自动关闭
            time: 0,
            
            //按钮对齐方式。tc：居中;tr:居右;tl:居左
            buttonAlign:'tr',
            
            //是否可以拖动
            draggable: false,
            
            //载入的iframe地址
            url: null,
            
            //iframe 的onload事件
            onIframeLoad:null,
            
            //动画显示出iframe弹层
            animate: false,
            
            //按钮
            buttons:null,
            onRender:null,
            onBeforeClose:null,
            onClose: null,
            onYes: null,
            onNo: null,
            mask: {
                lazy: true,
                loading:false
            }            
            
        },
        _html: '',
        cntTpl: '<table id="{{id}}" class="ui_msgBox_box {{tipStyle}} {{cls}}" style="position:{{position}};{{style}}"><tbody><tr><td class="ui_msgBox_cnt"></td></tr></tbody></table>',
        hdTpl: '<div class="ui_msgBox_hd"><a href="javascript:void(0)" class="ui_ico_close {{show}}">&times;</a><span class="ui_msgBox_title">{{#title}}</span></div>',
        bdTpl: '<div class="ui_msgBox_bd {{msgType}}" style="width:{{width}};height:{{height}}"><div class="ui_msgBox_content">{{#icon}}{{#body}}</div></div>',
        ftTpl: '<div class="ui_msgBox_ft {{buttonAlign}}"></div>',
        
        init: function(cfg){
            $.extend(this.config,this.defaultCfg);
            $.extend(true,this.config,cfg);
            this.initDom();
            this.showMask();
            this.resize();
            this.loadIframe();
            this.setDraggable();
            this.bindEvents();
        },
        
        showMask: function(){
            //是否显示遮盖层
            if(this.config.noMod === true){
                this.domEl.appendTo(document.body);
            }else{
                this.mask = new Mask(this.config.mask);
                this.mask.html(this.domEl).mask();
            }
            
            if(typeof this.config.onRender === "function"){
                this.config.onRender.call(this);
            }
        },
        resize: function(params){
            //计算总体宽高
            var method = (params && params.animate === true ? "animate": "css"),
                el = this.config.el,
                domEl = this.domEl,
                w =  params && params.w || this.domEl.outerWidth(),//this.domEl.width(),
                h =  params && params.h || this.domEl.outerHeight();//this.domEl.height();
            if(el){
                var pos = el.position();
                var pos2 = {
                            "width": w,
                            "height": h,
                            "top":pos.top,
                            "left":pos.left
                    };
                switch(this.config.elPos){
                    case "tl" : break;
                    case "tr" : pos2.left = pos.left + el.innerWidth()- w;break;
                    case "lb" : pos2.top = pos.top + el.innerHeight()- h;break;
                    case "rb" : pos2.left = pos.left + el.innerWidth()- w;
                                pos2.top = pos.top + el.innerHeight()- h;
                                break;
                    case "lm" : pos2.top = pos.top + (el.innerHeight()- h)/2;break;
                    case "rm" : pos2.left = pos.left + (el.innerWidth()- w)/2;break;
                    case "mm" : pos2.top = pos.top + (el.innerHeight()- h)/2;
                                pos2.left = pos.left + (el.innerWidth()- w)/2;
                                break;
                }
                domEl[method](pos2);
            }else{
                domEl[method]({
	                width: w,
	                height: h,
	                marginTop:  -(h/2),
	                marginLeft: - (w/2)
	            },params && params.animateClb);
                this._ie6Resize();
            }
            this.domEl.find('.ui_msgBox_ft .btn').focus();
            this.domEl.find('.ui_msgBox_bd input').focus();
        },
        
        //调整弹窗在ie的位置
        _ie6Timer: null,
        _ie6Resize: function(){
        	if(BomHelper.isIE6){
        		var scrollTop = $(window).scrollTop();
        		var el = this.domEl,
        			viewH = document.documentElement.clientHeight ;
        		el.css({"top": viewH/2  + scrollTop,"marginTop":-el.height()/2});
        		this._ie6Timer = null;
        	}
        	
        },
        setDraggable: function(){
            if(this.config.draggable){
                var _this = this;
                require.async('util/DragDrop',function(DragDrop){
                    var preX = 0, preY = 0;
                    new DragDrop({
                        dragEl: _this.domEl,
                        ondragstart: function(e,data){
                            preX = data.x;
                            preY = data.y;		
                        },
                        ondragend: function(e,data){
                            _this.domEl.css({
				                top: parseInt(_this.domEl.css("top"),10) + data.y - preY,
				                left: parseInt(_this.domEl.css("left"),10) + data.x - preX
				            });
                        }
                    });
                });
            };
        },

        loadIframe: function(){
            var _this = this,
                iframeEl = null;
            if(this.config.url){
                iframeEl = $('<iframe class="ui_msgBox_iframe" frameborder="0"></iframe>');
                iframeEl.load(function(){
                    try{
                        var doc = this.contentWindow.document,
                            h = Math.max(doc.body.scrollHeight,doc.documentElement.scrollHeight),
	                        w = Math.max(doc.body.scrollWidth,doc.documentElement.scrollWidth),
                            resizeIframe = function(){
                                iframeEl.siblings().remove();
                                iframeEl.css({
                                    width : w,
                                    height : h,
                                    visibility: "visible"
                                });
                                _this.resize();
                                
                                if(typeof _this.config.onIframeLoad === "function"){
					                _this.config.onIframeLoad.call(_this);
					            }
                            };
                        if(_this.config.animate){
                            _this.resize({
                                w : w,
                                h : h,
                                animate: true,
                                animateClb: resizeIframe
                            });
                        }else{
                            resizeIframe();
                        }
                        
                    }catch(e){
                        _this.resize();
                        if(typeof _this.config.onIframeLoad === "function"){
                            _this.config.onIframeLoad.call(_this);
                        }
                    }
                });
                iframeEl.attr("src",this.config.url);
                this.domEl.find(".ui_msgBox_bd").append(iframeEl);
            }
        },
        /**
         * @public
         */
        close: function(){
            if(typeof this.config.onBeforeClose === "function" && 
                this.config.onBeforeClose.call(this) === false){
                    return;      
            }else if(this.mask){
	            this.mask.unMask();
            }
            clearTimeout(this.timer);
            this.domEl.remove();
            if(typeof this.config.onClose === "function"){
            	this.config.onClose.call(this);
            }
        },
        
        initHd: function(){
            if(!this.config.tipStyle){
	            this._html = template.compile(this.hdTpl)({
	                title: this.config.title,
	                show: this.config.closable ? "": "none"
	            });
            }
        },
        
        initBody: function(){
            this._html += template.compile(this.bdTpl)({
                msgType: this.config.msgType ? 'ui_msgBox_msgType ui_msgBox_' + this.config.msgType : '',
        		icon: this.config.msgType ? '<i class="ui_msgBox_icon"></i>'  : '',
                body: this.config.body,
                width: this.config.width ? parseInt(this.config.width,10) + "px" : "auto",
                height: this.config.height ? parseInt(this.config.height,10) + "px" : "auto"
            });
        },
        
        initFt: function(){
        	if(!this.config.tipStyle){
        		this._html += template.compile(this.ftTpl)({
                    buttonAlign: this.config.buttonAlign
                });
        	}            
        },
        
        initCnt: function(){
            this.domEl = $(template.compile(this.cntTpl)({
                id: this.config.id ? this.config.id: 'msg_' + String(Math.random()).substr(2),
                cls: this.config.cls,             
                tipStyle: this.config.tipStyle ? 'ui_msgBox_tip' : '',
                style: this.config.style,
                //TODO 在IE7中，无法对table元素的position属性的进行动态变更，必须在其渲染前设置！
                position: !BomHelper.isIE6 && this.config.fixed ? "fixed" : "absolute"
            }));
            
            this.domEl.find('.ui_msgBox_cnt').html(this._html);
            this._html = null;
        },
        
        initButtons: function(){
            var _this = this,
                arr = [],
                btn = null;
            
                
            if(this.config.type === "none" && this.config.buttons){
                $.each(this.config.buttons,function(i,val){
                    arr.push(new Button(val));
                });
            }else{
                btn = new Button({
                	"text":Lang.i18n('confirm'),
                    "event":"click",
                    "handler": function(){
                         if(!_this.config.onYes || 
                            (typeof _this.config.onYes === "function" && 
                                _this.config.onYes.call(_this) !== false)){
                            _this.close();
                         }  
                    }
                });
                
                if(this.config.type === "alert"){
                    arr.push(btn);
                }else if(this.config.type === "confirm"){
                    
                    arr.push(new Button({
                    		"text":Lang.i18n('cancel'),
                            "theme": "greybtn",
                            "event":"click",
                            "handler": function(){
                                if(!_this.config.onNo || 
                                    (typeof _this.config.onNo === "function" && 
                                        _this.config.onNo.call(_this) !== false)){
                                    _this.close();
                                 } 
                            }
                        })
                    );
                    arr.push(btn);
                }
                
            }

            $.each(arr,function(i,aBtn){
                _this.domEl.find('.ui_msgBox_ft').append(aBtn.domEl);
            });
        },


        initDom: function(){
            this.initHd();
            this.initBody();
            this.initFt();
            this.initCnt();
            this.initButtons();
        },
        
        bindEvents: function(){
            var _this = this;
            this.domEl.on('click','.ui_ico_close',function(){
                _this.close();
            });
            if(this.config.time > 0){
                this.timer = setTimeout(function(){
                    _this.close();
                },this.config.time);
            }
            
            if(BomHelper.isIE6 && !this.config.el){
            	$(window).scroll(function(){
            		if(!_this._ie6Timer){
            			_this._ie6Timer = setTimeout(function(){
            				_this._ie6Resize();
            			},250);
            		}            		
            	});
            }
        }
    });
    
    module.exports = MsgBox;
