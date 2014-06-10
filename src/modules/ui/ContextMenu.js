/**
 * @description 右键菜单功能 
 * @author wushufeng
 * @date 2014-01-02
 *  
 */

/**
 * @require css/contextMenu.css;
 */
    var $ = require('lib/jquery'),
    	template = require('lib/template'),
    	BomHelper = require('util/BomHelper');
    
    function ContextMenu(cfg){
        if(this instanceof ContextMenu === false){
            return new ContextMenu(cfg);
        }
        
        $.extend(this,{
            domEl: null,
            tplFn: null,
            acitveTarget: null,
            
            config:{}
        },true);
        this.init(cfg);
    }
    
    ContextMenu.prototype = {
        contructor: ContextMenu,
        
        
        defaultCfg: {
            //添加右键监听的jq对象或选择器
            el: '',
            
            /**
             * 菜单的宽度，超出不做隐藏 
             */
            minWidth: '100px',
            
            /**
             *菜单的显示层级 
             */
            zIndex: 100,
            
            /**
             *@property {Array} 菜单内容，每一个菜单项包括以下配置项：
             * {
             *     text: '', //显示名称,
             *     cls: '', //添加的样式className,默认有 add/edit/delete，多个cls用空格分隔.
             * }
             */
            menu:null,
            
            /**
             * @property 创建菜单项之前的处理函数，返回false则取消该菜单项的构建.
             * 传递参数为激活事件的菜单项数据、jq对象
             */
            beforeItemCreate: null,
            
             /**
             * @property {Function} 自定义返回菜单的html结构。
             * 传递参数为激活事件的jq对象
             */
            customMenu: null,
            
                        
            /**
             * 菜单项选择器 ，用于事件绑定
             */
            itemSelector: '.ui-ctxMenu-item',
            
            /**
             *@property 菜单项的事件绑定 
             */
            events:{
                click: null,
                mouseenter: null,
                mouseout: null
            },
            
            /**
             *@property 自定义菜单容器的className 
             */
            cls: '',
            
            /**
             *@property 菜单项模板 
             */            
            tpl: '<li class="ui-ctxMenu-item {{cls}}">{{#text}}</li>'
        },

        initCfg: function(cfg){
            $.extend(this.config,this.defaultCfg,cfg);
            if(typeof this.config.el === "string"){
                this.config.el = $(this.config.el);
            }
            if(this.config.tpl){
                this.tplFn = template.compile(this.config.tpl);
            }
            if(!this.config.id){
                this.config.id = "ctx_" + Math.random();
            }
        },
        init: function(cfg){
            this.initCfg(cfg); 
            this.initEvent();
        },
        
        createSubMenu: function(data){
            var valid = true , tplFn = this.tplFn,
	        	_this = this;
	        	tmp = '<ul class="ui_ctxMenu_sub">';
            if(typeof this.config.beforeItemCreate === 'function'){
                valid = this.config.beforeItemCreate(item,target) === false ? false : true; 
            }
        },
        
        createMenuItem: function(obj,target){
            var valid = true , tplFn = this.tplFn,
            	_this = this;
            	tmp = '<ul class="ui_ctxMenu_sub">';
            
            if(typeof this.config.beforeItemCreate === 'function'){
                valid = this.config.beforeItemCreate(obj,target) === false ? false : true; 
            }
            if(obj.children && obj.children.length){
            	obj.cls += ' J_hasSub';
            	
            	$.each(obj.children,function(i,subItem){
            		tmp += _this.createMenuItem(subItem,target);
            	});
            	tmp += '</ul>';
            	obj.text += tmp;
            }
            
            return valid ? tplFn(obj): '';
        },
        
        initDom: function(){
            var _html = '', _this = this;
            if(!this.domEl){                
                this.domEl = $('<div id="'+this.config.id+'" class="ui-ctxMenu-box '+ this.config.cls+
                                '"><ul class="ui-ctxMenu-inner" style="min-width:'+ this.config.minWidth+
                                '"></ul></div>');
                this.domEl.appendTo(document.body);
                this.bindEvents();
            }
            if(typeof this.config.customMenu === 'function'){
                _html = this.config.customMenu.call(this,_this.acitveTarget);
            }else if(this.config.menu){
                $.each(this.config.menu,function(i,item){
                    _html += _this.createMenuItem($.extend(true,{},item),_this.acitveTarget);
                });
            }
            this.domEl.children('.ui-ctxMenu-inner').html(_html);
            //只允许一个右键菜单显示
            $('.ui-ctxMenu-box').hide();
        },
        
        hide: function(){
            // console.log(this)
            this.domEl.hide();
        },
        show: function(pos){
            this.domEl.css(pos[0]).children('.ui-ctxMenu-inner').css(pos[1]).end().show();
        },
        
        calculatePos: function(e){
            //作一次不可见的显示。用于计算内容宽高。
            this.domEl.css({'visibility':'hidden',"top":0,"left":0}).show();
            
            var offset = {},
                menu = this.domEl.children('.ui-ctxMenu-inner'),
                h = menu.height(),
                w = menu.width(),
                docSize = {
                    w: Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),
                    h: Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight)
                };
            
            offset["top"] = (e.clientY + h > docSize.h) ? -h : 0;                
            offset["left"] = (e.clientX + w > docSize.w) ? -w : 0;

            return [{"top": e.clientY,"left": e.clientX,
                    "zIndex":this.config.zIndex,
                    "visibility":'visible'},
                    offset];
        },
        
        getPos: function(relEl,menu){
            
        	var offset = relEl.offset(),
        		relW = relEl.outerWidth(),
        		relH = relEl.outerHeight();
        	//计算是否超出边界
        	var x0 = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        		y0 = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    		var obj = {'visibility':'hidden','top':0,'left':relW};
        	menu.css(obj).show();
        	var x1 = document.documentElement.scrollWidth - document.documentElement.clientWidth,
        		y1 = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        	
        	
        	if(y0 < y1){ //高度超出了
            	console.log('exit y');
            	obj.bottom = 0;
            	obj.top = "auto";
            }
        	if(x0 < x1){ //宽度超出
        		console.log('exit x');
        		obj.left = -relW;
        	}
        	obj.visibility = 'visible';
            return obj;
        },
        showSubMenu: function(relativeEl,el){
        	el.css(this.getPos(relativeEl,el));
        },
        hideSubMenu: function(relativeEl,el){
        	el.hide();
        },
        
        //通过方法调用，动态获取当前的activeTarget
        getTarget: function(){
        	return this.acitveTarget;
        },
        bindEvents: function(){
            var _this = this, evMap = {};
            
            //子菜单显示
            this.domEl.on('mouseenter','.J_hasSub',function(){
            	_this.showSubMenu($(this),$(this).children(".ui_ctxMenu_sub"));
            }).on('mouseleave','.J_hasSub',function(){
            	_this.hideSubMenu($(this),$(this).children(".ui_ctxMenu_sub"));
            }).on('mouseleave','.ui_ctxMenu_sub',function(){
            		$(this).hide();
        	});
            
            //添加自定义的事件侦听
            for(var p in this.config.events){
                if(typeof this.config.events[p] === 'function'){
                    evMap[p] = (function(p){
                    	return function(e){
                        	_this.config.events[p].call(this,e,_this.getTarget());
                        };
                    })(p);
                }
            }
            this.domEl.on(evMap,this.config.itemSelector);
            $(document.body).on('click',function(e){
                _this.hide();
            });
        },
        
        initEvent: function(){
            var _this = this;
            this.config.el.on('contextmenu', function(e) {
                    e.preventDefault();
                    _this.acitveTarget = $(e.target);
                    _this.initDom(_this.acitveTarget);
                    _this.show(_this.calculatePos(e));
                }
            );
        }
    };
    module.exports =  ContextMenu;