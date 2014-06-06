

    
/**
 * @require css/pageBar.css
 */    
	var $ = require('lib/jquery'),
        template =require('lib/template');
    
    function PageBar(cfg){
        $.extend(this,{
            config:{},
            
            val: 0, //当前页码
            
            domEl: null
        });
        this.init(cfg);
    }
    
    $.extend(PageBar.prototype, {
    
        defaultCfg: {
            el : null,

            //对齐方式：center left right
            align:'center',
            
            //分页个数
            total: -1,
            
            //数据总条数
            totalNum:-1, 
            
            //分页大小。如果配置了total，则不再利用该配置项重新计算total的值。
            pageSize: 10,
            
            //分页码个数
            maxPage : 10,
            
            //初始页码
            page : 1,
            
            //单击页面的回调函数
            onPage: null    ,
            
            //提供快速跳转输入
            jumpTo: true,
            
            //自定义每页大小控制
            psCustom: false,
            
            //自定义每页大小可选项
            psList:[10,20,50,100],
            
            //自定义pageSize回调函数
            onCust: null
        },
        tplFn:template.compile('<a href="#"  class="ui_pageBar_item {{cls}}">{{n}}</a>'),
        dotStr: '<span>...</span>',
        
        init: function(cfg){
            $.extend(this.config,this.defaultCfg);
            $.extend(true,this.config,cfg);
            
            if(this.config.total < 0 && this.config.pageSize > 0){
                this.config.total = Math.ceil(this.config.totalNum/this.config.pageSize);
            }
            if(typeof this.config.el == 'string'){
                this.config.el = $("#" + this.config.el);
            }
            
            this.config.el.html('<div class="ui_pageBar"></div>');
            this.domEl = this.config.el.find('.ui_pageBar').addClass(this.config.align);
            
            this.setList(this.config.page);
            
            this.bindEvent();
            
        },
        addTotalItems: function(num){
            var cfg = this.config;
            cfg.totalNum += num;
            cfg.total = Math.ceil(cfg.totalNum/cfg.pageSize);
        },
        delTotalItems: function(num){
            var cfg = this.config;
            cfg.totalNum -= num;
            cfg.total = Math.ceil(cfg.totalNum/cfg.pageSize);
        },
        setList : function(page){
            
            this.val = page;
            var _this = this,
            	tplFn = this.tplFn;
            var ah=[],i,j,count,
            	
                total = this.config.total,    //分页个数
                maxPage = this.config.maxPage; //显示项个数

            ah.push('<a href="#" class="ui_pageBar_previous" style="visibility:' +
                        (page > 1?'visible':'hidden')+'">上一页</a>');
            if(total <= maxPage){
                for(i=1; i<=total;i++){
                    if(i == page){
                        ah.push(tplFn({cls:"current",n:i}));
                    }else{
                        ah.push(tplFn({n:i}));
                    }
                }
            }else{
                var side = Math.ceil((maxPage-2)/2);
                if(page - side <= 2){
                    for(i=1; i < page; i++){
                        ah.push(tplFn({n:i}));
                    }
                    ah.push(tplFn({cls:"current",n:page}));
                    for(i++;i < maxPage;i++){
                        ah.push(tplFn({n:i}));
                    }
                    if(maxPage != total){
                        ah.push(this.dotStr);
                    }
                    ah.push(tplFn({n:total}));
                }else if(page+side+1 > total){
                    ah.push(tplFn({n:1}));
                    ah.push(this.dotStr);
                    for(i=total-maxPage+2;i<=total;i++){
                        ah.push(tplFn({cls:(i == page?'current':'') , n:i}));
                    }
                }else{
                    ah.push(tplFn({n:1}));
                    ah.push(this.dotStr);
                    count = 1;
                    for(i=page-side+1;i<page;i++){
                        ah.push(tplFn({n:i}));
                        count++;
                    }
                    ah.push(tplFn({cls:"current",n:page}));
                    var right = Math.min(maxPage-count-2,side);
                    i=page+1;
                    for(j=0;j<right;j++){
                        ah.push(tplFn({n:i}));
                        i++;
                    }
                    if(maxPage != total){
                        ah.push(this.dotStr);
                    }
                    ah.push(tplFn({n:total}));
                }
            }
            ah.push('<a href="#" class="ui_pageBar_next" style="visibility:' +
                        (page < total?'visible':'hidden')+'">下一页</a>');
            
            ah.push([
    	         '<ins><form>',
    	         	'<span>共'+this.config.totalNum+'条记录</span>',
    	         	this.config.jumpTo ? [
	    	         	'<span>，跳到第</span>',
	    	         	'<input type="text" class="ui_pageBar_jumpto" >',
	    	         	'<span>/'+total+'页</span>',
	    	         	'<button type="button" class="ui_pageBar_jump">确定</button>'].join('') : "",
	         	'</form></ins>'
	         ].join(''));

            if(this.config.psCustom){
            	var tmp = '';
            	if(this.config.psList){
            		$.each(this.config.psList,function(i,item){
            			tmp += '<dd class="'+ (item === _this.config.pageSize ? "curr": "")+'">' + item + '条</dd>';
            		});
            	}
            	ah.unshift('<a class="fr ui_pageBar_psCust"><span class="custTip">每页显示...</span><dl>'+ tmp +'</dl></a>');
            }
            this.domEl.html(ah.join(''));
        },
        
        updatePage: function(page){
        	if(!isNaN(page) && page !== this.val){
                page = Math.min(page,this.config.total);
                page = Math.max(page,1);
                this.setList(page);
                if(typeof this.config.onPage === "function"){
                    this.config.onPage.call(this,page);
                }
            }
        },
        bindEvent: function(){
            var _this = this,
                page = this.val;
            this.domEl.on('click','.ui_pageBar_jump',function(){
            	var jumpVal = $(this).siblings(".ui_pageBar_jumpto").val();
            	jumpVal && _this.updatePage(jumpVal);
            }).on('keypress','.ui_pageBar_jumpto',function(e){
            	if(e.keyCode === 13){
            		_this.updatePage($(this).val());
            	}            	
            }).on('click','a',function(e){
                var target = $(e.target);
                e.preventDefault();
                if(target.hasClass("ui_pageBar_previous")){
                    page = _this.val - 1;
                }else if(target.hasClass("ui_pageBar_next")){
                    page = _this.val + 1;
                }else if(target.hasClass("ui_pageBar_item")){
                    page = parseInt(target.html(),10);
                }else if(target.is("dd")){
                	var ps = parseInt(target.html(),10);
                    if(typeof _this.config.psCust === "function"){
                    	_this.config.psCust(ps);
                    }
                    return;
                }else{
                	return;
                }
                _this.updatePage(page);
            });
        },
        destroy: function(){
        	this.domEl.off();
        	this.domEl.remove();
        }
    });

    module.exports = PageBar;