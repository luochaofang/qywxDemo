/**
 * Created by Administrator on 2017/5/24 0024.
 */
//页面初始化
$(function () {
    var param = {};
    param.fieldTypeId = "";
    param.isCommon = 0;
    param.engineId = $("#engineId").val();
    queryList(param);
    $("#btn").show();
    //@输出出现下拉框
    var param = {};
    var queryFilter = {};
    param.engineId = $("#engineId").val();
    queryFilter.param = param;
    var array = new Array();
    $.ajaxSetup({async :false});
    Comm.ajaxPost("datamanage/field/findFieldByUser",JSON.stringify(queryFilter),function(result){
        var resData = result.data.fieldList;
        for (var i = 0; i < resData.length; i++) {
            array.push(resData[i].cnName);
        }
    },"application/json");
    $.fn.atwho.debug = true;
    var at_config = {
        at: "@",
        data: array,
        headerTpl: '<div class="atwho-header">字段列表</div>',
        limit: 200
    }
    $inputor = $('#inputor').atwho(at_config);
    $(document).on("focus",".inputor",function() {
        $(".inputor").removeAttr("id");
        $(this).attr("id","inputor");
        $inputor = $('#inputor').atwho(at_config);
    });
});
var g_userManage = {
    tableUser : null,
    currentItem : null,
    fuzzySearch : false,
    getQueryCondition : function(param,data) {
        var paramFilter = {};
        var page = {};
        // 自行处理查询参数
        param.fuzzySearch = g_userManage.fuzzySearch;
        if (g_userManage.fuzzySearch) {
            param.searchKey = $("#Parameter_search").val();
        }
        param.searchKey = $("input[name='Parameter_search']").val();
        paramFilter.param = param;
        page.firstIndex = data.start == null ? 0 : data.start;
        page.pageSize = data.length  == null ? 10 : data.length;
        if (page.pageSize==-1)
        {
            page.pageSize=10;
        }
        paramFilter.page = page;
        return paramFilter;
    }
};
function queryList(param) {
    tableUser = $('#Res_list').dataTable($.extend({
        'iDeferLoading':true,
        "bAutoWidth" : false,
        "Processing": true,
        "ServerSide": true,
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bLengthChange": false,
        "dom": 'rt<"bottom"i><"bottom"flp><"clear">',
        "destroy":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        "ajax" : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            var queryFilter = g_userManage.getQueryCondition(param,data);
            Comm.ajaxPost('engineManage/fieldmapping/list',JSON.stringify(queryFilter),function(result){
                var returnData = {};
                var resData = result.data;
                $("#canAdd").val(resData.canAdd);
                $("#listType").val(resData.listType);
                var resPageData = resData.pager;
                returnData.recordsTotal = resPageData.total;
                returnData.recordsFiltered = resPageData.total;
                returnData.data = resPageData.list;
                callback(returnData);
            },"application/json")
        },
        "order": [],//取消默认排序查询,否则复选框一列会出现小箭头
        "columns": [
            {
                'data':null,
                'class': 'hidden', "searchable": false, "orderable": false
            },
            {
                "className" : "childBox",
                "orderable" : false,
                "data" : null,
                "width" : "20px",
                "searchable":false,
                "render" : function(data, type, row, meta) {
                    return '<input id="'+data.id+'" type="checkbox" value="'+data.id+'" style="cursor:pointer;" isChecked="false">'
                }
            },
            {"data": "enName","orderable" : false,"width":"100px"},
            {"data": "cnName","orderable" : false,"width" : "160px"},
            {"data": "fieldType","orderable" : false, "width" : "100px"},
            {"data": "restrainScope","orderable" : false, "width" : "100px"},
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data.isCommon==1){
                        return '是 '
                    }else{
                        return '否'
                    }
                }
            },
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data.isDerivative==1){
                        return '是'
                    }else{
                        return '否'
                    }
                }
            },
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data.isOutput==1){
                        return '是'
                    }else{
                        return '否'
                    }
                }
            },
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "width" : "60px",
                "render" : function(data, type, row, meta) {
                    if(data.status==1){
                        return '启用'
                    }else
                    {
                        if(data.status==0){
                            return '停用'
                        }else
                        {
                            return '删除'
                        }
                    }
                }
            },
            {"data": "nickName","orderable" : false, "width" : "100px"},
            {
                "width" : "150px",
                "data":null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {

                    return json2TimeStamp(data.createTime);
                }
            },
            {
                "data": "null", "orderable": false, "width": "100px",
                "render": function (data, type, row, meta) {
                    var img='<img class="operate" src="' + _ctx + '/resources/images/operate.png"/>';
                    return img;
                }
            }
        ],
        "createdRow": function ( row, data, index,settings,json ) {
        },
        "initComplete" : function(settings,json) {
            $("#paramSearch").click(function() {
                g_userManage.fuzzySearch = true;
                queryList();
                $("#paramSearch").val("");
            });
            //单选行
            $("#Res_list tbody").delegate( 'tr','click',function(e){
                var target=e.target;
                if(target.nodeName=='TD'){
                    var input=target.parentNode.children[0].children[0];
                    var isChecked=$(input).attr('isChecked');
                    if(isChecked=='false'){
                        if($(input).attr('checked')){
                            $(input).attr('checked',false);
                        }else{
                            $(input).attr('checked','checked');
                        }
                        $(input).attr('isChecked','true');
                    }else{
                        if($(input).attr('checked')){
                            $(input).attr('checked',false);
                        }else{
                            $(input).attr('checked','checked');
                        }
                        $(input).attr('isChecked','false');
                    }
                }
            });
            //操作
            $("#Res_list").on("click",".operate",function(e){
                var target = e.target||window.event.target;
                var id = $(target).parents("tr").children().eq(1).children("input").val();
                var isCommon = $(target).parents("tr").children().eq(6).html();
                addData(2 ,id,isCommon);
            });
        }
    }, CONSTANT.DATA_TABLES.DEFAULT_OPTION)).api();
    tableUser.draw();//刷新数据
}
//查询重置方法
function paramSearchReset() {
    $('input[name="Parameter_search"]').val("");
    g_userManage.fuzzySearch = false;
    queryList();
}
//条件区域
var logical =
    '<option value="&&">and</option>'+
    '<option value="||">or</option>'+
    '<option value="(">(</option>'+
    '<option value=")">)</option>'+
    '<option value="&&(">and(</option>'+
    '<option value=")&&">)and</option>'+
    '<option value="(">(</option>'+
    '<option value="||(">or(</option>'+
    '<option value=")||">)or</option>'+
    '<option value=")||(">)or(</option>'+
    '<option value="空置">空置</option>';

var  digitalType =
    '<option value=">">大于</option>'+
    '<option value="<">小于</option>'+
    '<option value=">=">大于等于</option>'+
    '<option value="<=">小于等于</option>'+
    '<option value="==">等于</option>'+
    '<option value="!=">不等于</option>';

var  characterType =
    '<option value="like">like</option>'+
    '<option value="not like">not like</option>'+
    '<option value="==">等于</option>'+
    '<option value="!=">不等于</option>';

var  enumerationType =
    /*	  '<option value="in">in</option>'+
     '<option value="not in">not in</option>'+*/
    '<option value="==">等于</option>'+
    '<option value="!=">不等于</option>';
//衍生字段条件区域第一个下拉值
var whereSelectValue1=null;
//衍生字段条件区域第二个下拉值
var whereSelectValue2=null;
var dataSelectList=null;
var dataSelectListHtml="";
//枚举选项值
var enumerationselect={
    push:Array.prototype.push
};
//枚举选项值Html
var  enumerationselectHtml="";
//新增编辑字段
function addData(sign ,id,isCommon){
    if(sign=="1") {
        InitializationDiv(null,id);
        layer.open({
            type: 1,
            title: '添加字段',
            maxmin: true,
            shadeClose: true,
            area: ['650px', '468px'],
            content: $('#Add_data_style'),
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                //校验是否通过标志
                var validFlag = false;
                var _fieldEn = $("#en_name").val();
                var _fieldCn = $("#cn_name").val();
                if (validateFieldEn()) {
                    if (validateFieldCn()) {
                        if (validateValueScope()) {
                            validFlag = true;
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                //先同步select框里的value值到隐藏字段
                $("#fieldTypeId").val($("#value_type").val());
                //字段条件区域序列化
                var str = "[";
                if ($("#isDerivative").val() == "1") {
                    $(".c-inclusion").each(function () {
                        var substr = "[";
                        $(this).find(".c-optional-rules .c-optional-rules-rules").each(function (index, element) {
                            if ($(element).find('select').val() != '' && $(element).find('input').val() != '') {
                                //content = $(element).find('select,input').serializeJSON();
                                var namelist = $(element).find('select,input');
                                var content = "{";
                                for (var j = 0; j < namelist.length; j++) {
                                    if ($($(namelist)[j]).css("display") != "none") {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                substr += content.substring(0, content.length - 1) + "},";
                            }
                        });
                        substr = substr.substring(0, substr.length - 1);
                        substr = substr + "]";
                        if (substr == "[]")
                            substr = "";

                        $(this).find('.c-operation-inclusion input[name = fieldContent2]').val(substr);

                        var subContent = "";
                        if ($(this).find('.c-operation-inclusion select').val() != '' && $(this).find('.c-operation-inclusion input').val() != '') {
                            var namelist = $(this).find('.c-operation-inclusion select,input');
                            subContent = subContent + "{";
                            for (var j = 0; j < namelist.length; j++) {
                                if ($($(namelist)[j]).css("display") != "none") {
                                    var name = $(namelist)[j].getAttribute("name");
                                    var value = $($(namelist)[j]).val();
                                    if (name) {
                                        if (value == null) {
                                            value = "";
                                        }
                                        if (name == "fieldValue") {
                                            if ((j + 1) == namelist.length) {
                                                subContent += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                            }
                                        } else {
                                            subContent += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                else {
                                    if ("fieldContent2" == $(namelist)[j].getAttribute("name")) {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            subContent += "\"" + name + "\"" + ":" +  value  + ",";
                                        }
                                    }
                                }
                            }
                            subContent = subContent.substring(0, subContent.length - 1) + "},";
                        }
                        str += subContent;
                    });
                }
                str = str.substring(0, str.length - 1);
                if (str != "") {
                    str = str + "]";
                }
                if (str == "[]" || $("#isDerivative").val() == 0) {
                    str = "";
                }

                $("#fieldContent").val(str);

                console.log("序列化后的字符串" + str);
                //字段公式区域序列化
                if ($("#isDerivative").val() == 1) {
                    var gsValue = "[";
                    //$("input[name = 'formulaHidden']").val(fStr);
                    if ($("#valueType").val() == "3") {
                        //[{"fvalue":"","formula":"12231235453*s++123456qrt()ln()","idx":"0","farr":""}]"
                        //gsValue="{\"fvalue\":\"\",\"formula\":\""+$("#inputor").val()+"\",\"idx\":\"0\",\"farr\":\"\"}]";
                        var idx = 0;
                        $(".editWhere2").each(function () {
                            if ($(this).find('select').val() != '' && $(this).find('input').val() != '') {
                                var namelist = $(this).find('select,input');
                                var content = "{";
                                for (var j = 0; j < namelist.length; j++) {
                                    if ($($(namelist)[j]).css("display") != "none") {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                    else {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name == "farr") {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                content += "\"idx\":\"" + idx + "\",";
                                gsValue += content.substring(0, content.length - 1) + "},";
                                idx++;
                            }
                        })
                        gsValue = gsValue.substring(0, gsValue.length - 1) + "]";
                        if(gsValue=="]"){
                            gsValue="";
                        }
                        $("#formulaHidden").val(gsValue);
                    } else {
                        if ($("#inputor").val() != "") {
                            gsValue = "[{\"fvalue\":\"\",\"formula\":\"" + $("#inputor").val() + "\",\"idx\":\"0\",\"farr\":\"\"}]";
                            $("#formulaHidden").val(gsValue);
                        }
                    }
                }else {
                    $("#formulaHidden").val("");
                }
                //console.log("f序列化后的字符串是: ",JSON.stringify(f));

                if (validFlag) {
                    //     代表字段与评分卡sc_前缀的命名区分开
                    $("en_name").val('f_' + _fieldEn);
                    var param = {};
                    param.searchKey = $("#searchKey").val();
                    param.fieldTypeId =$("#fieldTypeId").val();
                    param.id = $("#id").val();
                    param.formula = $("#formula").val();
                    param.formulaShow = $("#formulaShow").val();
                    param.engineId = $("#engineId").val();
                    param.formulaFields = $("#formulaFields").val();
                    param.enName = $("#en_name").val();
                    param.cnName = $("#cn_name").val();
                    param.isDerivative = $("#isDerivative").val();
                    param.isOutput = $("#isOutput").val();
                    param.restrainScope = $("#restrainScope").val();
                    param.fieldContent = $("#fieldContent").val();
                    param.formulaHidden = $("#formulaHidden").val();
                    param.valueType=$("#valueType").val();
                    Comm.ajaxPost(
                        'engineManage/fieldmapping/save', JSON.stringify(param),
                        function (data) {
                            layer.closeAll();
                            layer.msg(data.msg, {time: 1000}, function () {
                                //刷新数据
                                queryList("");
                            });
                        }, "application/json"
                    );
                }
            }
        });
    }else
    {
        layer.closeAll();
        InitializationDiv(id);
        var editLayer=layer.open({
            type: 1,
            title: '修改字段',
            maxmin: true,
            shadeClose: true,
            area: ['650px', '468px'],
            content: $('#Add_data_style'),
            btn: ['保存', '取消'],
            success:function(index, layero){
                if(isCommon!="否"){//如果是外部字段，那么只能查看，不可以编辑保存
                    $(".layui-layer-btn0").hide();
                    $(".layui-layer-btn1").css("width","100%");
                }
            },
            yes: function (index, layero) {
                //校验是否通过标志
                var validFlag = false;
                var _fieldEn = $("#en_name").val();
                var _fieldCn = $("#cn_name").val();
                if (validateFieldEn()) {
                    if (validateFieldCn()) {
                        if (validateValueScope()) {
                            validFlag = true;
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                //字段条件区域序列化
                var str = "[";
                if ($("#isDerivative").val() == "1") {
                    $(".c-inclusion").each(function () {
                        var substr = "[";
                        $(this).find(".c-optional-rules .c-optional-rules-rules").each(function (index, element) {
                            if ($(element).find('select').val() != '' && $(element).find('input').val() != '') {
                                //content = $(element).find('select,input').serializeJSON();
                                var namelist = $(element).find('select,input');
                                var content = "{";
                                for (var j = 0; j < namelist.length; j++) {
                                    if ($($(namelist)[j]).css("display") != "none") {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                substr += content.substring(0, content.length - 1) + "},";
                            }
                        });
                        substr = substr.substring(0, substr.length - 1);
                        substr = substr + "]";
                        if (substr == "[]")
                            substr = "";

                        $(this).find('.c-operation-inclusion input[name = fieldContent2]').val(substr);

                        var subContent = "";
                        if ($(this).find('.c-operation-inclusion select').val() != '' && $(this).find('.c-operation-inclusion input').val() != '') {
                            var namelist = $(this).find('.c-operation-inclusion select,input');
                            subContent = subContent + "{";
                            for (var j = 0; j < namelist.length; j++) {
                                if ($($(namelist)[j]).css("display") != "none") {
                                    var name = $(namelist)[j].getAttribute("name");
                                    var value = $($(namelist)[j]).val();
                                    if (name) {
                                        if (value == null) {
                                            value = "";
                                        }
                                        if (name == "fieldValue") {
                                            if ((j + 1) == namelist.length) {
                                                subContent += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                            }
                                        } else {
                                            subContent += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                else {
                                    if ("fieldContent2" == $(namelist)[j].getAttribute("name")) {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            subContent += "\"" + name + "\"" + ":"  + value  + ",";
                                        }
                                    }
                                }
                            }
                            subContent = subContent.substring(0, subContent.length - 1) + "},";
                        }
                        str += subContent;
                    });
                }
                str = str.substring(0, str.length - 1);
                if (str != "") {
                    str = str + "]";
                }
                if (str == "[]" || $("#isDerivative").val() == 0) {
                    str = "";
                }
                $("#fieldContent").val(str);
                console.log("序列化后的字符串" + str);
                //字段公式区域序列化
                if ($("#isDerivative").val() == 1) {
                    var gsValue = "[";
                    //$("input[name = 'formulaHidden']").val(fStr);
                    if ($("#valueType").val() == "3") {
                        //[{"fvalue":"","formula":"12231235453*s++123456qrt()ln()","idx":"0","farr":""}]"
                        //gsValue="{\"fvalue\":\"\",\"formula\":\""+$("#inputor").val()+"\",\"idx\":\"0\",\"farr\":\"\"}]";
                        var idx = 0;
                        $(".editWhere2").each(function () {
                            if ($(this).find('select').val() != '' && $(this).find('input').val() != '') {
                                var namelist = $(this).find('select,input');
                                var content = "{";
                                for (var j = 0; j < namelist.length; j++) {
                                    if ($($(namelist)[j]).css("display") != "none") {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name) {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                    else {
                                        var name = $(namelist)[j].getAttribute("name");
                                        var value = $($(namelist)[j]).val();
                                        if (name == "farr") {
                                            if (value == null) {
                                                value = "";
                                            }
                                            content += "\"" + name + "\"" + ":" + "\"" + value + "\"" + ",";
                                        }
                                    }
                                }
                                content += "\"idx\":\"" + idx + "\",";
                                gsValue += content.substring(0, content.length - 1) + "},";
                                idx++;
                            }
                        })
                        gsValue = gsValue.substring(0, gsValue.length - 1) + "]";
                        $("#formulaHidden").val(gsValue);
                    } else {
                        if ($("#inputor").val() != "") {
                            gsValue = "[{\"fvalue\":\"\",\"formula\":\"" + $("#inputor").val() + "\",\"idx\":\"0\",\"farr\":\"\"}]";
                            $("#formulaHidden").val(gsValue);
                        }
                    }
                }
                var param = {};
                var paramFilter = {};
                param.fieldId = id;
                paramFilter.param = param;
                var  hasCheck=false;
                Comm.ajaxPost(
                    'datamanage/field/checkField', JSON.stringify(paramFilter),
                    function (data) {
                        var resData=data.data;
                        //通用字段和引擎字段
                        var strField = "";
                        $(".c-popup-engine").html('');
                        for (var i = 0; i < resData.fieldList.length; i++) {
                            strField +='<div class="c-popup-redact" style="width:500px;">';
                            if(resData.fieldList[i].engineId==null)
                                strField += '数据管理-类型:';
                            else
                                strField += '引擎管理-名称:'+ resData.fieldList[i].engineName +'-字段映射-类型:';
                            strField += resData.fieldList[i].fieldType + '-名称:' + resData.fieldList[i].fieldCn +''+
                                '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.fieldList[i].engineId+'" onClick="fieldGo(this)" >点击修改</a>'+
                                '</div>';
                        }
                        if(strField!=""){
                            $(".c-popup-engine").append(strField);
                            hasCheck = true;
                        }
                        //数据库管理-黑白名单库
                        var strBWListDb = "";
                        for (var i = 0; i < resData.listDbList.length; i++) {
                            strBWListDb +='<div class="c-popup-redact" style="width:500px;">';
                            if(resData.listDbList[i].listType=='b')
                                strBWListDb += '数据库管理-黑名单名称:';
                            else
                                strBWListDb += '数据库管理-白名单名称:';
                            strBWListDb += resData.listDbList[i].listName +
                                '<a href="javascript:void(0)" class="c-popup-a upadte_engine" dataid="'+resData.listDbList[i].id+'" onClick="bwListGo(this)">点击修改</a>'+
                                '</div>';
                        }
                        if(strBWListDb!=""){
                            $(".c-popup-engine").append(strBWListDb);
                            hasCheck = true;
                        }
                        //规则管理（包含引擎管理知识库-规则管理）
                        var strRule = "";
                        for (var i = 0; i < resData.ruleList.length; i++) {
                            strRule +='<div class="c-popup-redact" style="width:500px;">';
                            if (resData.ruleList[i].engineId==null)
                                strRule += '规则管理-规则集-名称：';
                            else
                                strRule += '引擎管理-名称:'+ resData.ruleList[i].engineName +'-知识库-规则集-名称：';
                            strRule += resData.ruleList[i].name +
                                '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.ruleList[i].engineId+'" onClick="ruleManageGo(this)" >点击修改</a>'+
                                '</div>';
                        }
                        if(strRule!=""){
                            $(".c-popup-engine").append(strRule);
                            hasCheck = true;
                        }
                        //引擎管理知识库-评分卡
                        var strScorecard = "";
                        for (var i = 0; i < resData.scorecardList.length; i++) {
                            strScorecard +='<div class="c-popup-redact" style="width:500px;">'+
                                '引擎管理-名称:'+ resData.scorecardList[i].engineName +'-知识库-评分卡-名称:' + resData.scorecardList[i].name +
                                '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.scorecardList[i].engineId+'" onClick="ruleManageGo(this)" >点击修改</a>'+
                                '</div>';
                        }
                        if(strScorecard!=""){
                            $(".c-popup-engine").append(strScorecard);
                            hasCheck = true;
                        }
                        //引擎管理决策流-黑(白)名单
                        var strNodeListDb = "";
                        for (var i = 0; i < resData.nodelistDbList.length; i++) {
                            strNodeListDb +='<div class="c-popup-redact" style="width:500px;">'+
                                '引擎管理-名称:' + resData.nodelistDbList[i].engineName + '-决策流-黑(白)名单节点:' + resData.nodelistDbList[i].nodeName +
                                '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.nodelistDbList[i].engineId+'" onClick="decisionFlowGo(this)" >点击修改</a>'+
                                '</div>';
                        }
                        if(strNodeListDb!=""){
                            $(".c-popup-engine").append(strNodeListDb);
                            hasCheck = true;
                        }
                        //最后判断打开对话框
                        if(hasCheck){
                            $(".c_dialog").show();
                            autoCenter($(".c_dialog"));
                        }
                        if (validFlag&&!hasCheck) {
                            //英文字段名前加f_ 代表字段与评分卡sc_前缀的命名区分开
                            $("en_name").val('f_' + _fieldEn);
                            param = {};
                            param.fieldTypeId = $("#fieldTypeId").val();
                            param.id = id;
                            param.formula = $("#formula").val();
                            param.formulaShow = $("#formulaShow").val();
                            param.engineId = $("#engineId").val();
                            param.formulaFields = $("#formulaFields").val();
                            param.enName = $("#en_name").val();
                            param.cnName = $("#cn_name").val();
                            param.isDerivative = $("#isDerivative").val();
                            param.isOutput = $("#isOutput").val();
                            param.restrainScope = $("#restrainScope").val();
                            param.fieldContent = $("#fieldContent").val();
                            param.formulaHidden = $("#formulaHidden").val();
                            param.valueType=$("#valueType").val();

                            Comm.ajaxPost(
                                'engineManage/fieldmapping/update', JSON.stringify(param),
                                function (data) {
                                    layer.closeAll();
                                    layer.msg(data.msg, {time: 1000}, function () {
                                        //tableUser.draw( false );//刷新数据
                                        layer.close(editLayer);
                                        queryList($("#hdNodeId").val(),"engineManage/fieldmapping/list");
                                    });
                                }, "application/json"
                            );
                        }
                    }, "application/json"
                );
            }
        });
    }
}
//启用停用删除字段
function resetData(sign){
    var selectArray = $("#Res_list tbody input:checked");
    var param = {};
    // var paramFilter = {};
    if(!selectArray || (selectArray.length<=0)){
        layer.msg("请选择一个字段",{time:2000});
        return;
    }
    var ids = new Array();
    $.each(selectArray,function(i,e){
        var val = $(this).val();
        ids.push(val);
    });
    if(ids.length==0){
        return;
    }
    var fieldTypeId = $("#fieldTypeId").val();
    if(fieldTypeId == "rec"){
        param.listType = "cabage"
    }
    param.engineId = $("#engineId").val();
    param.ids = ids;
    param.status = sign;
    param.isCommon = 0;
    var url="engineManage/fieldmapping/updateStatus";
    if(sign==-1){
        layer.confirm('是否删除用户？', {btn : [ '确定', '取消' ]},
            function() {
                ajax1(param,url);
            }
        );
    }else{
        this.ajax1(param,url);
    }
}
//更新字段类型状态
function ajax1(param,url) {
    Comm.ajaxPost(
        url, JSON.stringify(param),
        function(data){
            var resData = data.data;
            var hasCheck = false;
            status = param.status;
            if(status!='1'){ //'启用'不做校验
                //通用字段和引擎字段
                var strField = "";
                $(".c-popup-engine").html('');
                for (var i = 0; i < resData.fieldList.length; i++) {
                    strField +='<div class="c-popup-redact" style="width:500px;">';
                    if(resData.fieldList[i].engineId==null)
                        strField += '数据管理-类型:';
                    else
                        strField += '引擎管理-名称:'+ resData.fieldList[i].engineName +'-字段映射-类型:';
                    strField += resData.fieldList[i].fieldType + '-名称:' + resData.fieldList[i].fieldCn +''+
                        '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.fieldList[i].engineId+'" onClick="fieldGo(this)" >点击修改</a>'+
                        '</div>';
                }
                if(strField!=""){
                    $(".c-popup-engine").append(strField);
                    hasCheck = true;
                }
                //数据库管理-黑白名单库
                var strBWListDb = "";
                for (var i = 0; i < resData.listDbList.length; i++) {
                    strBWListDb +='<div class="c-popup-redact" style="width:500px;">';
                    if(resData.listDbList[i].listType=='b')
                        strBWListDb += '数据库管理-黑名单名称:';
                    else
                        strBWListDb += '数据库管理-白名单名称:';
                    strBWListDb += resData.listDbList[i].listName +
                        '<a href="javascript:void(0)" class="c-popup-a upadte_engine" dataid="'+resData.listDbList[i].id+'" onClick="bwListGo(this)">点击修改</a>'+
                        '</div>';
                }
                if(strBWListDb!=""){
                    $(".c-popup-engine").append(strBWListDb);
                    hasCheck = true;
                }
                //规则管理（包含引擎管理知识库-规则管理）
                var strRule = "";
                for (var i = 0; i < resData.ruleList.length; i++) {
                    strRule +='<div class="c-popup-redact" style="width:500px;">';
                    if (resData.ruleList[i].engineId==null)
                        strRule += '规则管理-规则集-名称：';
                    else
                        strRule += '引擎管理-名称:'+ resData.ruleList[i].engineName +'-知识库-规则集-名称：';
                    strRule += resData.ruleList[i].name +
                        '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.ruleList[i].engineId+'" onClick="ruleManageGo(this)" >点击修改</a>'+
                        '</div>';
                }
                if(strRule!=""){
                    $(".c-popup-engine").append(strRule);
                    hasCheck = true;
                }
                //引擎管理知识库-评分卡
                var strScorecard = "";
                for (var i = 0; i < resData.scorecardList.length; i++) {
                    strScorecard +='<div class="c-popup-redact" style="width:500px;">'+
                        '引擎管理-名称:'+ resData.scorecardList[i].engineName +'-知识库-评分卡-名称:' + resData.scorecardList[i].name +
                        '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.scorecardList[i].engineId+'" onClick="ruleManageGo(this)" >点击修改</a>'+
                        '</div>';
                }
                if(strScorecard!=""){
                    $(".c-popup-engine").append(strScorecard);
                    hasCheck = true;
                }
                //引擎管理决策流-黑(白)名单
                var strNodeListDb = "";
                for (var i = 0; i < resData.nodelistDbList.length; i++) {
                    strNodeListDb +='<div class="c-popup-redact" style="width:500px;">'+
                        '引擎管理-名称:' + resData.nodelistDbList[i].engineName + '-决策流-黑(白)名单节点:' + resData.nodelistDbList[i].nodeName +
                        '<a href="javascript:void(0)" class="c-popup-a upadte_engine" engineId="'+resData.nodelistDbList[i].engineId+'" onClick="decisionFlowGo(this)" >点击修改</a>'+
                        '</div>';
                }
                if(strNodeListDb!=""){
                    $(".c-popup-engine").append(strNodeListDb);
                    hasCheck = true;
                }
            }
            $.jstree.reference("#jstree").refresh();
            //最后判断打开对话框
            if(hasCheck){
                layer.open({
                    type : 1,
                    title : '提示框',
                    maxmin : true,
                    shadeClose : true,
                    area : [ '545px', '412px' ],
                    content : $(".c_dialog"),
                    btn : [ '确认', '取消' ],
                    success:function(index, layero){
                        $(".layui-layer-title").css("background-color","#2e8ded");
                    },
                    yes : function(index, layero) {
                        tableUser.draw( false );//刷新数据
                        layer.close(index);
                    }
                });
            }else{
                g_userManage.fuzzySearch = true;
                layer.msg(data.msg,{time:2000},function () {
                    tableUser.draw( false );//刷新数据
                });
            }
        },"application/json"
    );
}

var layerIndex;
var selfid;
var tableUser = null;
//根据标志打开增加编辑页面
function InitializationDiv(sign,id) {
    if(sign==null){
        var param = {};
        var paramFilter ={};
        if($("#fieldTypeId").val() == "0"){
            param.fieldTypeId ="";
        }else{
            param.fieldTypeId =$("#fieldTypeId").val();
        }
        param.canAdd =$("#canAdd").val();
        param.isCommon ="0";
        param.engineId = $("#engineId").val();
        //获取字段类型数据
        Comm.ajaxPost(
            'engineManage/fieldmapping/preadd',JSON.stringify(param),
            function(data){
                var  dataList=data.data;
                var fieldTypeList=dataList.fieldTypeList;
                var html="";
                if(dataList.fieldTypeId!=null&dataList.fieldType!=null){
                    html+="<option value='"+dataList.fieldTypeId+"' selected>"+dataList.fieldType+"</option>";
                }
                for(var i=0;i<fieldTypeList.length;i++) {
                    html+="<option value='"+fieldTypeList[i].id+"'>"+fieldTypeList[i].fieldType+"</option>"
                }
                $("#value_type").html(html);
            }, "application/json"
        );
        //获取条件区域下拉框数据
        paramFilter.param = param;
        Comm.ajaxPost(
            'datamanage/field/findFieldByUser',JSON.stringify(paramFilter),
            function(data){
                //初始化值类型
                $("#valueType").val("1");
                //初始化条件区域
                var  dataList=data.data;
                var  html="";
                dataSelectList=data.data.fieldList;
                for(var i=0;i<dataSelectList.length;i++) {
                    //$("#fieldSource").html("<option value='"+dataList[i].fieldTypeId+"' selected>"+dataList[i].fieldType+"</option>");
                    //<restrainScope   valuetype    id   cnName
                    //<option valuescope="[1,200]" valuetype="1" value="565">年龄</option>
                    html+="<option valuescope='"+dataSelectList[i].restrainScope+"' valuetype='"+dataSelectList[i].valueType+"' value='"+dataSelectList[i].id+"'>"+dataSelectList[i].cnName+"</option>"
                }
                dataSelectListHtml=html;
                var  fieldByUserWhereHtml="";
                if (dataSelectList.length>0) {
                    fieldByUserWhereHtml=getOperator(dataSelectList[0].valueType);
                }
                $("[name='fieldId']").html(html);
                $("Div[name='divRow']").remove();
                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow1\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft1\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> <input type=\"text\" name=\"conditionValue\" style=\"width: 80px\"> <select name=\"conditionValue\" size=\"1\"  class=\"select\" style=\"width: 80px;display: none\"> </select></label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight1\"> <label> <div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight1')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select name=\"fieldId\" size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+html+"</select> <select name=\"operator\" size=\"1\"  class=\"select\" style=\"width: 80px\"> "+fieldByUserWhereHtml+" </select> <input type=\"text\" name=\"fieldValue\" style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='display: none;width: 80px' class=\"select\" > "+logical+"</select></div> </label> </div> </div>");
                divRowid=1;

                //初始化公式编辑
                $("#formulaEdit1").show();
                $("#inputor").val("");
                $(".editWhere2").remove();
                $('#formulaEdit2').append(" <label><div class='editWhere2'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>             <select  size=\"1\" name=\"fvalue\"  class=\"inputor\"   style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\"  onclick=\"setCursor('divRowid1')\" name='formula' id='divRowid1' style=\"width: 220px\" > <input type=\"hidden\" name=\"farr\"/> </div> </div></label>");
                $('#formulaEdit2').hide();
                divRowid2=1;
                //初始化 条件区域 公式编辑tab
                setTextDiv(1);
                setCursor('inputor');
            }, "application/json"
        );
        //初始化文本框值
        $('#en_name').attr("value",'');
        $('#cn_name').attr("value",'');
        $("#isDerivative").val("0");
        $('#isOutput').val("0");
        $('#restrainScope').val("");
    }else {
        var param = {};
        var engineId=$("#engineId").val();
        param.engineId = engineId;
        param.canAdd = $("#canAdd").val();
        param.fieldTypeId = $("#fieldTypeId").val();
        param.isCommon = "0";
        param.id=sign;
        Comm.ajaxPost(
            'engineManage/fieldmapping/edit/'+sign,JSON.stringify(param),
            function(data){
                var  resData=data.data;
                //公式编辑
                var  fieldFormulaList=resData.fieldFormulaList;
                var fieldVo = resData.fieldVo;
                //下拉框选项值
                var  flist=resData.flist;
                var  hasFormula=resData.hasFormula;
                //公式值
                $("#formulaHidden").val(hasFormula);
                //字段范围
                var  scopeList=resData.scopeList;
                $("#engineId").val(resData.engineId);
                // $("#searchKey").val(dataList.searchKey);
                $("#en_name").val(fieldVo.enName);
                $("#cn_name").val(fieldVo.cnName);
                $("#fieldTypeId").val(fieldVo.fieldTypeId);
                $("#value_type").html("<option value='"+fieldVo.fieldTypeId+"'>"+fieldVo.fieldType+"</option>");
                $("#valueType").val(fieldVo.valueType);
                $("#isDerivative").val(fieldVo.isDerivative);
                $("#isOutput").val(fieldVo.isOutput);
                $("#restrainScope").val(fieldVo.restrainScope);
                $("#id").val(flist.id);
                divRowid=1;
                //条件区域行
                $("Div[name='divRow']").remove();
                if($("#isDerivative").val()=="1"){
                    $("#derivedFields").show();
                    if(fieldVo.fieldCondList.length>0||fieldFormulaList.length>0) {
                        var html="";
                        whereSelectValue1="";
                        dataSelectListHtml="";
                        dataSelectList=flist;
                        for(var i=0;i<dataSelectList.length;i++) {
                            html+="<option valuescope='"+dataSelectList[i].restrainScope+"' valuetype='"+dataSelectList[i].valueType+"' value='"+dataSelectList[i].id+"'>"+dataSelectList[i].cnName+"</option>"
                        }
                        dataSelectListHtml=html;
                        var  showText=""
                        enumerationselectHtml="";
                        if(fieldVo.valueType=="3"){
                            for (var i=0;i<scopeList.length;i++) {
                                var scopeListarr=scopeList[i].split(':');
                                enumerationselectHtml+="<option  value='"+scopeListarr[1]+"'>"+scopeListarr[0]+"</option>"
                            }
                            showText="<input type=\"text\" name=\"conditionValue\"  style=\"width: 80px;display: none\"> <select name=\"conditionValue\" size=\"1\"  class=\"select conditionValueUpdate\" style=\"width: 80px;\">"+enumerationselectHtml+" </select>";
                            divRowid=1;
                            //条件区域
                            if (fieldVo.fieldCondList==0){
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                            }
                            for(var i=0;i<fieldVo.fieldCondList.length;i++){
                                var fieldSubCond="";
                                if(fieldVo.fieldCondList[i].fieldSubCond.length>0){
                                    fieldSubCond=getOperator(fieldVo.fieldCondList[i].fieldSubCond[0].valueType)
                                }
                                var divRowRightId="divRowRight"+divRowid;
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                                //条件数据行
                                var  conditionContent=JSON.parse(fieldVo.fieldCondList[i].conditionContent);
                                for(var j=0;j<conditionContent.length;j++){
                                    var andShow="";
                                    if(j<=conditionContent.length-2){
                                        andShow="";
                                    }else {
                                        andShow="display: none;";
                                    }
                                    $("#"+divRowRightId).append("<label> <div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight1')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select name=\"fieldId\" class='fieldIdUpdate' size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+html+"</select> <select name=\"operator\" size=\"1\"  class=\"select operatorValue\" style=\"width: 80px\">"+fieldSubCond+"</select> <input type=\"text\" name=\"fieldValue\" class='fieldValue' style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='width: 80px;"+andShow+"' class=\"select logicalValue\" > "+logical+"</select></div> </label>");
                                    var  inputfieldId=$(".fieldIdUpdate:last");
                                    var  inputfieldValue=$(".fieldValue:last");
                                    var  logicalValue=$(".logicalValue:last");
                                    var  operatorValue=$(".operatorValue:last");
                                    var s1=conditionContent[j].fieldId;
                                    var s3=conditionContent[j].fieldValue;
                                    var s4=conditionContent[j].logical;
                                    var s5=conditionContent[j].operator;
                                    inputfieldId.val(s1);
                                    inputfieldValue.val(s3);
                                    logicalValue.val(s4);
                                    operatorValue.val(s5);
                                }

                                var  conditionValue=$(".conditionValueUpdate:last");
                                var s2=fieldVo.fieldCondList[i].conditionValue;
                                conditionValue.val(s2);
                                divRowid++;
                            }
                            //公式编辑
                            $("#formulaEdit2").show();
                            $("#formulaEdit1").hide();
                            $("#inputor").val("");
                            $(".editWhere2").remove();
                            divRowid2=1;
                            if(fieldFormulaList.length==0){
                                var span="";
                                if(i==0){
                                    span="<span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>";
                                }else {
                                    span="<span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span>";
                                }
                                $('#formulaEdit2').append( "<label> <div class='editWhere2'><span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\"  style=\"border-color:#ddd\"></span> <select  size=\"1\"  name=\"fvalue\" class=\"select  selectFvalue\"  style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\" name='formula' id='divRowid"+divRowid2+"' onclick=\"setCursor(divRowid"+divRowid2+"')\" style=\"width: 220px\" value=''><input type=\"hidden\" name=\"farr\"/></div> </label>");
                            }
                            for(var i=0;i<fieldFormulaList.length;i++){
                                var span="";
                                if(i==0){
                                    span="<span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>";
                                }else {
                                    span="<span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span>";
                                }
                                $('#formulaEdit2').append( "<label> <div class='editWhere2'><span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> "+span+" <select  size=\"1\"  name=\"fvalue\" class=\"select  selectFvalue\"  style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\" name='formula' id='divRowid"+divRowid2+" onclick=\"setCursor(divRowid"+divRowid2+"')\" style=\"width: 220px\" value='"+fieldFormulaList[i].formula+"'><input type=\"hidden\" name=\"farr\"/></div> </label>");
                                var  inputfieldId=$(".selectFvalue:last");
                                var s1=fieldFormulaList[i].fvalue;
                                inputfieldId.val(s1);
                                setCursor("divRowid1");
                                divRowid2++;
                            }
                            //setDiv();
                            //初始化 条件区域 公式编辑tab
                            setTextDiv(2);
                            setCursor('inputor');
                        }
                        else {
                            showText="<input type=\"text\" name=\"conditionValue\" class='conditionValueUpdateInput'  style=\"width: 80px;\"> <select name=\"conditionValue\" size=\"1\"  class=\"select\" style=\"width: 80px;display: none\"> </select>";
                            divRowid=1;
                            //条件区域
                            if(fieldVo.fieldCondList==0){
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                                $("#divRowRight"+divRowid).append("<label> <div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight1')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select name=\"fieldId\" class='fieldIdUpdate' size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+html+"</select> <select name=\"operator\" size=\"1\"  class=\"select operatorValue\" style=\"width: 80px\">"+fieldSubCond+"</select> <input type=\"text\" name=\"fieldValue\" class='fieldValue' style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='width: 80px;display: none' class=\"select logicalValue\" ></select></div> </label>");
                            }
                            for(var i=0;i<fieldVo.fieldCondList.length;i++){
                                var fieldSubCond="";
                                if(fieldVo.fieldCondList[i].fieldSubCond.length>0){
                                    fieldSubCond=getOperator(fieldVo.fieldCondList[i].fieldSubCond[0].valueType)
                                }
                                var divRowRightId="divRowRight"+divRowid;
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                                //条件数据行
                                var  conditionContent=JSON.parse(fieldVo.fieldCondList[i].conditionContent);
                                for(var j=0;j<conditionContent.length;j++){
                                    var andShow="";
                                    if(j<=conditionContent.length-2){
                                        andShow="";
                                    }else {
                                        andShow="display: none;";
                                    }
                                    $("#"+divRowRightId).append("<label> <div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight1')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select name=\"fieldId\" class='fieldIdUpdate' size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+html+"</select> <select name=\"operator\" size=\"1\"  class=\"select operatorValue\" style=\"width: 80px\">"+fieldSubCond+"</select> <input type=\"text\" name=\"fieldValue\" class='fieldValue' style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='width: 80px;"+andShow+"' class=\"select logicalValue\" > "+logical+"</select></div> </label>");
                                    var  inputfieldId=$(".fieldIdUpdate:last");
                                    var  inputfieldValue=$(".fieldValue:last");
                                    var  logicalValue=$(".logicalValue:last");
                                    var  operatorValue=$(".operatorValue:last");
                                    var s1=conditionContent[j].fieldId;
                                    var s3=conditionContent[j].fieldValue;
                                    var s4=conditionContent[j].logical;
                                    var s5=conditionContent[j].operator;
                                    inputfieldId.val(s1);
                                    inputfieldValue.val(s3);
                                    logicalValue.val(s4);
                                    operatorValue.val(s5);
                                }

                                var  conditionValue=$(".conditionValueUpdateInput:last");
                                var s2=fieldVo.fieldCondList[i].conditionValue;
                                conditionValue.val(s2);
                                divRowid++;
                            }
                            //公式编辑
                            $("#formulaEdit2").hide();
                            $("#formulaEdit1").show();
                            $("#inputor").val("");
                            $("#editWhere2").remove();
                            divRowid2=1;
                            if(fieldFormulaList.length>0){
                                $("#inputor").val(fieldFormulaList[0].formula);
                            }else {
                                $("#inputor").val("");
                            }
                            $('#formulaEdit2').append(" <label><div class='editWhere2'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>             <select  size=\"1\" name=\"fvalue\"  class=\"inputor\"   style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\"  onclick=\"setCursor('divRowid1')\" name='formula' id='divRowid1' style=\"width: 220px\" > <input type=\"hidden\" name=\"farr\"/> </div> </div></label>");
                            //setDiv();
                            //初始化 条件区域 公式编辑tab
                            setTextDiv(2);
                            setCursor('inputor');
                        }
                    }
                }
                else {
                    $("#derivedFields").hide();
                    if(true) {
                        var html="";
                        whereSelectValue1="";
                        dataSelectListHtml="";
                        dataSelectList=flist;
                        for(var i=0;i<dataSelectList.length;i++) {
                            html+="<option valuescope='"+dataSelectList[i].restrainScope+"' valuetype='"+dataSelectList[i].valueType+"' value='"+dataSelectList[i].id+"'>"+dataSelectList[i].cnName+"</option>"
                        }
                        dataSelectListHtml=html;
                        var  showText=""
                        enumerationselectHtml="";
                        if(fieldVo.valueType=="3"){
                            for(var i=0;i<scopeList.length;i++) {
                                var scopeListarr=scopeList[i].split(':');
                                enumerationselectHtml+="<option  value='"+scopeListarr[1]+"'>"+scopeListarr[0]+"</option>"
                            }
                            showText="<input type=\"text\" name=\"conditionValue\"  style=\"width: 80px;display: none\"> <select name=\"conditionValue\" size=\"1\"  class=\"select conditionValueUpdate\" style=\"width: 80px;\">"+enumerationselectHtml+" </select>";
                            divRowid=1;
                            //条件区域
                            if (fieldVo.fieldCondList==0){
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                            }
                            // //公式编辑
                            $("#inputor").val("");
                            $("#editWhere2").remove();
                            divRowid2=1;
                            if(fieldFormulaList.length==0){
                                var span="";
                                if(i==0){
                                    span="<span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>";
                                }else {
                                    span="<span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span>";
                                }
                                $('#formulaEdit2').append( "<label> <div class='editWhere2'><span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\"  style=\"border-color:#ddd\"></span> <select  size=\"1\"  name=\"fvalue\" class=\"select  selectFvalue\"  style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\" name='formula' id='divRowid"+divRowid2+"' onclick=\"setCursor(divRowid"+divRowid2+"')\" style=\"width: 220px\" value=''><input type=\"hidden\" name=\"farr\"/></div> </label>");
                            }

                        }
                        else {
                            showText="<input type=\"text\" name=\"conditionValue\" class='conditionValueUpdateInput'  style=\"width: 80px;\"> <select name=\"conditionValue\" size=\"1\"  class=\"select\" style=\"width: 80px;display: none\"> </select>";
                            divRowid=1;
                            //条件区域
                            if(fieldVo.fieldCondList==0){
                                $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> "+ showText+"</label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\">  </div> </div>");
                                $("#divRowRight"+divRowid).append("<label> <div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight1')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select name=\"fieldId\" class='fieldIdUpdate' size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+html+"</select> <select name=\"operator\" size=\"1\"  class=\"select operatorValue\" style=\"width: 80px\">"+fieldSubCond+"</select> <input type=\"text\" name=\"fieldValue\" class='fieldValue' style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='width: 80px;display: none' class=\"select logicalValue\" ></select></div> </label>");
                            }
                            $("#inputor").val("");
                            $(".editWhere2").remove();
                            divRowid2=1;
                            if(fieldFormulaList.length>0){
                                $("#inputor").val(fieldFormulaList[0].formula);
                            }else {
                                $("#inputor").val("");
                            }
                            $('#formulaEdit2').append(" <label><div class='editWhere2'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\"  style=\"border-color:#ddd\"></span>             <select  size=\"1\" name=\"fvalue\"  class=\"inputor\"   style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\"  onclick=\"setCursor('divRowid1')\" name='formula' id='divRowid1' style=\"width: 220px\" > <input type=\"hidden\" name=\"farr\"/> </div> </div></label>");
                        }
                    }
                }
            }, "application/json"
        );
    }
}
function update(sign,id){
    $('#nameCode').val("");
    $('input[name="name_dict"]').val("");
    $('input[name="isCatagory"]:checked').attr("checked",false);
    $('textarea[name="remark"]').val("");
    var titleName = "添加";
    if(sign!=1){
        selfid=sign[1];
        // 编辑
        titleName = "编辑";
        Comm.ajaxGet(
            "dict/detail?id="+sign[1],
            "",
            function(data){
                var dict = data.data;
                var isCatagory=dict.isCatagory;
                if(isCatagory=='Y'){
                    $('#isCatagory_Y').attr('checked','checked');
                }else{
                    $('#isCatagory_N').attr('checked','checked');
                }
                $('input[name="name_code"]').val(dict.code);
                $('input[name="name_dict"]').val(dict.name);
                $('textarea[name="remark"]').val(dict.remark);
            }
        );
        openLayer(titleName,id,selfid);
    }else{
        selfid=null;
        openLayer(titleName,id,selfid);
    }
}
function openLayer(titleName,id,selfid){
    var id=id;
    layerIndex = layer.open({
        type : 1,
        title : titleName,
        maxmin : true,
        shadeClose : true, //点击遮罩关闭层
        area : [ '600px', '' ],
        content : $('#Add_Dic_style')
    });
    assortSelect(id,selfid);
}
function save(){
    var selectType=$('select[name="selectType"]').val();
    var nameCode=$('input[name="name_code"]').val();
    var name=$('input[name="name_dict"]').val();
    var isCatagory=$('input[type="radio"]:checked').val();
    var remark=$('textarea[name="remark"]').val();
    var id=selfid;
    var dict={
        id:id,
        code:nameCode,
        name:name,
        isCatagory:isCatagory,
        remark:remark,
        parentId:selectType
    }
    Comm.ajaxPost(
        'dict/add',JSON.stringify(dict),
        function(data){
            layer.msg("保存成功",{time:1000},function(){
                $.jstree.reference("#jstree").refresh();
            });
        }, "application/json"
    );
}
function assortSelect(id,selfid){
    var id;
    if(id){
        id=id;
    }else{
        id=Number(selfid);
    }
    Comm.ajaxGet(
        "dict/getCatagory",
        '',
        function(data){
            var dataList=data.data;
            var html="";
            for(var i=0;i<dataList.length;i++){
                if(($.contains($("#"+id) ,$("ul") ))==false){
                    var dataId=$("#"+id).parent().parent().attr("id");
                    if(dataId==dataList[i].id){
                        html+="<option value='"+dataList[i].id+"' selected>"+dataList[i].name+"</option>"
                    }
                    $('select[name="selectType"]').css("background","#F8F8F8");
                    $('select[name="selectType"]').attr("disabled",true);
                }else{
                    if(id==dataList[i].id){
                        html+="<option value='"+dataList[i].id+"' selected>"+dataList[i].name+"</option>"
                    }else{
                        html+="<option value='"+dataList[i].id+"'>"+dataList[i].name+"</option>"
                    }
                }
            }
            $('select[name="selectType"]').html(html);
        }
    )
}
function setDiv() {
    var  value=$("#valueType").val();
    //var selectNode=sign.next('select');
    if(value=="3") {
        $("#formulaEdit2").show();
        $("#formulaEdit1").hide();
        $("input[name='conditionValue']").hide();
        $("select[name='conditionValue']").show();
        setSelectList();
        setCursor('divRowid1');
    }else{
        $("#formulaEdit1").show();
        $("#formulaEdit2").hide();
        $("input[name='conditionValue']").show();
        $("select[name='conditionValue']").hide();
        setCursor('inputor');
    }
}
function  setTextDiv(sign) {
    if (sign=="1"){
        $("#regionDiv").show();
        $("#region").css({"color":"#398DEF"});
        $("#formulaDiv").hide();
        $("#formul").css({"color":"initial"});
    }else {
        $("#regionDiv").hide();
        $("#region").css({"color":"initial"});
        $("#formulaDiv").show();
        $("#formul").css({"color":"#398DEF"});
    }
}
function getOperator(valueType){
    var operator;
    if(valueType == '1' || valueType == '4'){
        operator =digitalType;
    }else if(valueType == '2'){
        operator =characterType;
    }else if(valueType == '3'){
        operator =enumerationType;
    }
    return operator;
}
function  setSelect(me) {
    me=$(me);
    var selectNode=me.next('select');
    var valueType=me.find("option:selected").attr("valuetype");
    selectNode.find("option").remove();
    selectNode.html(getOperator(valueType));
}
var divRowid=1;
var divRowid2=1;
//增加条件区域
function addTermRulsLi(me,sign,sign1) {
    var  fieldByUserWhereHtml="";
    if (dataSelectList.length>0) {
        fieldByUserWhereHtml=getOperator(dataSelectList[0].valueType);
    }
    var  fieldType=$("#valueType");
    //var selectNode=sign.next('select');
    var value=fieldType.find("option:selected").attr("value");
    var inputShow="display: ;";
    var selectShow="display: none;";
    if(value=="3") {
        inputShow="display: none;";
        selectShow="display: ;";
    }
    if(sign=="1"){
        divRowid++;
        $('#regionDiv').append("<div style=\"width: 620px;overflow: hidden\" name=\"divRow\" class=\"c-inclusion\" id=\"divRow"+divRowid+"\"> <div class=\"Remark c-operation-inclusion\" style=\"width: 160px;border-right:1px dashed #000;float:left\"  id=\"divRowLeft"+divRowid+"\"> <label> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,1,'')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,1,'')\"></span> <input type=\"hidden\" name=\"fieldContent2\"> <input type=\"text\" name=\"conditionValue\" style=\"width: 80px;"+inputShow+"\"> <select name=\"conditionValue\" size=\"1\"  class=\"select\" style=\"width: 80px;"+selectShow+"\"> "+enumerationselectHtml+"</select></label> </div> <div class=\"Remark c-optional-rules\" style=\"width:460px;float:right;text-align:left;\"  id=\"divRowRight"+divRowid+"\"> <label><div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'divRowRight"+divRowid+"')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight"+divRowid+"')\"></span> <select name=\"fieldId\" size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+dataSelectListHtml+"</select> <select name=\"operator\" size=\"1\"  class=\"select\" style=\"width: 80px\"> "+fieldByUserWhereHtml+" </select> <input type=\"text\" name=\"fieldValue\" style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='display: none;width: 80px' class=\"select\" > "+logical+"</select></div> </label> </div> </div>");
    }
    if(sign=="2"){
        $('#'+sign1+ '  select:last').css({"display":""})
        $('#'+sign1).append("<label><div class='c-optional-rules-rules'> <span class=\"iconaddData\" onclick=\"addTermRulsLi(this,2,'"+sign1+"')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'"+sign1+"')\"></span> <select name=\"fieldId\" size=\"1\"  onchange='setSelect(this)'  class=\"select\" style=\"width: 80px\"> "+dataSelectListHtml+"</select> <select name=\"operator\" size=\"1\"  class=\"select\" style=\"width: 80px\"> "+fieldByUserWhereHtml+" </select> <input type=\"text\" name=\"fieldValue\" style=\"width: 80px\"> <select  size=\"1\"  name=\"logical\" style='display: none;width: 80px' class=\"select\" > "+logical+"</select> </div></label> ");
    }
    if(sign=="3")
    {
        $('#'+sign1).append( "<label> <div class='editWhere2'><span class=\"iconaddData\" onclick=\"addTermRulsLi(this,3,'formulaEdit2')\"></span> <span class=\"iconclearData\" onclick=\"deleteTermRulsLi(this,2,'divRowRight1')\"></span> <select  size=\"1\"  name=\"fvalue\" class=\"select\"  style=\"width:220px\"> "+enumerationselectHtml+"</select> <span>    =  </span> <input type=\"text\" name='formula' id='divRowid"+divRowid2+" onclick=\"setCursor(divRowid"+divRowid2+"')\" style=\"width: 220px\"><input type=\"hidden\" name=\"farr\"/></div> </label>");
        setCursor("divRowid1");
    }
}
//删除条件区域
function deleteTermRulsLi(me,sign,sign1) {
    if(sign=="1"){
        var targetLi=me.parentNode.parentNode.parentNode;
        $(targetLi).remove();
        var liLength=$("#TermRulsLi li").size();
        if(liLength==1) {
            isFirstTerm = 0;
        }
    }
    if(sign=="2"){
        var targetLi=me.parentNode;
        var targetLi1=targetLi.parentNode.size;
        $(targetLi).remove();
        var liLength=$("#TermRulsLi1 li").size();
        if(liLength==1) {
            isFirstTerm = 0;
        }
        $('#'+sign1+ '  select:last').css({"display":"none"})
    }
}
//是否衍生字段
function setDerivative() {
    if($("#isDerivative").val()=="1") {
        $("#derivedFields").show();
    }else{
        $("#derivedFields").hide();
    }
}
//修改枚举变量
function setSelectList() {
    var  value=$("#restrainScope").val();
    if($("#valueType").val()=="3") {
        var reg = new RegExp("^([\u4e00-\u9fa5()\\[\\]（）A-Za-z0-9\_\-]+:[0-9]+(,)?)+$");
        if(value == ''){
            return false;
        }else if(!reg.test(value)){
            return false;
        }else{
            var arr=value.split(',');
            enumerationselect={
                push:Array.prototype.push
            };
            for(var i=0;i<arr.length;i++){
                var arr1=arr[i].split(':');
                if(arr1.length>0) {
                    var  va1=arr1[0];
                    var  va2=arr1[1];
                    enumerationselect.push({
                        key:arr1[0],
                        val:arr1[1]
                    });
                }
            }
            enumerationselectHtml="";
            for(var i=0;i<enumerationselect.length;i++){
                var  ss=enumerationselect[i];
                enumerationselectHtml+="<option  value='"+enumerationselect[i].val+"'>"+enumerationselect[i].key+"</option>"
            }
            $("select[name='conditionValue']").html(enumerationselectHtml);
            $("select[name='fvalue']").html(enumerationselectHtml);
        }
    }
}
$(".c-operational-character , .c-operational-characterTwo").on("mouseenter",function(){
    $(this).find(".c-operator-show").hide();
    $(this).find(".c-operator-hide").show();
})
$(".c-operational-character , .c-operational-characterTwo").on("mouseleave",function(){
    $(this).find(".c-operator-show").show();
    $(this).find(".c-operator-hide").hide();
});
//公式编辑
//获取光标位置
(function($, undefined) {
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})(jQuery);
var dataId,cursor,cursorid;
function setCursor(id) {
    cursorid=id;
    cursor=$("#"+id);
    cursor.focus();
}
//点击公式方法
function character(sign){
    if (cursor!=null){
        dataId=$(sign).attr("dataId");
        var strIndex=cursor.getCursorPosition();
        console.log(strIndex);
        var content=cursor.val();
        var str1=content.slice(0,strIndex);
        console.log(str1);
        var str2=content.slice(strIndex,content.length);
        console.log(str2);
        //var txtFocus = cursor;
        var txtFocus = document.getElementById(cursorid);
        switch (dataId) {
            case '0':
                str1=str1+'+';

                break;
            case '1':
                str1=str1+'-';
                break;
            case '2':
                str1=str1+'*';
                break;
            case '3':
                str1=str1+'/';
                break;
            case '7':
                str1=str1+'()';
                break;
            default:

                break;
        }
        var newContent=str1+str2;
        cursor.val(newContent);
        if(dataId==7){
            var position=str1.length-1;
            txtFocus.setSelectionRange(position,position);//设置光标位置，不适用IE
            cursor.focus();
        }else{
            var position=str1.length;
            txtFocus.setSelectionRange(position,position);
            cursor.focus();
        }
    }
};
//点击公式方法
function characterTwo(sign) {
    if (cursor!=null){
        dataId=$(sign).attr("dataId");
        var strIndex=cursor.getCursorPosition();
        console.log(strIndex);
        var content=cursor.val();
        var str1=content.slice(0,strIndex);
        console.log(str1);
        var str2=content.slice(strIndex,content.length);
        console.log(str2);
        //var txtFocus = cursor;
        var txtFocus = document.getElementById(cursorid);
        switch (dataId) {
            case '4':
                str1=str1+'sqrt()';
                break;
            case '5':
                str1=str1+'ln()';
                break;
            case '6':
                str1=str1+'avg()';
                break;
            case '8':
                str1=str1+'abs()';
                break;
            case '9':
                str1=str1+'max()';
                break;
            case '10':
                str1=str1+'min()';
                break;
            case '11':
                str1=str1+'lg()';
                break;
            case '12':
                str1=str1+'exp()';
                break;
            case '13':
                str1=str1+'ceil()';
                break;
            case '14':
                str1=str1+'floor()';
                break;
            case '15':
                str1=str1+'PI';
                break;
            default:
                break;
        };
        var newContent=str1+str2;
        cursor.val(newContent);
        var position=str1.length;
        txtFocus.setSelectionRange(position,position);
        cursor.focus();
    }}

//字段根据引擎是否为空分别跳转到数据管理模块和字段映射模块
function fieldGo(obj){
    var _engineId = obj.attributes['engineId'].nodeValue;
    console.log(_engineId);
    var _url;
    if(_engineId=='null'){
        _url = _ctx+"/datamanage/field?parentId=3";
    }
    else{
        _url = _ctx+"/engineManage/fieldmapping?parentId=1&&engineId="+_engineId;
    }
    window.open(_url);
}

//黑白名单跳转数据管理模块
function bwListGo(obj){
    var _dataid = obj.attributes['dataid'].nodeValue;
    var _url;
    if(_dataid!='null'){
        _url = _ctx+"/datamanage/field?parentId=3";
    }
    window.open(_url);
}

//规则根据引擎是否为空分别跳转规则管理-规则集模块和引擎管理的知识库模块
function ruleManageGo(obj){
    var _engineId = obj.attributes['engineId'].nodeValue;
    var _url;
    if(_engineId!='null'){
        _url = _ctx+"/knowledge/tree?parentId=1&engineId="+_engineId;
    }else{
        _url = _ctx+"/knowledge/tree?parentId=2";
    }
    window.open(_url);
}

//引擎管理的节点跳转到决策流模块
function decisionFlowGo(obj){
    var _engineId = obj.attributes['engineId'].nodeValue;
    var _url;
    if(_engineId!='null'){
        _url = _ctx+"/decision_flow?parentId=1&id="+_engineId;
    }
    window.open(_url);
}


