<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>
<form action="xdIframe.jsp" method="POST" target="xdIframe">
<div class="pageBox">内容</div>
<div style="height: 200px;"></div>
<div style="margin-left:100px;">
<textarea id="area1" style="width: 400px; height: 100px"></textarea>
    
    <a id="abc" href="javascript:;">浮层</a>
</div>
<p>另外一个</p>
<textarea id="area2"  style="width: 400px; height: 100px" name="area2">area2222</textarea>
    
<div class="box"></div>
<input type="button" id="get" value="提交" />
<input type="button" id="get2" value="弹窗2" />
</form>
<p>https://github.com/beviz/jquery-caret-position-getter/blob/master/jquery.caretposition.js
http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
http://help.dottoro.com/ljikwsqs.php
http://www.csdn.net/article/2012-12-20/2813026-nine-step-of-PM
</p>
<iframe frameborder="0" style="display:none" name="xdIframe" id="xdIframe" src="about:blank"></iframe>
<script>

require.preload(['i18n/zh-CN','lib/lang'],function(res,Lang){
	//console.log(res)
	Lang.setRes(res);
});

/**/
require.async(['lib/jquery','util/XDMessage','jqplg/form'],function(jQuery,XDMessage){
	jQuery(function(){	
		
		var aMsg = new XDMessage();
		aMsg.listen(function(msg){
			alert('父窗口得到:' + msg);
		},'xdIframe');
		
		var url = document.location.href;
		url = url.substring(0,url.lastIndexOf('/') + 1) + $("form").attr("action");
		
		//基本应用
		jQuery("#get").click(function(){
			
			
			url = url.replace(document.domain,'shawn.duowan.com');
			/*
			jQuery.getJSON(url,function(json){
				alert(json);
			});
			return;*/
			
			$("form").attr("action",url).submit();
			
			return;
			$("form").attr("action",url).ajaxSubmit({
				"url": url,
				data: { key1: 'value1', key2: 'value2' },
				iframe: true,
				//dataType: 'json',
				success: function(json){
					alert(json)
					console.log(json)
				}
			});
		});
	});
	
});

</script>
</body>
</html>