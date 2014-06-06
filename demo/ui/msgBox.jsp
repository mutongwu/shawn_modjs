<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>

<div class="pageBox">内容<%=request.getContextPath()%></div>
<div style="height: 200px;"></div>
<div style="margin-left:100px;">
<textarea id="area1" style="width: 400px; height: 100px"></textarea>
    
    <a id="abc" href="javascript:;">浮层</a>
</div>
<p>另外一个</p>
<textarea id="area2"  style="width: 400px; height: 100px"></textarea>
    
<div class="box"></div>

<input type="button" id="get" value="最简单" />
<input type="button" id="get2" value="相对元素" />
<input type="button" id="get3" value="多个弹窗" />
<input type="button" id="get4" value="按钮自定义" />
<input type="button" id="get5" value="自定义宽高" />
<input type="button" id="get6" value="载入iframe" />
<input type="button" id="get7" value="可拖动" />

<p>https://github.com/beviz/jquery-caret-position-getter/blob/master/jquery.caretposition.js
http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
http://help.dottoro.com/ljikwsqs.php
http://www.csdn.net/article/2012-12-20/2813026-nine-step-of-PM
</p>
<script>

	require.async(['lib/jquery','ui/MsgBox'],function(jQuery,MsgBox){
		jQuery(function(){		
		//基本应用
		jQuery("#get").click(function(){
			new MsgBox({
				title: "提示",
			    body:'天涯问答邀您乐活双节：我问你答天天有礼！',
			    
			    //控制按钮居中
			    buttonAlign:'tc'
			});
		});
		
		// 相对某个元素，提示定位msgBox
		jQuery("#get2").click(function(){
			new MsgBox({
		        el: jQuery('#area2'),
		        body: "数据存储数据存储失败失败据存<br/>储数据存储失败失败",
		        msgType: "error",
		        type: "none",
		        tipStyle:true,
		        fixed: false,
		        style:"color:red",
		        elPos: "mm",
		        noMod: true,
		        time: 2000
		    });
		});
		
		//更多控制
		jQuery("#get3").click(function(){
			new MsgBox({
				title: "提示",
			    msgType: 'alert',
			    noMod: true, //遮盖层
			    fixed: false,
			    type: 'alert',
			    body:'天涯问答邀您乐活双节：我问你答天天有礼！',
			    onYes: function(){
			        var an = new MsgBox({
			            title: '另外的弹出层',
			            type: 'alert',
			            body: "问题有木有？！！！",
			            mask:{
			                singleton:false
			            },
			            onBeforeClose: function(){
			            	alert('浮层被关闭。');
			            }
			        });
			        return false;
			    }
			});
		});
		
		// 自定义按钮 
		jQuery("#get4").click(function(){
			
			var msg = new MsgBox({
				title: "xxxx",
		        body: "数据存储数据存储失败失败据存<br/>储数据存储失败失败",
		        msgType: "confirm",
		        type: "none", 
		        buttons: [{
		        	text: '按钮1',
		        	event: 'click',
		        	handler: function(){
		        		alert('this:' + this.config.text);
		        		msg.close();
		        	}
		        },{
		        	text: '按钮2',
		        	event: 'mouseover',
		        	handler: function(){
		        		alert('this:' + this.config.text);
		        	}
		        }]
		    });
		});
		
		//自定义高度
		jQuery("#get5").click(function(){
			new MsgBox({
				title: "提示",
			    body:'天涯问答邀您乐活双节：我问你答天天有礼！',
			    width: 400,
			    height: 150
			});
		});
		
		jQuery("#get6").click(function(){
			new MsgBox({
				url: 'http://shawn.tianya.cn:5678/demo/ui/docType.html?_=' + Math.random(),
				title: "提示",
				body: '数据载入中...',
				animate: true,
				type: 'none',
				onIframeLoad: function(){
					alert('iframe loaded.');
				}
			});
		});
		
		jQuery("#get7").click(function(){
			new MsgBox({
				title: "提示",
				body: '数据载入中...',
				draggable: true
			});
		});
	});
	
});
</script>
</body>
</html>