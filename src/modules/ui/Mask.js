/**
 * @author shawn
 * @example 
 *  new Mask({
 *      loading: true
 *  });
 */

    /**
     * @require css/maskBox.css
     */       
    var $ = require('lib/jquery'),
    	BomHelper = require('util/BomHelper'),
    	template = require('lib/template');
    
    var Lang = require('lib/lang');
    
    
    // 遮盖层计数，值不为0时候，body的overflow属性值为 hidden.为了处理多个遮盖层的问题。
    var ie6Hack = 0;
    function Mask(cfg){
        $.extend(this,{
            config:{
            	id: 'mask_' + new Date().getTime()
            },
            /**
             * @public
             */
            domEl: null
        });
        this.init(cfg);
    }

    $.extend(Mask.prototype,{
        defaultCfg: {
            zIndex:9000,
            
            el: null,
            
            //loading提示是否采用fixed定位,设置了el或者使用IE6无效 .
            fixed: true,
            
            //显示加载中
            loading: true,

            //点击遮盖层关闭
            clkClose:false ,
            
            //加载中的提示文本
            msg: null,
            
            //是否需要手动调用mask方法显示遮盖层。默认为false，直接显示。
            lazy: false
        },
        
        
        init: function(config){
            $.extend(this.config,this.defaultCfg);
            $.extend(true,this.config,config);
            
            this.initDom();
            this.render();
            this.config.lazy ? null:this.mask();
            this.bindEvents();
        },
        
        render: function(){
        	$(document.body).append(this._html);
            this.domEl = $('#' + this.config.id);
            this.updateDocStyle(1);
            if(this.config.loading){
                this.loading();
            }
            this._html = null;
        },
        
        /**
         * @public 显示遮盖层
         */
        mask: function(){
            this.domEl.show();
        },
        /**
         * @public 关闭遮盖层
         */
        unMask: function(){
            this.domEl.remove();            
            this.updateDocStyle(-1);
        },
        
        /**
         * @public 设置内容 
         */
        html: function(html){
            this.domEl.find('.mask_container').html(html);
            return this;
        },
        
        /**
         * @public 显示为加载中提示
         */
        loading: function(){
            var msg = '<div class="loading_box opacity_bg" style="position:{position}"><p class="ui_loading">{MSG}</p></div>';
            msg = msg.replace(/\{position\}/g,this.getPosition()).replace('{MSG}',this.config.msg || Lang.i18n('loading'));
            this.html(msg);
        },
        
        getPosition: function(){
            if(this.config.el || BomHelper.isIE6 || !this.config.fixed){
                return "absolute";
            }else{
                return "fixed";
            }
        },
        updateDocStyle: function(val){
            if(BomHelper.isIE6 && !this.config.el){
                ie6Hack += val;
                //document.documentElement.style.overflow = ie6Hack > 0 ?"hidden" : '';
            }
        },
        
        bindEvents: function(){
            var _this = this;
            if(this.config.clkClose === true){
                this.domEl.click(function(){
	                _this.unMask();
	            });
            }
            if(BomHelper.isIE6 && !this.config.el){
            	var timer = null,
            		setMarginTop = function(){
            		var scrollTop = $(window).scrollTop();
            		var el = _this.domEl.find('.loading_box'),
            			s1 = el.css("marginTop"),
            			viewH = document.documentElement.clientHeight ;
            		el.css("top",  (viewH)/2  + scrollTop);
            		timer = null;
            	};
            	$(window).scroll(function(){
            		if(!timer){
            			timer = setTimeout(setMarginTop,250);
            		}            		
            	});
            	setMarginTop();
            }
        },
        initDom: function(){
            var content = '<div class="mask_layer" style="{style}">&nbsp;</div>';
                temp = "position:" + this.getPosition();
            
	        if(BomHelper.isIE6){
	            content = '<iframe class="sel_hack_iframe" frameborder="0" src="about:blank"></iframe>' + content;
	            if(!this.config.el){
	            	temp += ";width= " + Math.max(document.documentElement.scrollWidth,document.body.scrollWidth) + "px";
		        	temp += ";height= " +  Math.max(document.documentElement.scrollHeight,document.body.scrollHeight) + "px";
	            }
	        }

	        content = content.replace('{style}',temp);
            if(this.config.el){
                var pos = this.config.el.offset();
                temp = template.compile("position:absolute;top:{{top}}px;left:{{left}}px;width:{{width}}px;height:{{height}}px")
                        ({
                            top: pos.top,
                            left: pos.left,
                            width: this.config.el.outerWidth(),
                            height: this.config.el.outerHeight()
                        });
            }
            content = '<div id="{id}" class="ui_Mask_box  {fullpage}" style="{style}">' + 
		               	   content +
		               	   '<div class="mask_container"></div>' +
		              '</div>';
           this._html = content.replace(/\{style\}/,temp).replace(/\{id\}/,this.config.id)
						.replace(/\{fullpage\}/,this.config.el ? '' : 'fullpage');
        }
    });
    module.exports =  Mask;
