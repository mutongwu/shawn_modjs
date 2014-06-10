<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<jsp:include page="/dist/headRes.html"></jsp:include>
<style type="text/css">
html,body{overflow:hidden;}
.showList,.showList2 ,.showList3,.showList4{border:1px solid #ccc;margin:20px 0;}
.showList li ,.showList2 li,.showList3 li,.showList4 li{padding:5px 0;}

.my-menu li.ui-ctxMenu-item {}
.my-menu li.ui-ctxMenu-item a{font-weight: bold;color:#000000;}
.my-menu li.ui-ctxMenu-item a:hover{display:inline-block;width:100%;background-color:#ccc;}
</style> 
</head>
<body>
<div style="width:800px;backgroud-color:#ccc;margin: 0 auto;padding-top:20px; ">
	<ul class="showList">
		<li class="li-1">aaaaa</li>
		<li class="li-2">bbbb</li>
		<li class="li-3">ccccc</li>
	</ul>
	
	<ul class="showList" style="width:200px;position:absolute;right:10px;bottom:10px;">
		<li class="li-1">aaaaa</li>
		<li class="li-2">bbbb</li>
		<li class="li-3">ccccc</li>
	</ul>
	
	<ul class="showList2">
		<li class="li-1">试试</li>
		<li class="li-2" data-role="root">试试bbbb(不可删除)</li>
		<li class="li-3">试试ccccc</li>
	</ul>
	
	<ul class="showList3">
		<li class="li-1">试试</li>
		<li class="li-2">试试bbbb</li>
		<li class="li-3">试试ccccc</li>
	</ul>
	
	<ul class="showList4">
		<li class="li-1">完全自定义菜单</li>
		<li class="li-2">完全自定义菜单</li>
		<li class="li-3" data-role="tip">我就一段html文本</li>
	</ul>
</div>
<script>
	require.async(['lib/jquery','ui/ContextMenu'],function($,ContextMenu){
		
		//通用菜单
		new ContextMenu({
			el: '.showList',
			menu:[
				{text: '菜单一','cls': 'add',
						children:[
							{text: '菜单1-1'},
							{text: '菜单1-2'},
							{text: '菜单1-3'},
							{text: '菜单1-4'},
							{text: '菜单1-5'},
							{text: '菜单1-6'}
						]
				},
				{text: '菜单二','cls': 'edit',
					children:[
								{text: '菜单2-1'},
								{text: '菜单2-2'},
								{text: '菜单2-3'}
							]},
				{text: '菜单三','cls': 'delete'}
			],
			events: {
				'mouseenter': function(){
					//console.log('mouseenter:');
					//console.log('mouseenter:' + $(this).html());
				},
				'click': function(e,target){
					console.log(target.html());
					console.log($(this).html());
				}
			}
		});
		
		//菜单过滤
		new ContextMenu({
			el: '.showList2',
			menu:[
				{text: '菜单一','cls': 'add'},
				{text: '菜单二','cls': 'edit'},
				{text: '菜单三','cls': 'delete'}
			],
			beforeItemCreate: function(menuItem,target){
				//过滤
				if(target.attr("data-role") == "root" && menuItem.cls === 'delete'){
					return false;
				}
			},
			events: {
				'click': function(e,target){
					console.log(target.html());
					console.log($(this).html());
				}
			}
		});
		
		//自定义菜单项模板
		new ContextMenu({
			el: '.showList3',
			menu:[
				{text: '菜单一','cls': '','role': '游客（无图标）'},
				{text: '菜单二','cls': 'edit','role': '管理员'},
				{text: '菜单三','cls': 'delete','role': '高级管理员'}
			],
			minWidth: "200px",
			cls: 'my-menu',
			tpl: '<li class="ui-ctxMenu-item {{cls}}"><a href="javascrip:;">{{text}}-{{role}}</a></li>',
			
			events: {
				'click': function(e,target){
					console.log(target.html());
					console.log($(this).html());
				}
			}
		});
		
		//完全自定义菜单
		new ContextMenu({
			el: '.showList4',
			itemSelector: '.my-menu-item',
			//返回的html作为menu的DOM结构
			customMenu: function(target){
				//this 指向自己(ContextMenu对象)
				if(target.attr("data-role") == "tip"){
					return '<li class="my-menu-item" ><div style="width:200px;height:100px;">这是自定义的html</div></li>';
				} else{
					return ['<li class="my-menu-item">事实上1</li>',
							'<li class="my-menu-item">事实上2</li>'].join('');
				}
			},
			events: {
				'click': function(e,target){
					console.log(target.html());
					console.log($(this).html());
				}
			}
		});
	});
</script>
</body>
</html>