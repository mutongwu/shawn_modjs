<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
<style type="text/css">

p{margin:10px;padding:20px;}
pre{font-size:120%;}
.target{max-width:300px;}
.ui_imageZoom_loading{background:url(../images/loading.gif) no-repeat 50% 50%;}
.ui_imageZoom_view{border:2px solid red;}
</style>
</head>
<body>
<P >
1.用户需要在初始化的时候，通过options更改 “大图加载中的”的样式名:loadingCls ,默认值为 ui_imageZoom_loading。<br/>
2.用户也可以修改 class为ui_imageZoom_view 的样式，来更改大图查看区域的样式。
例如：添加样式：
<pre>
        .ui_imageZoom_loading{
            background:url(../images/loading.gif) no-repeat 50% 50% #fff;
        }
        .ui_imageZoom_view{border:2px solid red;}
</pre> 
</P>
<div>
	<div id="picBox" style="padding:10px;border:1px solid green;">
		<img class="target" src="../images/Desert600.jpg" />
	</div>
	<ul id="picList">
		<li><img src="../images/Desert100.jpg" mUrl="../images/Desert600.jpg" lUrl="../images/Desert.jpg" /></li>
		<li><img src="../images/Hydrangeas100.jpg" mUrl="../images/Hydrangeas600.jpg" lUrl="../images/Hydrangeas.jpg"/></li>
		<li><img src="../images/Jellyfish100.jpg" mUrl="../images/Jellyfish600.jpg" lUrl="../images/Jellyfish.jpg" /></li>
	</ul>
</div>
<p>www.dynamicdrive.com/dynamicindex4/featuredzoomer.htm</p>
<script>
var controler = null;



require.async(['lib/jquery','util/ImageZoom'],function(jQuery,ImageZoom){
	jQuery("#picList img").click(function(){
		jQuery(".target").attr("src",this.getAttribute("mUrl"));
		if(controler){
			controler.updateImage(this.getAttribute("lUrl"));
		}
	});
	controler = new ImageZoom({
		el: jQuery(".target"),
		enableRange: true,
		lUrl: '../images/Desert.jpg'// 如果不传递大图地址，那么默认使用同一张图片。
    });
});
</script>
</body>
</html>