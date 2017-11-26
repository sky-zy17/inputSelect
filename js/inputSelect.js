$(document).ready(function(){
	$(".inputSelect_div").append('<span id="inputSelect_span_value" style="display:none"></span>')
						 .append('<span class="inputSelect_span">'+
								 	'<select class="inputSelect_select"></select>'+
							     '</span>')
						 .append('<div class="inputSelect_box"></div>');
	$(".inputSelect_input").on("focus",this,writeInput)
						   .on("focus",notBlank)
						   .on("blur",isBlank)
						   .on("input",this,writeInput)
						   .on("click",event,stopBubble)
						   .on("keydown",function(){
						   		selectP(this,event);
						   });
	$(".inputSelect_select").on("click",event,stopBubble)
							.on("click",writeInput);
	$(".inputSelect_box").on("click",event,stopBubble);
	$("body").on("click",selectBoxHide);
})
/*当前选项下标*/
var optionIndex_Current = 0;
/*存放数据，不允许id相同，否则同id只显示一个*/
var allMap = {};
var map = {};//可以不要了，准备替换
/*创建map数据*/
function appendOption(inputId,id,text){
	var count = 0;
	for(var i in allMap){//保证inputId在每个map里有且只有一个
		if(i == inputId){
			count = 1;
			break;
		}
	}
	if(count == 0){//不存在则新建，保证inputId在每个map里有且只有一个
		allMap[inputId] = {};
	}
	allMap[inputId][id] = text;//将每个输入框和各自的数据建立联系
}
/*输入的时候实时获取输入框的值，进行模糊查询*/
function writeInput(_this){
	var _this = _this.target;
	var tag;
	console.log(_this.id);
	var inputSelect_box = $(_this).parent().find(".inputSelect_box");//暂时跳过select点击
	console.log(inputSelect_box)
	//--------------------
	console.log(allMap)
	if($(_this).context.className == "inputSelect_select"){//判断时候得到this值,判断点击的是否是select
		tag = 1;		   //未得到则为下拉选触发函数，将所有值显示
		$(".inputSelect_box").toggle();//下拉选触发，则切换下拉框的可见状态
	}else{
		tag = 0;		   //得到则为input触发，模糊查询
		inputSelect_box.css("display","block");//下拉框可见
	}

	var readInput = $(_this).val();//获得输入框的值
	inputSelect_box.html("");
	for(var i in map){//此处根据遍历id而来，因此id不允许重复
		var deviceName = map[i];
		var deviceId = i;
		if(tag == 1){//下拉选及点击输入框触发，显示所有元素
			inputSelect_box.append(createOption(map[i],i));
		}else if(tag == 0){
			if(deviceName != null && deviceName.toLowerCase().indexOf(readInput.toLowerCase()) != -1){//将输入框值与所有值匹配，显示匹配值
				inputSelect_box.append(createOption(map[i],i));
			}
		}
	}
	
	$(inputSelect_box.children()[0]).css("background","#1E90FF");
	
	optionIndex_Current = 0;
}
/*输入框初始状态点击清空*/
function notBlank(){

}
/*输入框无内容返回初始状态*/
function isBlank(){

}
/*阻止事件冒泡*/
function stopBubble(e){
	if(e && e.stopPropagation()){//非IE浏览器
		e.stopPropagation();
	}else{//IE浏览器
		window.event.cancelBubble = true;
	}
}
/*滚动条滚动的距离*/
var h = 0;
/*使用键盘选择数据，上下滚动*/
function selectP(_this,event){
	var select_box_div = $(_this).next().next().next();

	var options = select_box_div.children();
	var optionSum = options.size();//当前记录总数
		
	var clientHeight = select_box_div[0].clientHeight;
	var scrollHeight = select_box_div[0].scrollHeight;

	if(event && event.keyCode == 38){//上箭头
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
 		if(x.top+9>=-18 && x.top+9<=0){//如果当前元素在最上方，再按向上箭头，则向上滚动
			h -= 18;
			select_box_div.scrollTop(h);
 		}

	}
	if(event && event.keyCode == 40){//下箭头
		$(options[0]).css("background","#fff");//呼应 打开下拉框后第一个标蓝

		if(optionIndex_Current < options.size() - 1){//如果当前元素下标已达最大，则不再增加
 			$(options[optionIndex_Current]).css("background","#fff");//当前的标白
 			optionIndex_Current++;
 			$(options[optionIndex_Current]).css("background","#1E90FF");//最新的标蓝
		}else{
			$(options[optionIndex_Current]).css("background","#1E90FF");
		}
		
 		var x = $(options[optionIndex_Current]).position();//获得相对于父元素的偏移量
 		if(x.top+9>=270 && x.top+9<=288){//如果当前元素在最下方，再按向下箭头，则向下滚动
			h += 18;
			select_box_div.scrollTop(h);
 		}
	}
	if(event && event.keyCode == 13){//回车
		var option_span = $(options[optionIndex_Current]).children();
		$(".inputSelect_input").val($(option_span[0]).text());
		$(".inputSelect_span_value").text($(option_span[1]).text());		
		//希望在没有选择选项的时候，点击输入框及下拉箭头以外区域时将第一个选项赋值给input，由此引出一个问题，即即使选择了选项，再点击输入框及下拉箭头以外区域时，仍然会将第一个选项赋值给input，所以引出如下两行代码
		$(".inputSelect_box").html("");//清空选项，只将当前值作为选项，这样第一个选项也就是当前选项
		$(".inputSelect_box").append(createOption($(option_span[0]).text(),$(option_span[1]).text()));
		
		$(".inputSelect_box").css("display","none");
	}
}
/*将选择的值赋给输入框*/
function pToInput(_this){
	var option_span = $(_this).children();
	$(".inputSelect_input").val($(option_span[0]).text());
	$(".inputSelect_span_value").text($(option_span[1]).text());
	$(".inputSelect_box").html("");
	$(".inputSelect_box").append(createOption($(option_span[0]).text(),$(option_span[1]).text()));
	$(".inputSelect_box").css("display","none");
}
/*鼠标在上方则标蓝*/
function markBlue(_this){
	var options = $(_this).parent().children();
	$(options[optionIndex_Current]).css("background","#fff");//将当前标蓝选项标白
	$(_this).css("background","#1E90FF");//将鼠标所指选项标蓝
	optionIndex_Current = $(_this).prevAll().size();//更新当前选项
}
/*鼠标移开取消标蓝*/
function cancelMarkBlue(_this){
//		console.log("mouseout");
	$(_this).css("background","#fff");
}
/*创建下拉选的选项*/
function createOption(text,id){
	return '<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)">'+
		   	   '<span class="option_text">'+text+'</span>'+
		   	   '<span class="option_value" style="display : none">'+id+'</span>'+
		   '</p>';
}
/*点击输入框及下拉箭头以外区域隐藏下拉框*/
function selectBoxHide(){
	var firstP = $($(".inputSelect_box").children()[0]).children();
	$(".inputSelect_input").val($(firstP[0]).text());
	$(".inputSelect_span_value").text($(firstP[1]).text());

	$(".inputSelect_box").css("display","none");
}