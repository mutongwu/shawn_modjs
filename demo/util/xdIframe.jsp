<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
</head>
<body>
	<script>
		var result = {"result":1,"code":0,"data":{"name": "hello中午"}};
		require.preload(['i18n/zh-CN','lib/lang'],function(res,Lang){
			Lang.setRes(res);
		});
		
		require.async(['lib/jquery','util/XDMessage'],function(jquery,XDMessage){
			var aMsg = new XDMessage();
			aMsg.send('我是iframe' + Math.random());
		});
	</script>
</body>
</html>
