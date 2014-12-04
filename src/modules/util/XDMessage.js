/**
 * @author wushufeng
 * 
 * 跨域的js通信，允许子页面再次嵌套iframe。利用了IE6/7的navigator对象是公用的hack。
 * 注意：为了能兼容IE6/7，使用的时候需要保证：
 * 		1. 要通讯的iframe必须指定name属性;
 * 		2. 要通讯的iframe的name属性，必须唯一。
 * usage:
 * 
 *  父页面：
 *  	1.嵌入iframe,设置 name=iframe1
 *  	2.监听iframe1的信息
			XDMessage.listen(function(msg){
				alert('父窗口收到:' + msg);
			},'iframe1');
		3.向iframe1发送信息：
			XDMessage.send("发自父窗口的消息：" + new Date().toLocaleString(),'iframe1');
	子页面：
		1.监听父页面的信息：（注意第二个参数为空！）
			XDMessage.listen(function(msg){
				alert('子窗口得到:' + msg);
			});
		2.向父页面发送信息：（注意第二个参数为空！）
			XDMessage.send('我是iframe1' + new Date().toLocaleString());
			
		[4].如果该页面也嵌套了iframe，name="iframe1_1"，同样可以监听它的信息：
			XDMessage.listen(function(msg){
				alert('子窗口得到:' + msg);
			},'iframe1_1');
 */

var XDMessage = {
	support :'postMessage' in window,
	
	//targetName: [handler,...]
	eventMap : {},
	
	whiteList: null,
	
	init: function(){
	},
	_listenOnce: false,
	
	
	_checkValid: function(origin){
		
		if(this.whiteList && origin){
			for(var i=0; i < this.whiteList.length; i++){
				if(origin.indexOf(this.whiteList[i]) === 0){
					return true;
				} 
			}
			return false;
		}
		return true;
	},
	_onMessage: function(targetName){
		if(this._listenOnce){
			return;
		}
		var _this = this;
		function msgFn(e){
			if( !_this._checkValid(e.origin) ){
				return;
			}
			var data = JSON.parse(e.data);
			var name = data["name"];
			var fns = _this.eventMap[name];
			for(var i=0; i < fns.length; i++){
				fns[i](data["msg"],e);
			}	
		};
		window.addEventListener ? window.addEventListener("message",msgFn, false) : 
			window.attachEvent &&  window.attachEvent("onmessage", msgFn) ;
		this._listenOnce = true;
	},
	listen: function(handler,targetName){
		if(this.support){
			targetName = targetName || window.name;
			var fns = this.eventMap[targetName];
			if(!fns){
				this.eventMap[targetName] = [handler];
			}else{
				this.removeListen(handler, targetName);//防止同一事件函数重复
				this.eventMap[targetName].push(handler);
			}
			this._onMessage();
		}else{
			if(!targetName){
				targetName = window.name + 'RecvParent'; 
			}else{
				targetName += 'RecvIframe'; 
			}
			navigator[targetName] = handler;
		}
	},
	removeListen: function(handler,targetName){
		if(this.support){
			targetName = targetName || window.name;
			var fns = this.eventMap[targetName];
			if(fns){
				for(var i=0; i < fns.length;i++){
					if(fns[i] === handler){
						fns.splice(i,1);
						return true;
					}
				}
			}			
		}else{
			if(!targetName){
				targetName = window.name + 'RecvParent'; 
			}else{
				targetName += 'RecvIframe'; 
			}
			navigator[targetName] = null;
		}
	},
	send: function(msg,targetName){
		if(this.support){
			var win = null;
			if(targetName){
				win = window.frames[targetName];
			}else{
				win = parent;
				targetName = window.name;
			}
			win.postMessage(JSON.stringify({
				name: targetName,
				msg: msg
			}),'*');
		}else{
			if(!targetName){
				targetName = window.name + 'RecvIframe';
			}else{
				targetName += 'RecvParent'; 
			}
			navigator[targetName] && navigator[targetName](msg);
		}
	}
};
module.exports = XDMessage;