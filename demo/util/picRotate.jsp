<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
<style type="text/css">
.box_p{border:1px solid red;width:580px;background-color:#ccc;padding:10px;}
.box{padding:10px 0;border:1px solid green;
	/*display:table-cell;*/
	vertical-align:middle;
	text-align:center;
	/*width:470px;*/
}
img{max-width:450px;}
</style>
</head>
<body>
<P>
http://msdn.microsoft.com/en-us/library/ms533014(VS.85).aspx
http://samples.msdn.microsoft.com/workshop/samples/author/dhtml/DXTidemo/DXTidemo.htm
</P>
<div class="box_p">
        <div class="box">
            <img src="../images/cat.gif"/>
        </div>
        <div style="position:fixed;top:0;right:0;">
            <input type="button" value="左旋" class="rl" />
            <input type="button" value="右旋" class="rr" />
        </div>
    </div>
     <div style="height:50px;"></div>
   	<div class="box_p">
        <div class="box">
            <img src="../images/Desert.jpg"/>
        </div>
        <div style="position:fixed;top:50px;right:0;">
            <input type="button" value="左旋" class="rl" />
            <input type="button" value="右旋" class="rr" />
        </div>
    </div>
    
    <div style="height:50px;"></div>
    	<div class="box_p">
        <div class="box">
            <img src="../images/g1.gif" />
        </div>
        <div style="position:fixed;top:100px;right:0;">
            <input type="button" value="左旋" class="rl" />
            <input type="button" value="右旋" class="rr" />
        </div>
    </div> 
    <div style="height:50px;"></div>
    	<div class="box_p">
        <div class="box">
            <img src="../images/middle.jpg"/>
        </div>
        <div style="position:fixed;top:150px;right:0;">
            <input type="button" value="左旋" class="rl" />
            <input type="button" value="右旋" class="rr" />
        </div>
    </div>
    <div style="height:50px;"></div>
<script>
var controler = null;
require.async(['lib/jquery','util/PicRotate'],function(jQuery,PicRotate){
	controler = new PicRotate({
    	maxWidth: 450,
    	el: jQuery(".box img"),
    	leftCtrl: jQuery(".rl"),
    	rightCtrl: jQuery(".rr")
    	
    });
});
</script>
</body>
</html>