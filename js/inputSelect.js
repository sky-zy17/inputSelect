<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>路局用户新增设备参数</title>
<%
	String userRailWayName = (String)session.getAttribute("railWayName");
%>
<style type="text/css">
	.class_div_1 {

	}
	.class_div_2 {
		margin : 15px 5px;
		display : inline-block;
	}
	.class_textarea {
		width : 140px;
		height :120px;
	}
	.class_label {
		display : inline-block;
		width : 60px;
	}
 	.class_span {
		border : 1px;
		float : right;
		margin-left : 136px;
		width : 18px;
		overflow : hidden;
	}
 	.class_select {
		margin-left : -132px;
		width: 150px;
	}
 	#add_deviceName {
		border-right : 0px;
		position : absolute;
		width : 123px;
		right : 18px;
		top : 0;
	}
	.select_box {
		position : absolute;
		border : solid 1px #EDE7D6;
		color : #444;
		width : 150px;
		height : 270px;
		left : 63px;
		top : 22px;
		background : #fff;
		display : none;
		overflow-y : scroll;
	}
	.select_box p {
		height : 18px;
		line-height : 18px;
		text-align : left;
		width : 100%;
		background : #fff;
		margin : 0px;
	}
	.select_box p .option_text {
		padding : 0px 2px 1px;
	}
 	.select_box p:hover{
		/* background : #FDE0E5; */
		background:#1E90FF;
	}
</style>
<!-- 
	绝对定位和浮动定位
 -->
</head>
<body>
	<div style="height:100%;overflow-x: hidden;" onclick="selectBoxHide();">
		<form id="addForm" class="form-horizontal" >
			<div class="class_div_1">
				<div class="class_div_2">
					<label class="class_label">铁路局：</label>
					<select id="add_railAdmin" style="width:150px"></select>
				</div>
				<div class="class_div_2">
					<label class="class_label">铁路线：</label>
					<select id="add_railLine" style="width:150px"></select>
				</div>
			</div>
			<div class="class_div_1">
				<div class="class_div_2" style="position : relative;">
					<label class="class_label">设备名称：</label>
					<!-- <input type="text" id="add_deviceName" list="add_deviceName_select"/>
					<datalist id="add_deviceName_select" class="class_select"></datalist> -->
  					<span class="class_span">
						<!-- <select id="add_deviceName_select" class="class_select" onchange="this.parentNode.nextSibling.nextSibling.value=this.options[this.selectedIndex].text" onclick="stopBubble(event);writeInput();"></select> -->
						<select id="add_deviceName_select" class="class_select" onclick="stopBubble(event);writeInput();"></select>
					</span>
					<input type="text" id="add_deviceName" autocomplete="off" onfocus="notBlank();writeInput(this);" onblur="isBlank()" oninput="writeInput(this);" onclick="stopBubble(event);" onkeydown="selectP(this,event);"/><!-- 点击input弹出下拉框怎样做 -->
					<span id="add_deviceName_id" style="display:none"></span>
					<div class="select_box" onclick="stopBubble(event);" onscroll="divScroll(this)"></div>
				</div>
				<div class="class_div_2">
					<label class="class_label">类别：</label>
					<select id="add_parameterType" style="width:150px"></select>
				</div>
			</div>
			<div class="class_div_1">
				<div class="class_div_2">
					<label class="class_label">参数名称：</label>
					<select id="add_parameterName" style="width:150px"></select>
				</div>
				<div class="class_div_2">
					<label class="class_label">设备参数：</label>
					<input type="text" id="add_deviceParameter" style="width:140px"/>
				</div>
			</div>
			<div class="class_div_1">
				<div class="class_div_2">
					<label class="class_label">参考值：</label>
					<input type="text" id="add_reference" style="width:140px" disabled/>
				</div>
			</div>
			<div class="class_div_1">
				<div class="class_div_2">
					<label class="class_label">设置标准：</label>
					<textarea id="add_settingStandard" class="class_textarea" disabled></textarea>
				</div>
				<div class="class_div_2">
					<label class="class_label">备注：</label>
					<textarea id="add_remarks" class="class_textarea"></textarea>
				</div>
			</div>
		</form>
	</div>
</body>
<script type="text/javascript">
	//当前用户的路局名称
	var userRailWayName = "<%=userRailWayName %>";
	
	var map = {};
	
	var optionIndex_Current = 0;
	
	$("#add_parameterType").change(queryParameterName);
	$("#add_parameterName").change(queryReferenceAndSetting);
	var url = contextPath + "DeviceParameterQueryAction/queryDeviceParameterQueryList.cn";
	$.post(url,function(data){
		if(data){
			//铁路局下拉选
			for(var i=0;i<data[0].length;i++){
				if(userRailWayName == data[0][i][1]){
					$("#add_railAdmin").append("<option value='"+data[0][i][0]+"' selected >"+data[0][i][1]+"</option>")
				}else{
					$("#add_railAdmin").append("<option value='"+data[0][i][0]+"'>"+data[0][i][1]+"</option>")
				}
				
			}
			//铁路线下拉选
			$("#add_railLine").append("<option>===请选择===</option>")
			for(var i=0;i<data[1].length;i++){
				$("#add_railLine").append("<option value='"+data[1][i][0]+"'>"+data[1][i][1]+"</option>")
			}
			//设备名称下拉选
			$("#add_deviceName").val("===请选择===");
//			$("#add_deviceName_select").append("<option>===请选择===</option>")
			for(var i=0;i<data[2].length;i++){
				/* $("#add_deviceName_select").append("<option name='"+data[2][i][0]+"' value='"+data[2][i][1]+"'/>") */
//				$("#add_deviceName_select").append("<option value='"+data[2][i][0]+"'>"+data[2][i][1]+"</option>")
				map[data[2][i][0]]=data[2][i][1];
			}
			//类别下拉选
			$("#add_parameterType").append("<option>===请选择===</option>")
			for(var i=0;i<data[3].length;i++){
				$("#add_parameterType").append("<option>"+data[3][i]+"</option>")
			}
		}
	})
	/*选择类别，带出参数名称*/
	function queryParameterName(){
		var url = contextPath + "DeviceParameterQueryAction/queryDeviceParameterReleaseName.cn";
		var parameterType = $("#add_parameterType option:selected").text();
		$("#add_reference").val("");
		$("#add_settingStandard").val("");
		$.post(url,{
			parameterType : parameterType,
		},function(data){
			//参数名称下拉选
			$("#add_parameterName").empty();
			$("#add_parameterName").append("<option value='-1'>===请选择===</option>");
			for(var i=0;i<data.length;i++){
				$("#add_parameterName").append("<option value='0'>"+data[i]+"</option>");
			}
		})
	}
	/*选择参数名称，带出参考值和设置标准*/
	function queryReferenceAndSetting(){
		var url = contextPath + "DeviceParameterQueryAction/queryReferenceAndSetting.cn";
		if($("#add_parameterName option:selected").val()!=-1){
			var parameterName = $("#add_parameterName option:selected").text();
			$.post(url,{
				parameterName : parameterName,
			},function(data){
				if(data.length!=0){
					$("#add_reference").val(data[0][0]);
					$("#add_settingStandard").val(data[0][1]);
				}
			})
		}else{
			$("#add_reference").val("");
			$("#add_settingStandard").val("");
		}

	}
	//输入框点击清空
	function notBlank(){
		if($("#add_deviceName").val() == "===请选择==="){
			$("#add_deviceName").val("");
		}
	}
	//输入框无内容返回初始状态
	function isBlank(){
		if($("#add_deviceName").val()===null || $("#add_deviceName").val() == ""){
			$("#add_deviceName").val("===请选择===");
		}
	}
	/*输入的时候实时获取输入框的值，进行模糊查询*/
	function writeInput(_this){
//		var count = 0;//计划：div高度可以随着改变

		//程序复用的标志
		var tag;
		if(_this == undefined){//判断时候得到this值
			tag = 1;		   //未得到则为下拉选触发函数，将所有值显示
			console.log("yag==1");
			$(".select_box").toggle();//下拉选触发，则切换下拉框的可见状态
		}else{
			tag = 0;		   //得到则为input触发，模糊查询
			$(".select_box").css("display","block");//下拉框可见
		}
		var readInput = $(_this).val();//获得输入框的值
//		
		$(".select_box").html("");
		for(var i in map){//此处根据遍历id而来，因此id不允许重复
			var deviceName = map[i];
			var deviceId = i;
//			var size = 0;
			if(tag == 1){//下拉选及点击输入框触发，显示所有元素
				$(".select_box").append('<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)"><span class="option_text">'+map[i]+'</span><span class="option_value" style="display : none">'+i+'</span></p>');
			}else if(tag == 0){
				if(deviceName != null && deviceName.toLowerCase().indexOf(readInput.toLowerCase()) != -1){//将输入框值与所有值匹配，显示匹配值
					$(".select_box").append('<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)"><span class="option_text">'+map[i]+'</span><span class="option_value" style="display : none">'+i+'</span></p>');
				}
			}
/* 			count++;
			if(count<15){
				console.log(555555555);
				size = count*$(".select_box p").height();
		//		console.log(size);
				$(".select_box").css("height",size);
			}else{
				size = 15*$(".select_box p").height();
		//		console.log(size);
				$(".select_box").css("height",size);
			} */
		}
		
		$($(".select_box").children()[0]).css("background","#1E90FF");
		
		optionIndex_Current = 0;
		
/* 		$(".select_box").append('<p onclick="pToInput(this)"><span class="option_text">3</span><span class="option_value">3</span></p>');
		$(".select_box").append('<p onclick="pToInput(this)"><span class="option_text">4</span><span class="option_value">4</span></p>');
		$(".select_box").append('<p onclick="pToInput(this)"><span class="option_text">5</span><span class="option_value">5</span></p>'); */
	}
	/*将选择的值赋给输入框*/
	function pToInput(_this){//注意JQuery对象和DOM对象的转换
		
/*  	var x=$(_this).position();
 		alert("Top: " + x.top + " Left: " + x.left); */
		
		var option_span = $(_this).children();
//		console.log("值="+$(option_span[0]).text()+"  id="+$(option_span[1]).text());
		$("#add_deviceName").val($(option_span[0]).text());
		$("#add_deviceName_id").text($(option_span[1]).text());
		//希望在没有选择选项的时候，点击输入框及下拉箭头以外区域时将第一个选项赋值给input，由此引出一个问题，即即使选择了选项，再点击输入框及下拉箭头以外区域时，仍然会将第一个选项赋值给input，所以引出如下两行代码
		$(".select_box").html("");//清空选项，只将当前值作为选项，这样第一个选项也就是当前选项
		$(".select_box").append('<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)"><span class="option_text">'+$(option_span[0]).text()+'</span><span class="option_value" style="display : none">'+$(option_span[1]).text()+'</span></p>');
		
		$(".select_box").css("display","none");
	}
	/*点击输入框及下拉箭头以外区域隐藏  select_box下拉框*/
 	function selectBoxHide(){
//		console.log("selectBoxHide");
//		在  select_box下拉框  隐藏之前把当前第一个值赋给输入框
		var firstP = $($(".select_box").children()[0]).children();
		$("#add_deviceName").val($(firstP[0]).text());
		$("#add_deviceName_id").text($(firstP[1]).text());
		//隐藏下拉框
		$(".select_box").css("display","none");
	}
 	/*阻止事件冒泡*/
 	function stopBubble(e){
// 		console.log("onlick=stopBubble");
 		if(e && e.stopPropagation()){//非IE浏览器
 			e.stopPropagation();
 		}else{//IE浏览器
 			window.event.cancelBubble = true;
 		}
 		
 	}
 	/*按键选择数据，上下滚动*/
 	var h = 0;//滚动条，此处或许有bug
 	function selectP(_this,event){
// 		console.log("onkeydown = selectP");
// 		console.log($(_this).next().next().children());
		var select_box_div = $(_this).next().next()

 		var options = select_box_div.children();
		var optionSum = options.size();//当前记录总数
//		var clientHeight = _this.clientHeight;
 		
		var clientHeight = select_box_div[0].clientHeight;
 		var scrollHeight = select_box_div[0].scrollHeight;
 
//		console.log(options.size());
 		if(event && event.keyCode == 38){
// 			console.log("上箭头");
 			event.preventDefault();//主要是为了阻止按下向上箭头导致光标前移的情况
 			$(options[0]).css("background","#fff");//呼应 打开下拉框后第一个标蓝
 			if(optionIndex_Current > 0){//如果当前元素下标为0，则不再减少
 	 			$(options[optionIndex_Current]).css("background","#fff");//当前的标白
 	 			optionIndex_Current--;
 	 			$(options[optionIndex_Current]).css("background","#1E90FF");//最新的标蓝
 			}else{
 				$(options[optionIndex_Current]).css("background","#1E90FF");
 			}
 			
 	 		var x = $(options[optionIndex_Current]).position();//获得相对于父元素的偏移量
//	 		alert("Top: " + x.top + " Left: " + x.left);
  	 		if(x.top+9>=-18 && x.top+9<=0){//如果当前元素在最上方，再按向上箭头，则向上滚动
	 			h -= 18;
	 			select_box_div.scrollTop(h);
 	 		}

 		}
 		if(event && event.keyCode == 40){
// 			console.log("下箭头");
 			$(options[0]).css("background","#fff");//呼应 打开下拉框后第一个标蓝

 			if(optionIndex_Current < options.size() - 1){//如果当前元素下标已达最大，则不再增加
 	 			$(options[optionIndex_Current]).css("background","#fff");//当前的标白
 	 			optionIndex_Current++;
 	 			$(options[optionIndex_Current]).css("background","#1E90FF");//最新的标蓝
 			}else{
 				$(options[optionIndex_Current]).css("background","#1E90FF");
 			}
 			
 	 		var x = $(options[optionIndex_Current]).position();//获得相对于父元素的偏移量
//	 		alert("Top: " + x.top + " Left: " + x.left);
  	 		if(x.top+9>=270 && x.top+9<=288){//如果当前元素在最下方，再按向下箭头，则向下滚动
	 			h += 18;
	 			select_box_div.scrollTop(h);
 	 		}
 			
/*  			var scrollTop = clientHeight*clientHeight/scrollHeight*((optionIndex_Current)/optionSum);
 			console.log(scrollTop); */
// 			$(_this).next().next().scrollTop(scrollTop);
/*  			if(optionIndex_Current%15 == 0){
 				console.log("true");
 				console.log(optionIndex_Current)
 	 			h += 18;
 	 			
 	 			$(_this).next().next().scrollTop(h);
 			} */

 		}
 		if(event && event.keyCode == 13){
// 			console.log("回车");
 			var option_span = $(options[optionIndex_Current]).children();
// 			console.log("值="+$(option_span[0]).text()+"  id="+$(option_span[1]).text());
 			$("#add_deviceName").val($(option_span[0]).text());
 			$("#add_deviceName_id").text($(option_span[1]).text());
 			
 			//希望在没有选择选项的时候，点击输入框及下拉箭头以外区域时将第一个选项赋值给input，由此引出一个问题，即即使选择了选项，再点击输入框及下拉箭头以外区域时，仍然会将第一个选项赋值给input，所以引出如下两行代码
 			$(".select_box").html("");//清空选项，只将当前值作为选项，这样第一个选项也就是当前选项
 			$(".select_box").append('<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)"><span class="option_text">'+$(option_span[0]).text()+'</span><span class="option_value" style="display : none">'+$(option_span[1]).text()+'</span></p>');
 			
 			$(".select_box").css("display","none");
 		}
 	}
 	/*鼠标在上方则标蓝*/
 	function markBlue(_this){
// 		console.log("mouseover");
 		var options = $(_this).parent().children();
 		
//		optionIndex_Current = $(_this).prevAll().size();
 		console.log(optionIndex_Current);
 		$(options[optionIndex_Current]).css("background","#fff");//将当前标蓝选项标白
 		$(_this).css("background","#1E90FF");//将鼠标所指选项标蓝
 		optionIndex_Current = $(_this).prevAll().size();//更新当前选项
 	}
 	/*鼠标移开取消标蓝*/
 	function cancelMarkBlue(_this){
//		console.log("mouseout");
 		$(_this).css("background","#fff");
 	}
 	/*滚动条滚动事件*/
/*  function divScroll(_this){
 		console.log(777777777777);
 		var clientHeight = _this.clientHeight;
 		var offsetHeight = _this.offsetHeight;
 		var scrollHeight = _this.scrollHeight;
 		console.log(clientHeight);
 		console.log(offsetHeight);
 		console.log(scrollHeight);
// 		$(_this).scrollTop("180px");
 	} */
	
/* 	function checkList(){
		console.log(111111);
		$("#add_deviceName_select").empty();
		for(var i=0;i<10;i++){
			
			$("#add_deviceName_select").append("<option>111</option>")
		}
		
	} */
</script>
</html>