<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>
<div style="width:800px;backgroud-color:#ccc;margin:50px auto 0; ">
	示例1：<input type="text" style="width:200px;height:28px;paddding:2px;" id="search" />
	
	<div id="p1" style="height:130px;background:lightblue;">
	</div>
	
	示例2：<input type="text" style="width:200px;height:28px;paddding:2px;" id="search2" />
	<div id="p2" style="height:130px;background:lightblue;">
	</div>
</div>
<script>
require.preload(['i18n/zh-CN','lib/lang'],function(res,Lang){
	Lang.setRes(res);
});	
		require.async(['lib/jquery','ui/PageBar'],function(jQuery,PageBar){
			jQuery(function(){
					var p1 = new PageBar({
						el: jQuery('#p1'),
						totalNum: 250
					});
				
				var p2 = new PageBar({
					el: jQuery('#p2'),
					totalNum: 250,
					page: 10,
					align:"tr",
					jumpTo: false
				});
			});
	});
</script>
</body>
</html>