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
	<div style="height:130px;background:lightblue;"><hr/></div>
	
	示例2：<input type="text" style="width:200px;height:28px;paddding:2px;" id="search2" />
</div>
<script>
	
		require.async(['lib/jquery','ui/DatePicker'],function(jQuery,DatePicker){
			jQuery(function(){
				var searchInput = new DatePicker({
					el: jQuery('#search')
				});
				
				var searchInput2 = new DatePicker({
					el: jQuery('#search2'),
					hasTime:true,
					format: 'YYYY-MM-DD hh:mm:ss'
				});
				
			});
	});
</script>
</body>
</html>