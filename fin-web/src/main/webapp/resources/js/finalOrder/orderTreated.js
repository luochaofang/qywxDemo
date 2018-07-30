var g_userManage = {
    tableOrder : null,
    currentItem : null,
    fuzzySearch : false,
    getQueryCondition : function(data) {
        var paramFilter = {};
        var page = {};
        var param = {};
        param.userId=userId;
        param.state = '6';//人工终审
        //param.tache = '1';

        if (g_userManage.fuzzySearch) {
            param.customerName = $("input[name='customerName']").val();//客户名称
            param.card = $("input[name='card']").val();//身份证号
            param.tel = $("input[name='tel']").val();//手机号码
            param.orderNo = $("input[name='orderNo']").val();//订单编号
            var beginTime = $("#beginTime").val();
            if(beginTime != null && beginTime != ''){
                param.beginTime = beginTime.replace(/[^0-9]/ig,"");//字符串去除非数字
            }
            var endTime = $("#endTime").val();
            if(endTime != null && endTime != ''){
                param.endTime = endTime.replace(/[^0-9]/ig,"");//字符串去除非数字
            }
        }
        paramFilter.param = param;
        page.firstIndex = data.start == null ? 0 : data.start;
        page.pageSize = data.length  == null ? 10 : data.length;
        paramFilter.page = page;
        return paramFilter;
    }
};
$(function (){
    var beginTime = {
        elem: '#beginTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: '1999-01-01 00:00:00',
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: false,
        choose: function(datas){
            endTime.min = datas; //开始日选好后，重置结束日的最小日期
            endTime.start = datas //将结束日的初始值设定为开始日
        }
    };
    var endTime = {
        elem: '#endTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: '1999-01-01 00:00:00',
        max: laydate.now(),
        istime: true,
        istoday: false,
        choose: function(datas){
            beginTime.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    laydate(beginTime);
    laydate(endTime);
    if(g_userManage.tableOrder){
        g_userManage.tableOrder.ajax.reload();
    }else{
        g_userManage.tableOrder = $('#order_list').dataTable($.extend({
            'iDeferLoading':true,
            "bAutoWidth" : false,
            "Processing": true,
            "ServerSide": true,
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bLengthChange": false,
            "dom": 'rt<"bottom"i><"bottom"flp><"clear">',
            "ajax" : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
                var queryFilter = g_userManage.getQueryCondition(data);
                Comm.ajaxPost('customerAudit/alreadyList', JSON.stringify(queryFilter), function (result) {
                    var returnData = {};
                    var resData = result.data.list;
                    var resPage = result.data;
                    returnData.draw = data.draw;
                    returnData.recordsTotal = resPage.total;
                    returnData.recordsFiltered = resPage.total;
                    returnData.data = resData;
                    callback(returnData);
                },"application/json");
            },
            "order": [],
            "columns": [
                {"data": null ,"searchable":false,"orderable" : false},
                {"data": "customerName","orderable" : false},
                {"data": "orderNo","orderable" : false},
                {"data": "tel","orderable" : false},
                {"data": "productNameName","orderable" : false},
                {"data": "periods","orderable" : false},
                {"data": "state","orderable" : false,
                    "render": function (data, type, row, meta) {
                        if(data=='4'){
                            return "接受申请贷款";
                        }else if(data == '5'){
                            return "人工初审";
                        }else if(data=='6'){
                            return "人工终审";
                        }else{
                            return "";
                        }
                    }
                },
                {"data": "tache","orderable" : false,
                    "render": function (data, type, row, meta) {
                        if(data=='1'){
                            return "通过";
                        }else if(data == '0'){
                            return "拒绝";
                        }else{
                            return "";
                        }
                    }
                },
                {"data": "creatTime","orderable" : false,
                    "render": function (data, type, row, meta) {
                        return formatTime(data);
                    }
                },
                {
                    "data": "null", "orderable": false,
                    "defaultContent":""
                }
            ],"createdRow": function ( row, data, index,settings,json ) {
                var btn=$('<a class="tabel_btn_style"  style="text-decoration: none;color: #307ecc;" onclick="auditOrder(\''+data.id+'\',\''+data.customerId+'\',0)">查看</a>');
                return $("td", row).eq(9).append(btn);
            },
            "initComplete" : function(settings,json) {
                //全选
                $("#checkBox_All").click(function(J) {
                    if (!$(this).prop("checked")) {
                        $("#order_list tbody tr").find("input[type='checkbox']").prop("checked", false)
                    } else {
                        $("#order_list tbody tr").find("input[type='checkbox']").prop("checked", true)
                    }
                });
                //搜索
                $("#btn_search").click(function() {
                    g_userManage.fuzzySearch = true;
                    g_userManage.tableOrder.ajax.reload();
                });
                //重置
                $("#btn_search_reset").click(function() {
                    $("input[name='customerName']").val("");
                    $("input[name='card']").val("");
                    $("input[name='tel']").val("");
                    $("input[name='orderNo']").val("");
                    $("#beginTime").val("");
                    $("#endTime").val("");
                    g_userManage.fuzzySearch = false;
                    g_userManage.tableOrder.ajax.reload();
                });
                //只看自己
                $("#onlyMe").click(function() {
                    if($("#onlyMe").attr("checked")){
                        g_userManage.fuzzySearch = true;
                    }else{
                        g_userManage.fuzzySearch = false;
                    }
                    g_userManage.tableOrder.ajax.reload();
                });
            }
        }, CONSTANT.DATA_TABLES.DEFAULT_OPTION)).api();
        g_userManage.tableOrder.on("order.dt search.dt", function() {
            g_userManage.tableOrder.column(0, {
                search : "applied",
                order : "applied"
            }).nodes().each(function(cell, i) {
                cell.innerHTML = i + 1
            })
        }).draw();
    }
});
function auditOrder(orderId,customerId,sing){
    $("#customerId").val(customerId);
    $("#orderId").val(orderId);
    layer.open({
        type : 1,
        title : '审核订单及客户资料',
        shadeClose : false,
        area : [ '100%', '100%' ],
        content : $('#container'),
        btn : [ '取消' ],
        success : function(index, layero) {
            Comm.ajaxPost("customerAudit/getOrderById",orderId,function(result){
                var orderData = result.data;
                var score = orderData.scoreCard;
                if(score) {
                    score = JSON.parse(score);
                    var inlists = score.data[0].resultJson[0].inFields;
                    var html='';
                    var totalScore=0;
                    var phoneTimeScore=0;
                    for (var i=0;i<inlists.length;i++) {
                        if(inlists[i].fieldName=="手机在网时长"){
                            phoneTimeScore=inlists[i].calcValue;
                        }else{
                            html+='<tr>';
                            html+='<td>'+inlists[i].fieldName+'</td>';
                            html+='<td>'+inlists[i].calcValue+'</td>';
                            html+='</tr>';
                        }
                    }
                    html+='<tr rowspan="3">';
                    html+='<td>手机号码实名是否一致</td>';
                    html+='<td>30</td>';
                    html+='</tr>';
                    html+='<tr>';
                    html+='<td>手机在网时长</td>';
                    html+='<td>'+phoneTimeScore+'</td>';
                    html+='</tr>';
                    html+='<tr>';
                    html+='<td>鹏元学历</td>';
                    html+='<td>10</td>';
                    html+='</tr>';
                    $('#scoreCardBody').empty();
                    $('#scoreCardBody').append(html);
                    $('#totalscore').html(score.score);
                    getNothing(customerId);
                }
                $("#scoreCard").text(score.score);//信用评分
                $("#precredit").text(orderData.precredit);//预授信金额
                //初审授信金额
                var firstCredit = orderData.firstCredit;
                $('#giveAmount').val(firstCredit);//授信金额
                $('#paymentRatio').text(orderData.paymentRatio);//付款比例
                //终审授信金额
                var endCredit = orderData.endCredit;
                $('#finalgiveAmount').val(endCredit);//授信金额
                //客户情况简述备注
                $('#customerRemark').val(orderData.customerRemark);
                //合理性判断
                $("#merchantId").val(orderData.merchantId);//商户id
                $("#merchantNameHidden").val(orderData.merchantName);//商户名称
                $("input[name=ReasonableInput_fitment]").val(orderData.merchantName);//商户名称
                $("input[name=ReasonableInput_fitment_money]").val(orderData.predictPrice);//预授信金额
                $("#provincesId").val(orderData.provincesId)//额度匹配省id
                $("#cityId").val(orderData.cityId)//额度匹配市id
                //贷款明细
                $("#proType").val(orderData.productTypeName);//产品类型
                $("#proApproval").val(orderData.manager);//当前审批人
                $("#proLoan").val(orderData.orderNo);//贷款号
                $("#proState").val("借款申请");//状态(审核的是借款申请的订单的表)
                $("#proTel").val(orderData.tel);//手机号码
                $("#proApplytime").val(formatTime(orderData.creatTime));//申请时间
                $("#proSum").val(orderData.applayMoney);//申请金额
                $("#proDeadline").val(orderData.periods);//申请期限
                $("#gpsAdress").val(orderData.bak);//定位地址
                var personList,linkmanList,jobList,propertyList,imageList,host,orderImageList;
                Comm.ajaxPost("customer/customerDetailsSP",orderData.customerId,function(result){
                    console.log(result);
                    var data = result.data;
                    host = data.host;//上下文
                    console.log(data);
                    $('#host').val(host);
                    personList=data.personList[0];//个人信息
                    linkmanList=data.linkmanList;//联系人信息
                    jobList=data.jobList[0];//工作信息
                    propertyList=data.propertyList[0];//房产信息
                    imageList=data.imageList;//上传资料
                    console.log(imageList);
                    showCumIng(imageList,host);
                }, "application/json",null,null,null,false);
                //查询该订单下的审核人员上传的图片信息
                Comm.ajaxPost("customerAudit/imgDetails",orderData.id,function(result){
                    var data = result.data;
                    console.log(data);
                    orderImageList=data.imageList;//上传资料
                    showOrderImgList(orderImageList);
                }, "application/json");
                Comm.ajaxPost("customer/findOne",orderData.customerId,function(result){
                    var customer = result.data;
                    if(customer && customer.cardType){
                        $("#bank_card").val(customer.cardType);//银行卡号
                    }
                }, "application/json");
                //申请人信息
                $("#applyName").val(orderData.customerName);//姓名
                $("#applyIdcard").val(orderData.card);//身份证号码
                if(personList){
                    $("#applyMerry").val(personList.marry_name);//婚姻状况
                    $("#applyCensus").val(personList.residence);//户籍
                    $("#applyAddr").val(personList.live_address);//当前住址

                    //$("#bank_card").val(personList.bank_card);//银行卡号
                    /*$("#account_city").val(personList.account_city);//开户地址
                     $("#account_bank").val(personList.account_bank);//开户银行*/

                    $("#education").val(personList.educational_name);//学历
                }
                //待装修房产信息
                if(propertyList){
                    $("#limitName").val(propertyList.cellName);
                    $("#houseArea").val(propertyList.proArea);//房产面积
                    $("#houseFrame").val(propertyList.structure);//户型结构
                    $("#housePurcha").val(propertyList.method);//购买方式
                    $("#houseAddr").val(propertyList.proAddress);//房产地址
                    $("#houseBank").val(propertyList.mortgageBank);//按揭银行
                    $("#houseSum").val(propertyList.amount);//月供金额
                    $("#houseDone").val(propertyList.year + "年" + propertyList.month + "月");// 已按揭___年___月
                }
                amountBtn();
                //单位信息
                if(jobList){
                    $("#unitName").val(jobList.companyName);//单位名称
                    $("#unitPro").val(jobList.companyProperty);//单位性质
                    $("#unitTel").val(jobList.companyPhone);//单位电话
                    var unitAddr=jobList.companyAddress+jobList.address;
                    $("#unitAddr").val(unitAddr.replace(/\//g, ''));//单位地址
                    $("#unitDepart").val(jobList.department);//部门
                    $("#unitGrade").val(jobList.posLevel);//职级
                    if(jobList.hiredate){
                        hiredate=jobList.hiredate.substring(0,4)+"-"+jobList.hiredate.substring(4,6)+"-"+jobList.hiredate.substring(6,8)
                    }else{
                        hiredate='';
                    }
                    $("#unitYear").val(hiredate);//现单位入职时间/注册时间
                    $("#unitDeliverty").val(jobList.payType);//工资发放形式
                    $("#unitIncome").val(jobList.monthIncome);//月收入
                    $("#unitDay").val(jobList.monthPayday);//发薪日
                    $("#unitSocial").val(jobList.fundSocialsec);//是否缴纳公积金及社保
                }
                //联系人信息
                if(linkmanList){
                    for(var i=0;i<linkmanList.length;i++){
                        var rel=linkmanList[i].mainSign;//关系
                        if(rel=="0"){//直系
                            $("#directName").val(linkmanList[i].linkName);//姓名(直系)
                            $("#directRel").val(linkmanList[i].relationshipName);//关系名称
                            $("#directUnit").val(linkmanList[i].workCompany);//工作单位
                            $("#directTel").val(linkmanList[i].contact);//联系电话
                            $("#knownLoanName").html(linkmanList[i].knownLoanName);//是否知晓此借款
                        }else{//同事
                            if(rel=="1"){
                                $("#workerName").val(linkmanList[i].linkName);//姓名(同事)
                                $("#workerDepart").val(linkmanList[i].department);//部门？
                                $("#workerPost").val(linkmanList[i].job);//职务？
                                $("#workerTel").val(linkmanList[i].contact);//联系电话
                            }
                        }
                    }
                }
                //反欺诈备注和状态
                $("#cheatRemark").text(orderData.antifraudRemark);
                $("#photoRemark").text(orderData.photoRemark);//拍客备注
                if(orderData.antifraudState==0) $("#cheatState").html("未核查");
                if(orderData.antifraudState==1) $("#cheatState").html("通过");
                if(orderData.antifraudState==2) $("#cheatState").html("拒绝");
            }, "application/json");

            Comm.ajaxPost("finalAudit/finallist",'orderId='+orderId,function(result){
                console.log(result);
                //客户银行卡信息
                var accountInfo = result.data.AccountInfo;
                $("#bankCard").val(accountInfo.bankCard+"");
                $("#accountAddress").val(accountInfo.accountProvince+accountInfo.accountCity);
                $("#caccountBank").val(accountInfo.accountBank);
                //装修合理性
                var decorationList = result.data.decorationList;
                console.log(decorationList);
                if(decorationList){
                    $("#showReasonableContent").empty();
                    for(var i=0;i<decorationList.length;i++){
                        $("#showReasonableContent").show()
                        var materialName=decorationList[i].materialName;
                        var materialPriceResp=decorationList[i].materialPriceResp;//价格装修是否合理
                        var materialCountResp=decorationList[i].materialCountResp;//数量装修是否合理
                        var decorationImg=decorationList[i].decorationImg;//比价图片
                        var host=$('#host').val();
                        var html=''
                        html+='<form action="" id="form-'+materialName+'"><table class="tb_info" style="font-size:12px;margin: .5em 0;cursor: pointer">';
                        html+= '<tbody><tr>';
                        html+='<td class="ReasonableTableTitle">材料名称：</td>';
                        html+='<td class="ReasonableTableTitle"><input class="getMsg" type="text" style="text-align: center" name="materialType'+materialName+'" readonly value="'+materialName+'"></td>';
                        html+='<td class="ReasonableTableTitle">装修价格是否合理：</td>';
                        html+='<td class="ReasonableTableTitle getMsg"><label>';
                        if (materialPriceResp=='0'){
                            html+='<input type="radio" name="IsReasonable-'+materialName+'" value="materialName" disabled>是</label>';
                            html+='<label>';
                            html+='<input type="radio" name="IsReasonable-'+materialName+'" value="0"  checked>否</label></td>';
                        }else {
                            html+='<input type="radio" name="IsReasonable-'+materialName+'" value="materialName" checked>是</label>';
                            html+='<label>';
                            html+='<input type="radio" name="IsReasonable-'+materialName+'" value="0" disabled>否</label></td>';
                        }
                        html+='<td class="ReasonableTableTitle">装修材料数量是否合理：</td>';
                        html+='<td class="ReasonableTableTitle getMsg">';
                        html+='<label>';
                        if (materialCountResp=='0'){
                            html+='<input type="radio" name="IsCountReasonable-'+materialName+'" value="1" disabled>是</label>';
                            html+='<label>';
                            html+='<input type="radio" name="IsCountReasonable-'+materialName+'" value="0" checked>否</label>';
                        }else {
                            html+='<input type="radio" name="IsCountReasonable-'+materialName+'" value="1" checked>是</label>';
                            html+='<label>';
                            html+='<input type="radio" name="IsCountReasonable-'+materialName+'" value="0" disabled>否</label>';
                        }
                        html+='</td><td class="ReasonableTableTitle">备注：</td><td><label><input class="getMsg" type="text" readonly name="remark'+materialName+'" value="'+decorationList[i].remark+'"></label></td>';
                        html+='<td class="ReasonableTableTitle">';
                        if(decorationImg){
                            html+='<img width="50" height="40" src="'+_ctx+"/fintecher_file/"+decorationImg+'" onclick="imgShow(this)"/>';
                            html+='&nbsp;&nbsp;<a class="waitUpload imgUpload" onclick="imgShow1(this)" filename="'+decorationImg+'">预览</a>';
                        }else{
                            html+='未上传比价图片';
                        }
                        html+='</td></tr></tbody></table><input type="hidden" name="customerId" value="'+customerId+'">' ;
                        html+='<input type="hidden" name="orderId" value="'+orderId+'">' ;
                        html+='<input type="hidden" name="materialPriceResp" value="">' ;
                        html+='<input type="hidden" name="materialCountResp" value="">' ;
                        html+='<input type="hidden" name="decorationCountResp" value="">' ;
                        html+='<input type="hidden" name="materialName" value="">' ;
                        html+='<input type="hidden" name="remark" value="">' ;
                        html+='<input type="hidden" name="saveId" value="'+decorationList[i].id+'" class="getMsg">';
                        html+='<input type="hidden" name="fileName" value="'+decorationImg+'" class="getMsg">';
                        html+='</form>';
                        $("#showReasonableContent").prepend(html);
                    }
                }
                //电核信息
                var examineList = result.data.examineList[0];
                if(examineList){
                    $("input[name='checkInfo'][value='"+examineList.loan+"']").attr("checked", "checked").siblings("input[type=radio]").attr("disabled",true);
                    $("input[name='checkCondi'][value='"+examineList.job+"']").attr("checked", "checked").siblings("input[type=radio]").attr("disabled",true);
                    $("input[name='checkHouse'][value='"+examineList.house+"']").attr("checked", "checked").siblings("input[type=radio]").attr("disabled",true);
                    $("input[name='checkLoan'][value='"+examineList.liabilities+"']").attr("checked", "checked").siblings("input[type=radio]").attr("disabled",true);
                    $("input[name='checkGlide'][value='"+examineList.flow+"']").attr("checked", "checked").siblings("input[type=radio]").attr("disabled",true);
                    $('#elecRemark').val(examineList.remark);
                }
                //电话
                var investiList = result.data.investiList;
                if(investiList){
                    $("#recordList1").empty();
                    $("#recordList2").empty();
                    $("#recordList3").empty();
                    $("#recordList4").empty();
                    $("#recordList5").empty();
                    $("#recordList6").empty();
                    var list1=new Array(),list2=new Array(),list3=new Array(),list4=new Array(),list5=new Array(),list6=new Array();
                    for(var i=0;i<investiList.length;i++){
                        if(investiList[i].type=='1') list1.push(investiList[i]);
                        if(investiList[i].type=='2') list2.push(investiList[i]);
                        if(investiList[i].type=='3') list3.push(investiList[i]);
                        if(investiList[i].type=='4') list4.push(investiList[i]);
                        if(investiList[i].type=='5') list5.push(investiList[i]);
                        if(investiList[i].type=='6') list6.push(investiList[i]);
                    }
                    if(list2.length==0)$("#recordList2").parent().hide();
                    if(list3.length==0)$("#recordList3").parent().hide();
                    if(list4.length==0)$("#recordList4").parent().hide();
                    if(list5.length==0)$("#recordList5").parent().hide();
                    if(list6.length==0)$("#recordList6").parent().hide();
                    for(var i=0;i<investiList.length;i++){
                        var answerState=investiList[i].answerState;
                        var time = investiList[i].answerTime;
                        time=getFirstTime();
                        var html='';
                        html+='<tr>';
                        html+='<td class="getMsg">'+time+'</td><td>';
                        if(answerState=="0"){
                            html+='无人接听';
                        }else if(answerState=="1"){
                            html+='接通';
                        }else if(answerState=="2"){
                            html+='其它';
                        }
                        html+='</td><td>'+investiList[i].answerTel+'</td>';
                        html+='<td>'+investiList[i].remark+'</td>';
                        if(investiList[i].soundSrc==""){
                            html+='<td>无</td>';
                        }else {
                            Comm.ajaxPost('customerAudit/isExists', "fileName=" + investiList[i].soundSrc, function (result) {
                                if (result.data == 0) {
                                    html += '<td>无</td>';
                                } else if (result.data == 1) {
                                    html += '<td><a type="button" class="btn btn-primary deleteBtn"  class="deleteBtn" href="downloadSound?fileName=' + investiList[i].soundSrc + '">下载</a>';
                                    html += '</td>';
                                }
                            },null,null,null,null,false);
                        }
                        html+='</tr>';
                        if(investiList[i].type=='1'){//本人电话拨打记录
                            $("#recordList1").prepend(html);
                        }else if(investiList[i].type=='2'){//网络调查
                            $("#recordList2").prepend(html);
                        }else if(investiList[i].type=='3'){//114调查
                            $("#recordList3").prepend(html);
                        }else if(investiList[i].type=='4'){//进件单固
                            $("#recordList4").prepend(html);
                        }else if(investiList[i].type=='5'){//直系联系人通话
                            $("#recordList5").prepend(html);
                        }else if(investiList[i].type=='6'){//同事联系人通话
                            $("#recordList6").prepend(html);
                        }
                    }
                }
                //初审意见，终审意见
                Comm.ajaxPost("finalAudit/getMessage",'orderId='+orderId,function(result){
                    console.log(result);
                    var data = result.data;
                    if(data){
                        for(var i=0;i<data.length;i++){
                            if(data[i].state == '6'){//终审
                                $('#finaladvice').text(data[i].approveSuggestion);
                                //$('#finalcheckState option[value="'+data[i].result+'"]').attr("selected",true);
                                if(data[i].result=='1'){
                                    data[i].result='通过';
                                }else{
                                    data[i].result='拒绝'
                                }
                                $('#finalcheckState').html(data[i].result);
                            }
                            if(data[i].state == '5'){//处审
                                $('#advice').text(data[i].approveSuggestion);
                                //$('checkState option[value="'+data[i].result+'"]').attr("selected",true);
                                if(data[i].result=='1'){
                                    data[i].result='通过';
                                }else{
                                    data[i].result='拒绝'
                                }
                                $('#checkState').html(data[i].result);
                            }
                        }
                    }
                    console.log(result);
                })
            });
        }
    });
}
//展示风险评估结果
function getNothing(customerId) {
    Comm.ajaxPost("customer/getRisk",{'customerId':customerId},function (result) {
        if(result.code=="0"&&result.data){
            var phoneResk=result.data.phoneResk;
            var resk=result.data.resk;
            if(phoneResk){
                if(phoneResk.onlineTime){
                    $("#phoneTime").html(phoneResk.onlineTime);//手机使用时长
                }else{
                    $("#phoneTime").html("");
                }
                if(phoneResk.bizResponseCode=="1"){//查得 手机号实名验证
                    if(phoneResk.pyIsNameMatchOperato==1){
                        $("#phoneNoCheck").html("一致");
                    }else if(phoneResk.pyIsNameMatchOperato==0){
                        $("#phoneNoCheck").html("不一致");
                    }else if(phoneResk.pyIsNameMatchOperato==-1){
                        $("#phoneNoCheck").html("无此记录");
                    }
                }
            }
        }
    })
}
function formatTime(t){
    var time = t.replace(/\s/g,"");//去掉所有空格
    time = time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6,8)+" "+
        time.substring(8,10)+":"+time.substring(10,12)+":"+time.substring(12,14);
    return time;
}
//拨打记录添加
function addBtn(flag){
    var time=getFirstTime();
    var html='';
    html+='<tr>';
    html+='<td class="getMsg">'+time+'</td><td>'
    html+='<select name="" class="listenState getMsg"> <option value="0">无人接听</option><option value="1">接通</option> <option value="2">其它</option></select>';
    html+='</td><td><input type="text" class="answerTel getMsg" style="border:1px solid #ccc;"></td>';
    html+='<td colspan="4"><textarea  class="answerRemark getMsg" cols="30" rows="2"></textarea></td><td>';
    html+='<button  type="button" class="btn btn-primary deleteBtn"  class="deleteBtn" onclick="answerdelBtn(this)">删除</button>';
    html+='</td></tr>';

    var html1='';
    html1+='<tr><td class="getMsg">'+time+'</td><td>';
    html1+='<select name="" class="listenState getMsg"> <option value="0">无人接听</option><option value="1">接通</option> <option value="2">其它</option></select>';
    html1+='</td><td><input type="text" class="answerTel getMsg" style="border:1px solid #ccc;"></td>';
    html1+='<td><textarea class="answerRemark getMsg" cols="30" rows="2"></textarea></td> <td>'
    html1+='<button type="button" class="btn btn-primary deleteBtn" onclick="answerdelBtn(this)">删除</button>'
    html1+='</td></tr>';

    if(flag==1){
        $("#recordList1").append(html);
    }else{
        $("#recordList"+flag).append(html1);
    }

}
//额度匹配
function amountBtn(){
    var param={};
    param.cellName=$("#limitName").val();
    // param.provincesId=$("#provincesId").val();
    // param.cityId=$("#cityId").val();暂时不用省市id
    Comm.ajaxPost("customerAudit/getMatchingPrice",JSON.stringify(param),function(data){
        console.log(data.data.length)
        if(data.data.length<=0){
            $("#limitPrice").val("45000");//小区平均房价
            $("#limitDeco").val("2100");//小区平均装修价格
        }else{
            if(data.data[0].averageHousePrice){
                $("#limitPrice").val(data.data[0].averageHousePrice);//小区平均房价
            }else{
                $("#limitPrice").val("45000");//小区平均房价
            }
            if(data.data[0].averageRenovationPrice){
                $("#limitDeco").val(data.data[0].averageRenovationPrice  );//小区平均装修价格
            }else{
                $("#limitDeco").val("2100");//小区平均装修价格
            }
            $("#cmId").val(data.data[0].id);
        }
    }, "application/json");
}
//客户电核信息
function elecButton(){
    var loan=$('input[name="checkInfo"]:checked').next().val();//借款信息核实
    var job=$('input[name="checkCondi"]:checked').next().val();//工作情况核实
    var house=$('input[name="checkHouse"]:checked').next().val();//房产情况核实
    var liabilities=$('input[name="checkLoan"]:checked').next().val();//负债信息核实
    var flow=$('input[name="checkGlide"]:checked').next().val();//流水核查
    var remark=$("#elecRemark").val();//备注
    var param={};
    param.orderId=$("#orderId").val();//订单id
    param.customerId= $("#customerId").val();//客户id
    param.loan=loan;//借款信息核实
    param.job=job;//工作情况核实
    param.house=house;//房产情况核实
    param.liabilities=liabilities;//负债信息核实
    param.flow=flow;//流水核查
    param.remark=remark;//备注
    Comm.ajaxPost("customerAudit/addCustomerExamine",JSON.stringify(param),function(data){

    }, "application/json");
}
//通信记录
function callBtn(me,type){
    /* customerAudit/addInvestigation保存客户通信记录
     传参
     orderId   订单id
     customerId    客户id
     answerContent  接听内容
     answerState   接听状态（0无人接听 1接通 2其它）
     type   调查类型（1本人电话拨打记录  2网络调查  3114调查）
     remark
     返回  成功失败*/
    var answerContent=$(me).parent().parent().next().find(".answerContent").val()
    if(answerContent==""||answerContent==null){
        layer.msg("接听内容不能为空",{time:2000});
        return;
    }
    var param={};
    param.orderId=$("#orderId").val();//订单id
    param.customerId= $("#customerId").val();//客户id
    param.answerContent=$(me).parent().parent().next().find(".answerContent").val();//接听内容
    param.answerState=$(me).parent().parent().find(".listenState option:selected").val();//接听状态
    param.type=type;//调查类型
    param.remark=$(me).parent().parent().next().next().find(".answerRemark").val();//备注
    Comm.ajaxPost("customerAudit/addInvestigation",JSON.stringify(param),function(data){
        layer.msg(data.msg,{time:2000},function(){
            $("input[name='contactId']").val(data.data);
        });
    }, "application/json");
}

//发欺诈资料
$('#addV3Product').ajaxSubmit({
    type: "POST",
    url: "addProductSeries",
    success: function (data) {
        data = eval('('+data+')');
        layer.msg(data.msg,{time:2000},function(){
            layer.closeAll();
            var id=$("#v3ParentId").val();
            clickPrdType(id)
        });
    },
    error: function (XMLHttpRequest, textStatus, thrownError) {
    }
});
//收缩目录
function shrink(me){
    $(me).next().slideToggle();
}
//备注
function remarkBtn(){
    var param={};
    param.customerRemark=$("#customerRemark").val();//备注
    param.id=$("#orderId").val();//订单id
    Comm.ajaxPost("customerAudit/addCustomerRemark",JSON.stringify(param),function(data){
        layer.msg(data.msg,{time:2000});
    }, "application/json");
}
//通过
function thoughButton(){
    var though=layer.open({
        type : 1,
        title : "输入授信金额",
        shadeClose : true, //点击遮罩关闭层
        area : [ '600px', '' ],
        offset: '100px',
        content : $('#Though_Sum'),
        btn : [ '保存', '取消' ],
        yes: function (index, layero) {
            var param={};
            param.firstCredit=$('#firstCredit').val();//初审授信额度
            param.approveSuggestion=$("#passRemark").val();//审批意见
            param.state=5;
            param.tache=1;
            param.handlerId=$("#userId").val();
            param.handlerName=$("#handName").val();
            param.orderId=$("#orderId").val();//订单id
            param.customerId= $("#customerId").val();//客户id
            Comm.ajaxPost("customerAudit/audit",JSON.stringify(param),function(data){
                layer.msg(data.msg,{time:2000});
            }, "application/json");
        }
    });
    /* var param={};
     param.*/
}
function getTime(time) {
    var arr1=time.split(" ");
    var y=arr1[0].split("-");
    var t=arr1[1].split(":");
    return newTime=y[0]+y[1]+y[2]+t[0]+t[1]+t[2];
}

function crediet(){
    layer.open({
        type : 1,
        title : '风险评估',
        area : [ '100%', '100%' ],
        content : $('#auditFinds'),
        btn : [ '取消' ],
    })
}




$().ready(function () {
    $(".showBigImg").hover(function(){
        $(this).parent().next().children("img").attr("src",$(this).attr("src"));
        $(this).parent().next().show();
    },function(){
        $(this).parent().next().hide();
    });
})

// 展示客户图片
function showCumIng(imgList,host) {
    var html="";
    for(var i=0;i<imgList.length;i++){
        if(imgList[i].type== "9"){//身份证
            var time=getFirstTime(imgList[i].creatTime);
            if(imgList[i].isfront=="0"){
                html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>身份证正面</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
            }else{
                html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>身份证反面</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
            }
        }
        if(imgList[i].type== "114"){//手持身份证明
            var time=getFirstTime(imgList[i].creatTime);
            if(imgList[i].isfront=="0"){
                html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>手持身份证明正面</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
            }else{
                html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>手持身份证明反面</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
            }
        }
        if(imgList[i].type== "112"){//工作证明
            var time=getFirstTime(imgList[i].creatTime);
            html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>工作证明</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
        if(imgList[i].type== "115"){//房产证明
            var time=getFirstTime(imgList[i].creatTime);
            html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>房产证明</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
        if(imgList[i].type== "116"){//装修合同
            var time=getFirstTime(imgList[i].creatTime);
            html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>装修合同</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
        if(imgList[i].type== "117"){//装修清单
            var time=getFirstTime(imgList[i].creatTime);
            html+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;" src="'+host+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>装修清单</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
    }
    $("#showNewImg ul").empty();
    $("#showNewImg ul").append(html);

}
//展示审核人员上传的图片
function showOrderImgList(imgList){
    var html39 = "";
    var html40 ="";
    var FanQizha="";
    var PaiKe="";
    for(var i=0;i<imgList.length;i++) {
        if (imgList[i].type == "39") {//初审人员上传资料
            var time=getFirstTime(imgList[i].creatTime);
            html39+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;height: 100%" src="'+_ctx+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>初审审核材料</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';

        }
        if (imgList[i].type == "40") {//终审人员上传资料
            var time=getFirstTime(imgList[i].creatTime);
            html40+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;height: 100%" src="'+_ctx+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>终审审核材料</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';

        }
        if(imgList[i].type== "8"){//拍客资料
            var time=getFirstTime(imgList[i].creatTime);
            PaiKe+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;height: 100%" src="'+_ctx+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>拍客资料</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
        if(imgList[i].type== "7"){//反欺诈资料
            var time=getFirstTime(imgList[i].creatTime);
            FanQizha+='<li><div style="overflow: hidden;width:120px;height:160px;border:1px solid #ddd;padding:.2em;margin:.2em auto"><img style="width: 100%;height: 100%" src="'+_ctx+imgList[i].src+'" class="imgShow" onclick="imgShow(this)"></div><p>反欺诈资料</p><p style="margin:1em;" class="hideTime">'+time+'</p></li>';
        }
    }
    $("#yyzz").empty();
    $("#yyzz").append(html40);
    $("#cszl").empty();
    $("#cszl").append(html39);
    $("#fanqzContainer ul").empty();
    $("#fanqzContainer ul").append(FanQizha);
    $("#paikeContainer ul").empty();
    $("#paikeContainer ul").append(PaiKe);
}
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
$().ready(function () {
    var time=getFirstTime();
    $("tbody[id^='recordList'] tr:first-child td:first-child").html(time);
})
//图片预览
function imgShow(me){
    window.open($(me).attr("src"),"图片预览");
}


