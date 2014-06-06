<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
<style type="text/css">
[draggable] {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -khtml-user-drag: element;
  -webkit-user-drag: element;
  
}

#mydiv{width:150px;height:100px;border:1px solid #ccc;background:lightblue;position:absolute;top:305px;right:300px;}
.draggable{cursor:move;}
.dragActive{opacity:0.7;background:lightyellow;}

ul{margin-left:20px;border:1px solid #000;width:300px;height:300px;}
ul li{padding:5px;border:1px dotted blue;}
[draggable="true"] {cursor:move;}
</style>
</head>
<body>
<button id="mybutton" draggable="true">Drag me</button>
http://javascript.info/tutorial/mouse-events <br/>
http://help.dottoro.com/ljmojcxu.php <br/>
http://caniuse.com/dragndrop <br/>
https://developer.apple.com/library/mac/documentation/AppleApplications/Conceptual/SafariJSProgTopics/Tasks/DragAndDrop.html<br/>
https://thenewcircle.com/s/post/1071/html5_drag_n_drop_api<br/>
<a href="http://www.useragentman.com/blog/2010/01/10/cross-browser-html5-drag-and-drop/">http://www.useragentman.com/blog/2010/01/10/cross-browser-html5-drag-and-drop/</a>


<div id="mydiv" draggable="true">
	<h3 class="draggable" >头部</h3>
	<div>Moveable text</div>
</div>

<ul id="list">
	<li id="li1">防晒霜1</li>
	<li id="li2">防晒霜2</li>
	<li id="li3">防晒霜3</li>
	<li id="li4">防晒霜4</li>
	<li id="li5">防晒霜5</li>
</ul>

<ul id="cnt">

</ul>
<script>

	/*
		煎炒烹炖皆有定,
		酸甜苦辣尤未明 .
		形香味色斗厨艺,
		天生我才是庖丁。
		
	*/
var controler = null;
require.async(['lib/jquery','util/DragDrop'],function($,DragDrop){
		$(function(){
		    
		    var box = $('#mydiv');
		    
		    var preX = 0, preY = 0; 
		    
		    new DragDrop({
		        dragEl:  box,
		        ondragstart: function(e,data){
		            //要先转换坐标系计算为top/left!
		            box.css(box.offset());
		            
		            preX = data.x;
		            preY = data.y;
		        },
		        ondragend: function(e,data){
		            
		            box.css({
		                top: parseInt(box.css("top"),10) + data.y - preY,
		                left: parseInt(box.css("left"),10) + data.x - preX
		            });
		        }
		    });
		    //-------------------------
		    new DragDrop({
		        dragEl:  $("#list li"),
		        dropEl: $("#cnt"),
		        ondragstart: function(e,data){
		            
		            console.log("ondragstart:" + data.source)
		        },
		        ondragdrop: function(e,data){
		            console.log("ondragdrop:" + data.target && data.target.id);
		            data.target.appendChild(data.source);
		        }
		    });
		});
	
});
</script>
</body>
</html>