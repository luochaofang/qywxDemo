var g_userManage = {
    tableCustomer : null,
    currentItem : null,
    fuzzySearch : false,
    getQueryCondition : function(data) {
        var paramFilter = {};
        var page = {};
        var param = {};
        param.state="12";
        param.personName=null;
        param.beginTime=null;
        param.endTime=null;
        paramFilter.param = param;
        page.firstIndex = data.start == null ? 0 : data.start;
        page.pageSize = data.length  == null ? 10 : data.length;
        paramFilter.page = page;
        return paramFilter;
    }
};
// $(function (){
//     if(g_userManage.tableCustomer){
//         g_userManage.tableCustomer.ajax.reload();
//     }else{
//         g_userManage.tableCustomer = $('#fee_list').dataTable($.extend({
//             'iDeferLoading':true,
//             "bAutoWidth" : false,
//             "Processing": true,
//             "ServerSide": true,
//             "sPaginationType": "full_numbers",
//             "bPaginate": true,
//             "bLengthChange": false,
//             "destroy":true,
//             "dom": 'rt<"bottom"i><"bottom"flp><"clear">',
//             "ajax" : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
//                 var queryFilter = g_userManage.getQueryCondition(data);
//                 Comm.ajaxPost('quato/quatoList', JSON.stringify(queryFilter), function (result) {
//                     //封装返回数据
//                     debugger
//                     var returnData = {};
//                     var resData = result.data.list;
//                     var resPage = result.data;
//                     returnData.draw = data.draw;
//                     returnData.recordsTotal = resPage.total;
//                     returnData.recordsFiltered = resPage.total;
//                     returnData.data = resData;
//                     callback(returnData);
//                 },"application/json");
//             },
//             "order": [],
//             "columns": [
//                 {"data": null ,"searchable":false,"orderable" : false},
//                 {"data": "id","orderable" : false,"class":'hidden'},
//                 {"data": "pro_quota_limit","orderable" : false},
//                 {"data": "pro_quota_proportion","orderable" : false},
//                 {
//                     "data": "status", "orderable": false,
//                     "render": function (data, type, row, meta) {
//                         if (data == 1) {
//                             return "启用";
//                         } else if (data == 0) {
//                             return "停用";
//                         } else {
//                             return "";
//                         }
//                     }
//                 },
//                 {
//                     "data": "null", "orderable": false,
//                     "defaultContent":""
//                 }
//             ],
//
//             "createdRow": function ( row, data, index,settings,json ) {
//                 var btnUpdate = $('<a class="tabel_btn_style" onclick="editDetail(\'2\',\''+data.id+'\')">修改 </a>&nbsp; ');
//                 // var btnDetele = $(' &nbsp; <a class="tabel_btn_style" onclick="deleteDetail(\'1\',\''+data.id+'\')"> 删除</a>');
//                 var btnOpen = $(' &nbsp; <a class="tabel_btn_style" onclick="deleteDetail(\'2\',\''+data.id+'\')"> 启用</a>');
//                 var btnClose = $(' &nbsp; <a class="tabel_btn_style" onclick="deleteDetail(\'3\',\''+data.id+'\')"> 停用</a>');
//                 if(data.status == '0'){
//                     $('td', row).eq(5).append(btnUpdate).append(btnOpen);
//                 }else{
//                     $('td', row).eq(5).append(btnUpdate).append(btnClose);
//                 }
//
//             },
//         }, CONSTANT.DATA_TABLES.DEFAULT_OPTION)).api();
//         g_userManage.tableCustomer.on("order.dt search.dt", function() {
//             g_userManage.tableCustomer.column(0, {
//                 search : "applied",
//                 order : "applied"
//             }).nodes().each(function(cell, i) {
//                 cell.innerHTML = i + 1
//             })
//         }).draw();
//     }
// });
//添加修改费率
function  editDetail(type,id) {
    if (type=='1'){
        layerIndex = layer.open({
            type : 1,
            title : "新增额度",
            maxmin : true,
            shadeClose : false, //点击遮罩关闭层
            area : [ '600px', '240px'  ],
            content : $('#editDetail'),
            btn : [ '提交', '取消' ],
            success: function () {
                $("#pro_quota_limit").val('');
                $("#pro_quota_proportion").val('');
            },
            yes:function(index, layero){
                var pro_quota_limit=$("#pro_quota_limit").val();
                var pro_quota_proportion=$("#pro_quota_proportion").val();
                if($("#pro_quota_limit").val()==""){
                    layer.alert("额度上限！",{icon: 2, title:'操作提示'});
                    return
                }
                if($("#pro_quota_proportion").val()==""){
                    layer.alert("提额比例！",{icon: 2, title:'操作提示'});
                    return
                }
                var param = {};
                param.pro_quota_limit=$("#pro_quota_limit").val();
                param.pro_quota_proportion= $("#pro_quota_proportion").val();
                param.status = '0';
                Comm.ajaxPost('quato/addQuato', JSON.stringify(param), function (result) {
                    layer.msg(result.msg,{time:1000},function () {
                        if (result.code=="0"){
                            layer.closeAll();
                            g_userManage.tableCustomer.ajax.reload();
                        }
                    });
                },"application/json");
            }
        })
    }else {
        layerIndex = layer.open({
            type : 1,
            title : "编辑额度",
            maxmin : true,
            shadeClose : false, //点击遮罩关闭层
            area : [ '600px', '240px'  ],
            content : $('#editDetail'),
            btn : [ '提交', '取消' ],
            success: function () {
                var param = {};
                param.id=id;
                Comm.ajaxPost('quato/getQuato', JSON.stringify(param), function (result) {
                    var resData = result.data;
                    $("#pro_quota_limit").val(resData.pro_quota_limit);
                    $("#pro_quota_proportion").val(resData.pro_quota_proportion);
                },"application/json");
            },
            yes:function(index, layero){
                var pro_quota_limit=$("#pro_quota_limit").val();
                var pro_quota_proportion=$("#pro_quota_proportion").val();
                if($("#pro_quota_limit").val()==""){
                    layer.alert("额度上限！",{icon: 2, title:'操作提示'});
                    return
                }
                if($("#pro_quota_proportion").val()==""){
                    layer.alert("提额比例！",{icon: 2, title:'操作提示'});
                    return
                }
                var param = {};
                param.id=id;
                param.pro_quota_limit = pro_quota_limit;
                param.pro_quota_proportion = pro_quota_proportion;
                Comm.ajaxPost('quato/updateQuato', JSON.stringify(param), function (result) {
                    layer.msg(result.msg,{time:1000},function () {
                        if (result.code=="0"){
                            layer.closeAll();
                            g_userManage.tableCustomer.ajax.reload();
                        }
                    });
                },"application/json");
            }
        })
    }
}
//启用停用
//删除费率
function  deleteDetail(type,id) {
    var param = {};
    if(type == '1'){
        param.status="2";
    }else if(type == '2'){
        param.status="1";
    }else if(type == "3"){
        param.status="0";
    }
    param.id = id;
    Comm.ajaxPost('quato/updateQuato', JSON.stringify(param), function (result) {
        layer.msg(result.msg,{time:1000},function () {
            if (result.code=="0"){
                g_userManage.tableCustomer.ajax.reload();
            }
        });
    },"application/json");
}


$(function (){
    layerIndex = layer.open({
        type : 1,
        title : "折扣配置",
        shadeClose : false, //点击遮罩关闭层
        area : [ '550px', '180px' ],
        closeBtn: 0,
        content : $('#editDetail').show(),
        btn : '保存',
        success :function () {
            Comm.ajaxPost('quato/getQuatoList',null, function (result) {
                var resData = result.data;
                debugger
                $("#pro_quota_limit").val(resData.pro_quota_limit);
                $("#pro_quota_proportion").val(resData.pro_quota_proportion);
                $("#sltReduction").val(resData.status);
                $("#hId").val(resData.id);
            })
        },
        yes:function(index, layero){
            if($("#pro_quota_limit").val()==""){
                layer.alert("请输入额度上限！",{icon: 2, title:'操作提示'});
                return
            }
            if($("#pro_quota_proportion").val()==""){
                layer.alert("请输入提额比例！",{icon: 2, title:'操作提示'});
                return
            }

            if(isNaN($("#pro_quota_limit").val())){
                layer.alert("额度上限格式有误！",{icon: 2, title:'操作提示'});
                return
            }
            if(isNaN($("#pro_quota_proportion").val())){
                layer.alert("提额比例格式有误！",{icon: 2, title:'操作提示'});
                return
            }
            var param = {};
            param.id=$("#hId").val();
            param.pro_quota_limit = $("#pro_quota_limit").val();
            param.pro_quota_proportion = $("#pro_quota_proportion").val();
            param.status=$("#sltReduction").val();
            param.id=$("#hId").val();
            Comm.ajaxPost('quato/updateQuato', JSON.stringify(param), function (result) {
                layer.msg(result.msg,{time:1000},function () {
                    // if (result.code=="0"){
                    //     layer.closeAll();
                    //     //g_userManage.tableCustomer.ajax.reload();
                    // }
                });
            },"application/json");
        }
    })

})

function  updateQuato() {
    debugger
    var param = {};
    param.id=$("#hId").val();
    param.pro_quota_limit = $("#pro_quota_limit").val();
    param.pro_quota_proportion = $("#pro_quota_proportion").val();
    param.status=$("#sltReduction").val();
    param.id=$("#hId").val();
    Comm.ajaxPost('quato/updateQuato', JSON.stringify(param), function (result) {
        layer.msg(result.msg,{time:1000},function () {
            if (result.code=="0"){
                layer.closeAll();
                //g_userManage.tableCustomer.ajax.reload();
            }
        });
    },"application/json");
}