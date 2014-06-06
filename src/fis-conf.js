fis.config.merge({
	project : {
		//include : /^\/assets\/*/
	},
    /* */
    modules : {
    	postprocessor : {
            js : 'jswrapper'//,require-async
        },
        postpackager : 'yymodjs'
    },
    settings : {
    	optimizer : {
    		'uglify-js' : {
                mangle : {
                    //不要压缩require关键字，否则seajs会识别不了require
                    except : [ 'require' ]
                }
            }
       },
       postprocessor : {
           jswrapper : {
               type : 'amd'
           }
       }
    },
    roadmap : {
        domain: '/dist',
        path : [
			{
			    reg : /^\/modules\/lib\/(mod|fix)\.js$/i,
			    isMod : false,
                useMap:false
			},{
			    reg : /^\/modules\/css\/common\/.*\.css$/i,
			    isMod : false,
			    useMap:false
			},{
			    reg : /^\/modules\/aio\.(js|css)$/i,
			    isMod : false,
                useMap:false
			},{
			    reg : /^\/dwstatic\/app\.(js|css)$/i,
			    //isMod : false,
                useMap:false
			},{
			    //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
			    //直接引用为var $ = require('jquery');
				 reg : /^\/modules\/([^\/]+)\/\1\.js$/i,
			    //是组件化的，会被jswrapper包装
			    isMod : true,
			    //id为去掉modules和.js后缀的中间部分
			    id : '$1'
			},{
			    //其它组件
			    reg : /^\/modules\/(.*)\.js$/i,
			    isMod : true,
			    id : '$1'
			},{
			    //css组件
			    reg : /^\/modules\/(.*\.css)$/i,
			    //isMod : true,
			    id : '$1'
			},{
			    //dwstatic目录同名组件，引用短路径
			    reg : /^\/(dwstatic\/([^\/]+))\/\2\.js$/i,
			    //是组件化的，会被jswrapper包装
			    isMod : true,
			    //id是去掉.js后缀中间的部分
			    id : '$1'
			},{
			    //dwstatic目录下的其他文件
			    reg : /^\/(dwstatic\/(.*))\.js$/i,
			    isMod : true,
			    id : '$1'
			},{
			    //资源文件
			    reg : 'headRes.html',
			    mapJs : true
			},{
                reg: 'map.json',
                release: false
            }
        ]
    },
//    pack:{
//    	'/pkg/pkg.js': ['/modules/lib/fix.js','/modules/lib/mod.js',
//    	                       '/modules/lib/jquery.js','/modules/lib/template.js',
//    	                       '/modules/util/BomHelper.js','/modules/ui/Button.js',
//    	                       '/modules/ui/Mask.js','/modules/ui/MsgBox.js',
//    	                       '/modules/util/FormValidator.js']
//    },
    deploy : {
        release: {
            to: '../dist'
        },
        debug: {
            to: '../dist'
        }
    }
});
fis.config.set('settings.postpackager.yymodjs.subpath', 'map.js');