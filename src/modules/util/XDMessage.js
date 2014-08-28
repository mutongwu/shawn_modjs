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
 *  	1.嵌入iframe,name=iframe1
 *  	2.new一个通讯对象：var aMsg = new XDMessage();
 *  	3.监听iframe1的信息
			aMsg.listen(function(msg){
				alert('父窗口得到:' + msg);
			},'iframe1');
		4.向iframe1发送信息：
			aMsg.send("父窗口发送：" + new Date().toLocaleString(),'iframe1');
	子页面：
		1.new一个通讯对象：var aMsg = new XDMessage();
		2.监听父页面的信息：
			aMsg.listen(function(msg){
				alert('子窗口得到:' + msg);
			});
		3.向父页面发送信息：
			aMsg.send('我是iframe1' + new Date().toLocaleString());
			
		[4].如果该页面也嵌套了iframe，name="iframe1_1"，同样可以监听它的信息：
			aMsg.listen(function(msg){
				alert('子窗口得到:' + msg);
			},'iframe1_1');
 */

function XDMessage(){
	this.init();
}
XDMessage.prototype = {
	support :'postMessage' in window,

	prefix: "",
	init: function(){
	},
	_listenOnce: false,
	_onMessage: function(handler){
		if(this._listenOnce){
			return;
		}
		window.addEventListener ? window.addEventListener("message", handler, false) :window.attachEvent &&  window.attachEvent("onmessage", handler) ;
		this._listenOnce = true;
	},

	listen: function(handler,targetName){
		if(this.support){
			this._onMessage(function(e){
				handler(JSON.parse(e.data));
			});
		}else{
			if(!targetName){
				targetName = window.name + 'RecvFrom'; 
			}else{
				targetName += 'RecvTo'; 
			}
			navigator[targetName] = handler;
		}
	},
	send: function(msg,targetName){
		var win = parent;
		if(targetName){
			win = window.frames[targetName];
		}
		if(this.support){
			win.postMessage(JSON.stringify(msg),'*');
		}else{
			if(!targetName){
				targetName = window.name + 'RecvTo';
			}else{
				targetName += 'RecvFrom'; 
			}
			navigator[targetName] && navigator[targetName](msg);
		}
	}
};
module.exports = XDMessage;