//格式时间
function getTime(inputTime) {
    var y,m,d;
    if(inputTime) {
        y = inputTime.slice(0,4);
        m = inputTime.slice(4,6);
        d = inputTime.slice(6,8);
        return y+'年'+m+'月'+d+'日 '+inputTime.slice(8,10)+":"+inputTime.slice(10,12)+":"+inputTime.slice(12,14);
    }
}
//格式时间
function getTime1(inputTime) {
    var y,m,d;
    if(inputTime) {
        y = inputTime.slice(0,4);
        m = inputTime.slice(4,6);
        d = inputTime.slice(6,8);
        return y+'年'+m+'月'+d+'日 ';
    }
}
$().ready(function(){
    var orderId = $('#orderId').val();
    var orderState = $('#orderState').val();
    $("#tdTotal").text(parseFloat($("#tdFee").text())+parseFloat($("#proSum").text()));
    $("#YHJE").text(parseFloat($("#tdFee").text())+parseFloat($("#proSum").text()));
    var artificial = document.getElementById("artificial");
    var Loan = document.getElementById("Loan");
    if(orderState == 3 ){
        artificial.style.display="block";
    };
    if(orderState == 4){
        artificial.style.display="block";
    };
    if(orderState == 5 || orderState == 6){
        artificial.style.display="block";
        Loan.style.display="block";
    };

    var paramMap = {};
    paramMap.customerId = $('#customerId').val();
   // paramMap.type = '1';
    paramMap.orderId = orderId;
    //paramMap.salesmanId = $('#salesmanId').val();
    Comm.ajaxPost("customer/customerDetailsSP",JSON.stringify(paramMap),function(result){
        var data = result.data;
        if(data){
            var linkmanList=data.linkmanList;//联系人信息
            var host = data.hostUrl;//url
            var order = data.order;//订单信息
            var customer = data.customer;//客户信息
            var orderAndbank= data.orderAndbank;//订单信息和银行卡信息
            var apiResultList= data.apiResultList;//风控审核信息
            var orderOperationRecord= data.orderOperationRecord;//订单操作记录审核信息
            var loanRecord= data.loanRecord;//订单操作记录放款信息
            var imageList = data.imgList;//上传资料
            var repayList = data.repayList;//还款计划信息

        }

        if ("undefined" != typeof(repayList) && repayList.length > 0){
            //还款计划信息列表
            var html = '';
            $("#repayList").empty();
            html +='<thead>'+
            '<tr>'+
            '<td>期数</td>'+
            '<td>还款状态</td>'+
            '<td>起息日</td>'+
            '<td>预计还款时间</td>'+
            '<td>实际还款时间</td>'+
            '<td>应还金额</td>'+
            '<td>已还金额</td>'+
            '<td>应还本金</td>'+
            '<td>已还本金</td>'+
            '<td>利息</td>'+
            '<td>实际还款利息</td>'+
            '<td>还款类型</td>'+
            '<td>逾期天数</td>'+
            '<td>逾期利息</td>'+
            '<td>更新时间</td>'+
            '</tr>'+
            '</thead>'+
            '<tbody>';
            for(var i=0;i<repayList.length;i++){
                html += '<tr>'+
                    '<td>'+repayList[i].period+'</td>'+
                    '<td>'+changeState(repayList[i].status)+'</td>'+
                    '<td>'+formatDate(repayList[i].interestStartTime)+'</td>'+
                    '<td>'+formatDate(repayList[i].repaymentTime)+'</td>'+
                    '<td>'+formatDate(repayList[i].repaymentYesTime)+'</td>'+
                    '<td>'+repayList[i].repaymentAccount+'</td>'+
                    '<td>'+repayList[i].repaymentYesAccount+'</td>'+
                    '<td>'+repayList[i].capital+'</td>'+
                    '<td>'+repayList[i].yesCapital+'</td>'+
                    '<td>'+repayList[i].interest+'</td>'+
                    '<td>'+repayList[i].repaymentYesInterest+'</td>'+
                    '<td>'+changeTypeState(repayList[i].repaymentType)+'</td>'+
                    '<td>'+repayList[i].lateDays+'</td>'+
                    '<td>'+repayList[i].lateInterest+'</td>'+
                    '<td>'+formatDate(repayList[i].updateTime)+'</td>'+
                    '</tr>';
            }
            html +='</tbody>';
            $("#repayList").append(html);
        }

        if(order){
            //$("#applayTime").text(formatTime(order.applayTime));//审核时间
            $("#payBackUser").html(order.payBackUser);//还款用户
            $("#payBackCard").html(order.payBackCard);//还款账号
        }


        //订单操作记录信息
        if(orderOperationRecord){
            var operationResult="";
            var number = orderOperationRecord.operationResult;
            if (number == 1){
                operationResult="提交";
            }else if(number == 2){
                operationResult="通过";
            }else if(number == 3){
                operationResult="拒绝";
            }else if(number == 4){
                operationResult="回退";
            }else if(number == 5){
                operationResult="同意";
            }else if(number == 6){
                operationResult="放弃";
            }else if(number == 7){
                operationResult="放款";
            }

            $("#amount").html(orderOperationRecord.amount);//金额
            $("#operationResult").html(operationResult);//审核结果
            $("#empName").text(orderOperationRecord.empName);//审核人员
            $("#operationTime").text(formatTime(orderOperationRecord.operationTime));//审核时间
            $("#description").text(orderOperationRecord.description);//审核意见

        }

        //订单放款信息
        if(loanRecord){
            var loanState="";
            var number = loanRecord.operationResult;
            if (number == 1){
                loanState="提交";
            }else if(number == 2){
                loanState="通过";
            }else if(number == 3){
                loanState="拒绝";
            }else if(number == 4){
                loanState="回退";
            }else if(number == 5){
                loanState="同意";
            }else if(number == 6){
                loanState="放弃";
            }else if(number == 7){
                loanState="放款";
            }

            $("#loanAmount").html(loanRecord.amount);//放款金额
            $("#loanTime").text(formatTime(loanRecord.operationTime));//放款时间
            $("#loanState").html(loanState);//放款状态
        }
        if("undefined" != typeof(linkmanList)){
            //联系人信息
            var html = '';
            $("#relation").empty();
            for(var i=0;i<linkmanList.length;i++){
                var rel = linkmanList[i].mainSign;
                var yesno = "";
                html=html+ '<tr>'+
                    '<td width="10%" >关&emsp;&emsp;系：</td>'+
                    '<td width="23%">'+linkmanList[i].relationshipName+'</td>'+
                    '<td width="10%" >名&emsp;&emsp;称：</td>'+
                    '<td width="23%">'+linkmanList[i].linkName+'</td>'+
                    '<td width="10%" >联系方式：</td>'+
                    '<td width="23%">'+linkmanList[i].contact+'</td>'+
                    '</tr>';

            }
            $("#relation").html('');//直系
            $("#relation").append(html);//直系
        }
        if("undefined" != typeof(linkmanList)){
            //联系人信息
            var html = '';
            $("#relation").empty();
            for(var i=0;i<linkmanList.length;i++){
                var rel = linkmanList[i].mainSign;
                var yesno = "";
                html=html+ '<tr>'+
                    '<td width="10%" >关&emsp;&emsp;系：</td>'+
                    '<td width="23%">'+linkmanList[i].relationshipName+'</td>'+
                    '<td width="10%" >名&emsp;&emsp;称：</td>'+
                    '<td width="23%">'+linkmanList[i].linkName+'</td>'+
                    '<td width="10%" >联系方式：</td>'+
                    '<td width="23%">'+linkmanList[i].contact+'</td>'+
                    '</tr>';

            }
            $("#relation").html('');//直系
            $("#relation").append(html);//直系
        }

        /*审核图片吗*/
        if(imageList){
            var  showImg="";
            if(imageList.length > 0) {
                if(imageList.length < 5){
                    showImg +=" <tr>";
                    showImg +="<td class=\"tdTitle align\" id=\"showNewImg1\" style=\"text-align: left\" colspan=\"3\">\n" +
                        "<ul style=\"text-align: left;\">";
                    for (var i=0; i<imageList.length; i++){
                        var image=imageList[i];
                        showImg+='<li><div style="width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto" class="imgbox"><img style="width: 100%;" src="'+image.imgUrl+'" class="imgShow"></div><p class="hideTime" style="margin:1em;"></p></li>';
                    }
                    showImg +="</ul></td>";
                    showImg +="</tr>";
                }
                if(imageList.length > 4){
                    showImg +=" <tr>";
                    showImg +="<td class=\"tdTitle align\" id=\"showNewImg1\" style=\"text-align: left\" colspan=\"3\">\n" +
                        "<ul style=\"text-align: left;\">";
                    for (var i=0; i < 4; i++){
                        var image=imageList[i];
                        showImg+='<li><div style="width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto" class="imgbox"><img style="width: 100%;" src="'+image.imgUrl+'" class="imgShow"></div><p class="hideTime" style="margin:1em;"></p></li>';
                    }
                    showImg +="</ul></td>";
                    showImg +="</tr>";
                    showImg +=" <tr>";
                    showImg +="<td class=\"tdTitle align\" id=\"showNewImg2\" style=\"text-align: left\" colspan=\"3\"><ul style=\"text-align: left;\">";
                    for (var i= 4; i<imageList.length; i++){
                        var image=imageList[i];
                        showImg+='<li><div style="width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto" class="imgbox"><img style="width: 100%;" src="'+image.imgUrl+'" class="imgShow" ></div><p class="hideTime" style="margin:1em;"></p></li>';
                    }
                    showImg +="</ul></td>";
                    showImg +="</tr>";
                }
            }
            $("#yxtup").html(showImg);
            PostbirdImgGlass.init({
                domSelector:".imgbox img",
                animation:true
            });
        }

        //数据写入隐藏域
        $("#orderId").val(orderId);


        if ("undefined" != typeof(apiResultList)){
            //风控信息审核列表
            var html = '';
            $("#apiResult").empty();
            for(var i=0;i<apiResultList.length;i++){
                html=html+ '<tr>'+
                    '<td width="10%" >规则名称：</td>'+
                    '<td width="23%">'+apiResultList[i].sourceChildName+'</td>'+
                    '<td width="10%" >审核结果：</td>'+
                    '<td width="23%">'+apiResultList[i].message+'</td>'+
                    '<td width="10%" >报告浏览：</td>'+
                    '<td width="23%"> <a href="../customerAudit/tongDunView?resultId='+apiResultList[i].apiResultId+'&customerId='+ paramMap.customerId +'&sourceCode='+ apiResultList[i].sourceCode +'" target="_blank" style="color: #f1a02f">查看报告</a></td>'+
                    '</tr>';

            }
            $("#apiResult").append(html);
        }
    }, "application/json",null,null,null,false);




});

//还款状态转化
function changeState(repayState){
    var repayStateNum=Number(repayState);
    var repayStateStr;
    switch (repayStateNum) {
        case 1://还款中
            repayStateStr = "还款中";
            break;
        case 2://还款处理中
            repayStateStr ="还款处理中";
            break;
        case 3://已还款
            repayStateStr = "已还款";
            break;
        default:
            repayStateStr = "";
            break;
    }
    return repayStateStr;
}


//还款类型状态转化
function changeTypeState(repayTypeState){
    var repayTypeStateNum=Number(repayTypeState);
    var repayTypeStateStr;
    switch (repayTypeStateNum) {
        case 0://未还款
            repayTypeStateStr = "未还款";
            break;
        case 1://正常还款
            repayTypeStateStr ="正常还款";
            break;
        case 2://提前还款
            repayTypeStateStr = "提前还款";
            break;
        case 3://部分提前还款
            repayTypeStateStr = "部分提前还款";
            break;
        case 4://逾期还款
            repayTypeStateStr = "逾期还款";
            break;
        case 5://逾期未还
            repayTypeStateStr = "逾期未还";
            break;
        default:
            repayTypeStateStr = "";
            break;
    }
    return repayTypeStateStr;
}


function formatDate(time){
    if(time){
        var date = new Date(time);

        var year = date.getFullYear();
        var month = (date.getMonth() + 1) + "";
        var day = date.getDate() + "";
        month = getSupplementString(month, 2);
        day = getSupplementString(day, 2);
        return year + "-" + month + "-" + day;
    }
    return "";
}

/**
 * 格式化指定长度的字符不足在前补0
 * @param str : 待处理字符串
 * @param len ： 指定长度
 * @returns {String}
 */
function getSupplementString(str, len) {
    while(str.length < len) {
        str = "0" + str;
    }
    return str;
}

function clickNextButton(){
    layerIndex = layer.open({
        type : 1,
        title : "产品信息",
        maxmin : true,
        shadeClose : false, //点击遮罩关闭层
        area : [ '500px', '' ],
        content : $('#preQuotaDialog'),
        btn : [ '提交', '取消' ],
        yes:function(index, layero){
            var orderId = $("#orderId").val();
            //var amount =parseInt($("#RateOfPayGel").val());
            var approveSuggestion = $("#preQuotaDialog_remark").val();
            var owerLimit=parseInt ($("#LowerLimit").val());
            var upperLimit = $("#UpperLimit").val();
            var taskNodeId =  $("#taskNodeId").val();
            var customerId = $("#customerId").val();
            //Comm.ajaxPost('customerAudit/approved',JSON.stringify({id:orderId,credit:amount,precredit:amount,approveSuggestion:approveSuggestion,customerId:customerId,taskNodeId:taskNodeId})
            Comm.ajaxPost('customerAudit/approved',JSON.stringify({id:orderId,approveSuggestion:approveSuggestion,customerId:customerId,taskNodeId:taskNodeId}) , function (result) {
                layer.msg(result.msg,{time:2000},function(){
                    // layer.closeAll();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.g_userManage.tableOrder.ajax.reload();
                    parent.layer.close(index)
                })
            },"application/json");
        }
    })
}
function reasonClick(){
    var orderId = $("#orderId").val();
    layerIndex = layer.open({
        type : 1,
        title : "拒绝",
        maxmin : true,
        shadeClose : false, //点击遮罩关闭层
        area : [ '500px', '' ],
        content : $('#approvalRefused'),
        btn : [ '提交', '取消' ],
        yes:function(index, layero){
            var orderId = $("#orderId").val();
            var approveSuggestion = $("#remark").val();
            var userId =  $("#userId").val();
            var taskNodeId =  $("#taskNodeId").val();
            if(! approveSuggestion){
                layer.msg("拒绝原因不能为空");
                return;
            }
            var customerId = $("#customerId").val();
            Comm.ajaxPost('customerAudit/approvalRefused',JSON.stringify({id:orderId,approveSuggestion:approveSuggestion,customerId:customerId,userId:userId,taskNodeId:taskNodeId}) , function (result) {
                layer.msg(result.msg,{time:2000},function(){
                    // layer.closeAll();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.g_userManage.tableOrder.ajax.reload();
                    parent.layer.close(index)
                })
            },"application/json");
        }
    })
}
//获取当前时间
function getFirstTime() {
    var time;
    var newData=new Date();
    var N=newData.getFullYear();
    var s=newData.getMonth()+1;
    var Y=s<=9?"0"+s:s;
    var r=newData.getDate();
    var D=r<=9?"0"+r:r;
    var h=newData.getHours();
    var H=h<=9?"0"+h:h;
    var m=newData.getMinutes();
    var M=m<=9?"0"+m:m;
    var a=newData.getSeconds();
    var S=a<=9?"0"+a:a;
    return time=N+"-"+Y+"-"+D+" "+H+":"+M+":"+S;
}

//收缩目录
function shrink(me){
    $(me).nextAll().slideToggle();
}

function showImg(t) {
    $("#seeImg").attr('src',$(t)[0].src);
    layer.open({
        type : 1,
        title : "图片查看",
        maxmin : true,
        shadeClose : true, //点击遮罩关闭层
        area : [ '630px', '650px'  ],
        content : $('#showImg'),})

}


//刷新还款计划
function refreshRepayment(orderNo,customerId) {

    var param = {};
    param.orderNo = orderNo;
    param.customerId = customerId;
    Comm.ajaxPost('repayment/getRepaymentListByProjectId',JSON.stringify(param), function (data) {
        if(data){
            //parent.g_userManage.tableOrder.ajax.reload();
            location.reload();
        }
    },"application/json")
}