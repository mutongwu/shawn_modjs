/**
 * file: mod.js
 * ver: 1.0.3
 * auth: zhangjiachen@baidu.com
 * update: 11:48 2013/7/10
 */
var require, define;

(function(self) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        cssMap = {},
        resMap, pkgMap;


    function loadRes(id, callback) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        

        //
        // load this script
        //
        var res = resMap[id] || {};
        var url = res.pkg
                    ? pkgMap[res.pkg].url
                    : (res.url || id);

        if(/\.css$/.test(url)){
            if (! (url in cssMap))  {
            	cssMap[url] = true;
            	var link = document.createElement('link');
                link.href = url;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
                delete loadingMap[url];
            }
        }else{
        	queue.push(callback);
            if (! (url in scriptsMap))  {
                scriptsMap[url] = true;

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                head.appendChild(script);
            }
        }

    }
    
    define = function(id, factory) {
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw Error('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            'exports': {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function')
                ? factory.apply(mod, [require, mod.exports, mod])
                : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    function asyncMoudle(names,callback){
    	if (typeof names == 'string') {
            names = [names];
        }
        
        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                if(!/\.css$/.test(dep)){
                    needNum++;
                }
                
                loadRes(dep, updateNeed);

                var child = resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var i, n, args = [];
                for(i = 0, n = names.length; i < n; ++i) {
                    args[i] = require(names[i]);
                }
                callback && callback.apply(self, args);
            }
        }
        
        findNeed(names);
        updateNeed();
    }
    require.async = function(names, callback) {
    	preloadMoudle(null,function(){
        	asyncMoudle(names,callback);
        });
    };

    require.resourceMap = function(obj) {
        resMap = obj['res'] || {};
        pkgMap = obj['pkg'] || {};
    };

    require.alias = function(id) {return id;};

    var preloadMods = [];
    function preloadMoudle(mods,callback){
    	if(mods){
        	if (typeof mods === 'string') {
            	mods = [mods];
            }
        	preloadMods = preloadMods.concat(mods);
        }
    	var len = preloadMods.length;
    	if(len){
    		asyncMoudle(preloadMods,function(){
    			preloadMods.splice(0, len);
    			preloadMoudle(null,callback);
    		});
    	}else{
    		callback();
    	}
    }
    require.preload = function(mods,callback){
    	if (typeof mods === 'string') {
        	mods = [mods];
        }
    	var cacheMods = [].concat(mods);
    	preloadMoudle(mods,function(){
    		var params = [];
    		for(var i=0; i< cacheMods.length;i++){
    			params.push(require(cacheMods[i]));
    		}
    		callback.apply(null,params);
    	});
		
    };

    
})(this);
