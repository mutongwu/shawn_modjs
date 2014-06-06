<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>

<div class="pageBox">内容</div>
<div style="height: 200px;"></div>
<div style="margin-left:100px;">
<textarea id="area1" style="width: 400px; height: 100px"></textarea>
    
    <a id="abc" href="javascript:;">浮层</a>
</div>
<p>另外一个</p>
<textarea id="area2"  style="width: 400px; height: 100px"></textarea>
    
<div class="box"></div>

<input type="button" id="get" value="弹窗1" />
<input type="button" id="get2" value="弹窗2" />

<p>https://github.com/beviz/jquery-caret-position-getter/blob/master/jquery.caretposition.js
http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
http://help.dottoro.com/ljikwsqs.php
http://www.csdn.net/article/2012-12-20/2813026-nine-step-of-PM
</p>
<script>

	require.async(['lib/jquery','ui/Mask'],function(jQuery,Mask){
		jQuery(function(){	
			//基本应用
			jQuery("#get").click(function(){
				new Mask({
					clkClose:true
				});
			});
			
			// 相对某个元素，提示定位mask
			jQuery("#get2").click(function(){
				
				new Mask({
			        el: jQuery('#area2'),
			        msg:'loading data...'
			    });
			});
		});
		
	});
</script>
</body>
</html>