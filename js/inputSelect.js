$(document).ready(function(){
	$(".inputSelect_div").append('<span id="inputSelect_span_value" style="display:none"></span>')
						 .append('<span class="inputSelect_span">'+
								 	'<select class="inputSelect_select"></select>'+
							     '</span>')
						 .append('<div class="inputSelect_box"></div>');
	$(".inputSelect_input").on("focus",function(){
								writeInput(this);
						   })
						   .on("input",function(){
						   		writeInput(this);
						   })
						   .on("click",event,stopBubble)
						   .on("keydown",function(){
						   		selectP(this,event);
						   });
						   // .on("focus",notBlank)
						   // .on("blur",isBlank);
	$(".inputSelect_span").on("click",event,stopBubble)
						  .on("click",function(){
						   	   writeInput(this);
						   });
	$(".inputSelect_box").on("click",event,stopBubble);
	// $("body").on("click",selectBoxHide);
})
/*当前选项下标*/
var all_optionIndex_Current = {};
/*存放数据，不允许id相同，否则同id只显示一个*/
var allMap = {};
/*创建map数据*/
function appendOption(inputId,value,text){
	var count = 0;
	for(var i in allMap){//有则不创建，保证inputId在每个map里有且只有一个
		if(i == inputId){
			count = 1;
			break;
		}
	}
	if(count == 0){//不存在则新建，保证inputId在每个map里有且只有一个
		allMap[inputId] = {};
	}
	allMap[inputId][value] = text;//将每个输入框和各自的数据建立联系
}
/*输入的时候实时获取输入框的值，进行模糊查询*/
function writeInput(_this){
	var tag;

	var inputSelect_input = $(_this).parent().find(".inputSelect_input")[0]
	var map = allMap[inputSelect_input.id];

	var inputSelect_box = $(_this).parent().find(".inputSelect_box");

	if($(_this).context.className == "inputSelect_span"){//判断时候得到this值,判断点击的是否是select
		tag = 1;		   //未得到则为下拉选触发函数，将所有值显示
		inputSelect_box.toggle();//下拉选触发，则切换下拉框的可见状态
	}else{
		tag = 0;		   //得到则为input触发，模糊查询
		inputSelect_box.css("display","block");//下拉框可见
	}
	var readInput = $(_this).val();//获得输入框的值
	inputSelect_box.html("");
	var option_text = "";
	var option_value = "";
	for(var i in map){//此处根据遍历id而来，因此id不允许重复
		option_text = map[i];
		option_value = i;
		if(tag == 1){//下拉选及点击输入框触发，显示所有元素
			inputSelect_box.append(createOption(map[i],i));
		}else if(tag == 0){
			if(option_text != null && option_text.toLowerCase().indexOf(readInput.toLowerCase()) != -1){//将输入框值与所有值匹配，显示匹配值
				inputSelect_box.append(createOption(map[i],i));
			}
		}
	}
	
	$(inputSelect_box.children()[0]).css("background","#1E90FF");
	
	initOptionIndex(inputSelect_input.id);
	all_optionIndex_Current[inputSelect_input.id] = 0;
}
//禁用原因：使用者根据情况自己编写
/*输入框初始状态点击清空*/
/*function notBlank(){

}*/
//禁用原因：依据现在的逻辑，不会出现为空的情况
/*输入框无内容返回初始状态*/
/*function isBlank(){

}*/
/*阻止事件冒泡*/
function stopBubble(e){
	if(e && e.stopPropagation()){//非IE浏览器
		e.stopPropagation();
	}else{//IE浏览器
		window.event.cancelBubble = true;
	}
}
/*滚动条滚动的距离*/
var allH = {};
/*使用键盘选择数据，上下滚动*/
function selectP(_this,event){

	var inputId = $(_this).context.id;

	initOptionIndex(inputId);

	var count = 0;
	for(var i in allH){//有则不创建，保证inputId在每个map里有且只有一个
		if(i == inputId){
			count = 1;
			break;
		}
	}
	if(count == 0){//不存在则新建，保证inputId在每个map里有且只有一个
		allH[inputId] = 0;
	}

	var select_box_div = $(_this).next().next().next();

	var options = select_box_div.children();
	var optionSum = options.size();//当前记录总数
		
	var clientHeight = select_box_div[0].clientHeight;
	var scrollHeight = select_box_div[0].scrollHeight;

	if(event && event.keyCode == 38){//上箭头
		event.preventDefault();//主要是为了阻止按下向上箭头导致光标前移的情况
		$(options[0]).css("background","#fff");//呼应 打开下拉框后第一个标蓝
		if(all_optionIndex_Current[inputId] > 0){//如果当前元素下标为0，则不再减少
 			$(options[all_optionIndex_Current[inputId]]).css("background","#fff");//当前的标白
 			all_optionIndex_Current[inputId]--;
 			$(options[all_optionIndex_Current[inputId]]).css("background","#1E90FF");//最新的标蓝
		}else{
			$(options[all_optionIndex_Current[inputId]]).css("background","#1E90FF");
		}
		
 		var x = $(options[all_optionIndex_Current[inputId]]).position();//获得相对于父元素的偏移量
 		if(x.top+9>=-18 && x.top+9<=0){//如果当前元素在最上方，再按向上箭头，则向上滚动
			allH[inputId] -= 18;//随着改变
			select_box_div.scrollTop(allH[inputId]);
 		}

	}
	if(event && event.keyCode == 40){//下箭头
		$(options[0]).css("background","#fff");//呼应 打开下拉框后第一个标蓝

		if(all_optionIndex_Current[inputId] < options.size() - 1){//如果当前元素下标已达最大，则不再增加
 			$(options[all_optionIndex_Current[inputId]]).css("background","#fff");//当前的标白
 			all_optionIndex_Current[inputId]++;
 			$(options[all_optionIndex_Current[inputId]]).css("background","#1E90FF");//最新的标蓝
		}else{
			$(options[all_optionIndex_Current[inputId]]).css("background","#1E90FF");
		}
		
 		var x = $(options[all_optionIndex_Current[inputId]]).position();//获得相对于父元素的偏移量
 		if(x.top+9>=270 && x.top+9<=288){//如果当前元素在最下方，再按向下箭头，则向下滚动
			allH[inputId] += 18;
			select_box_div.scrollTop(allH[inputId]);
 		}
	}
	if(event && event.keyCode == 13){//回车
		var option_span = $(options[all_optionIndex_Current[inputId]]).children();
		$(_this).val($(option_span[0]).text());
		$(_this).next().text($(option_span[1]).text());		
		//希望在没有选择选项的时候，点击输入框及下拉箭头以外区域时将第一个选项赋值给input，由此引出一个问题，即即使选择了选项，再点击输入框及下拉箭头以外区域时，仍然会将第一个选项赋值给input，所以引出如下两行代码
		$(_this).parent().find(".inputSelect_box").html("");//清空选项，只将当前值作为选项，这样第一个选项也就是当前选项
		$(_this).parent().find(".inputSelect_box").append(createOption($(option_span[0]).text(),$(option_span[1]).text()));
		
		$(_this).parent().find(".inputSelect_box").css("display","none");
	}
}
/*将选择的值赋给输入框*/
function pToInput(_this){
	var option_span = $(_this).children();
	var inputSelect_input = $(_this).parent().parent().find(".inputSelect_input");
	var option_text = $(option_span[0]).text();
	var option_value = $(option_span[1]).text();
	inputSelect_input.val(option_text);
	inputSelect_input.next().text(option_value);
	// $(_this).parent().html("");
	// $(_this).parent().append(createOption(option_text,option_value));
	$(_this).parent().css("display","none");
}
/*鼠标在上方则标蓝*/
function markBlue(_this){
	var options = $(_this).parent().children();
	var inputId = $(_this).parent().parent().find(".inputSelect_input")[0].id;

	$(options[all_optionIndex_Current[inputId]]).css("background","#fff");//将当前标蓝选项标白
	$(_this).css("background","#1E90FF");//将鼠标所指选项标蓝
	all_optionIndex_Current[inputId] = $(_this).prevAll().size();//更新当前选项
}
/*鼠标移开取消标蓝*/
function cancelMarkBlue(_this){
	$(_this).css("background","#fff");
}
/*创建下拉选的选项*/
function createOption(text,value){
	return '<p onclick="pToInput(this)" onmouseover="markBlue(this)" onmouseout="cancelMarkBlue(this)">'+
		   	   '<span class="option_text">'+text+'</span>'+
		   	   '<span class="option_value" style="display : none">'+value+'</span>'+
		   '</p>';
}
//禁用原因：无法根据具体inputId各自赋值
/*点击输入框及下拉箭头以外区域隐藏下拉框*/
/*function selectBoxHide(){
	var firstP = $($(".inputSelect_box").children()[0]).children();
	$(".inputSelect_input").val($(firstP[0]).text());
	$(".inputSelect_span_value").text($(firstP[1]).text());

	$(".inputSelect_box").css("display","none");
}*/
/*初始化当前选项下标*/
function initOptionIndex(inputId){
	var count = 0;
	for(var i in all_optionIndex_Current){//有则不创建，保证inputId在每个map里有且只有一个
		if(i == inputId){
			count = 1;
			break;
		}
	}
	if(count == 0){//不存在则新建，保证inputId在每个map里有且只有一个
		all_optionIndex_Current[inputId] = 0;
	}
}
/*返回value和text值*/
function inputSelectUtil(inputId){
	this.inputId = "#"+inputId;
	this.getValue = function(){
		return $(this.inputId).next().text();
	}
	this.getText = function(){
		return $(this.inputId).val();
	}
}