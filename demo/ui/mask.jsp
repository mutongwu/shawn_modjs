<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>
<style>

	.longPage{height:500px;}
</style>
<div class="pageBox">内容</div>
<div style="height: 200px;"></div>
<div style="margin-left:100px;">
    <a id="abc" href="javascript:;">浮层</a>
</div>
<textarea id="area2"  style="width: 400px; height: 100px"></textarea>
  
<p>另外一个</p>
<select>
	<option>ie6</option>
</select>
<div class="box longPage"><input type="button" id="get3" value="修改页面高度" /></div>

<input type="button" id="get" value="弹窗1" />
<input type="button" id="get2" value="弹窗2" />
<select>
	<option>ie6</option>
</select>
<p>https://github.com/beviz/jquery-caret-position-getter/blob/master/jquery.caretposition.js
http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
http://help.dottoro.com/ljikwsqs.php
http://www.csdn.net/article/2012-12-20/2813026-nine-step-of-PM
</p>
<script>
require.preload(['i18n/zh-CN','lib/lang'],function(res,Lang){
	console.log(res)
	Lang.setRes(res);
});
	require.async(['lib/jquery','ui/Mask'],function(jQuery,Mask){
		jQuery(function(){	
			//基本应用
			jQuery("#get").click(function(){
				new Mask({
					clkClose:true
					//,loading:false
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
		
		$('#get3').click(function(){
			$('.box').toggleClass("longPage");
		})
	});
	
	
</script>
</body>
</html>