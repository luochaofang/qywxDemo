/**
 * Created by Administrator on 2017/5/2 0002.
 */
var g_extendContentMg = {
    tableUser : null,
    currentItem : null,
    fuzzySearch : false,
    getQueryCondition : function(data) {
        var paramFilter = {};
        var page = {};
        var param = {};

        //自行处理查询参数
        param.fuzzySearch = g_extendContentMg.fuzzySearch;
        if (g_extendContentMg.fuzzySearch) {
            param.account = $("[name='account']").val();
            param.trueName = $("[name='trueName']").val();
            param.tel = $("[name='mobile']").val();
        }
        paramFilter.param = param;

        page.firstIndex = data.start == null ? 0 : data.start;
        page.pageSize = data.length  == null ? 10 : data.length;
        paramFilter.page = page;

        return paramFilter;
    }
};
//初始化表格数据
$(function (){
    g_extendContentMg.tableUser = $('#ExtendContent_list').dataTable($.extend({
        'iDeferLoading':true,
        "bAutoWidth" : false,
        "Processing": true,
        "ServerSide": true,
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bLengthChange": false,
        "dom": 'rt<"bottom"i><"bottom"flp><"clear">',
        "ajax" : function(data, callback, settings) {
            var queryFilter = g_extendContentMg.getQueryCondition(data);
            Comm.ajaxPost('extendManage/contentListPage',JSON.stringify(queryFilter),function(result){
                var returnData = {};
                var resData = result.data.list;
                var resPage = result.data;

                returnData.draw = data.draw;
                returnData.recordsTotal = resPage.total;
                returnData.recordsFiltered = resPage.total;
                returnData.data = resData;
                callback(returnData);
            },"application/json")

        },
        "order": [],
        "columns" :[
            {
                'data':null,
                "searchable":false,"orderable" : false
            },
            {"data":'title',"searchable":false,"orderable" : false},
            {"data":'contentType',"searchable":false,"orderable" : false},
            {
                "data":"addtime",
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data == null){
                        return "";
                    }else return json2TimeStamp(data);
                }
            },
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data.status === 1){
                        return '启用'
                    }else{
                        return '停用'
                    }
                }
            },
            {
                "data": "null", "orderable": false,
                "defaultContent":""
            }
        ],
        "createdRow": function ( row, data, index,settings,json ) {
            var whiteStatusStr = "启用";
            if(data.status === 1) {
                whiteStatusStr = "停用";
            }
            var btnDel = $('<a class="tabel_btn_style" onclick="updateWhite(0,\''+data.id+'\')">修改</a>&nbsp;<a class="tabel_btn_style" onclick="updateStatue('+data.status+' ,\''+data.id+'\')">'+whiteStatusStr+'</a>&nbsp;<a class="tabel_btn_style_dele" onclick="deleteContent(\'+data.id+\')">删除</a>');
            $('td', row).eq(5).append(btnDel);
        },
        "initComplete" : function(settings,json) {
            //搜索
            $("#btn_search").click(function() {
                g_extendContentMg.fuzzySearch = true;
                g_extendContentMg.tableUser.ajax.reload(function(){
                    $("#userCheckBox_All").attr("checked",false);
                });
            });
            //全选
            $("#userCheckBox_All").click(function(J) {
                if (!$(this).prop("checked")) {
                    $("#User_list tbody tr").find("input[type='checkbox']").prop("checked", false)
                } else {
                    $("#User_list tbody tr").find("input[type='checkbox']").prop("checked", true)
                }
            });
            //重置
            $("#btn_search_reset").click(function() {
                $('input[name="account"]').val("");
                $('input[name="trueName"]').val("");
                $('input[name="mobile"]').val("");
                g_extendContentMg.fuzzySearch = true;
                g_extendContentMg.tableUser.ajax.reload(function(){
                    $("#userCheckBox_All").attr("checked",false);
                });
            });
            //单选行
            $("#User_list tbody").delegate( 'tr','click',function(e){
                var target=e.target;
                if(target.nodeName=='TD'){
                    var input=target.parentNode.children[1].children[0];
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
        }
    }, CONSTANT.DATA_TABLES.DEFAULT_OPTION)).api();
    g_extendContentMg.tableUser.on("order.dt search.dt", function() {
        g_extendContentMg.tableUser.column(0, {
            search : "applied",
            order : "applied"
        }).nodes().each(function(cell, i) {
            cell.innerHTML = i + 1
        })
    }).draw()
});

//删除推广内容
function deleteContent(id){
    var userIds = new Array();
    userIds.push(id);
    layer.confirm('是否删除推广内容？', {
        btn : [ '确定', '取消' ]
    }, function() {
        Comm.ajaxPost(
            'deleteContent', JSON.stringify(userIds),
            function(data){
                layer.closeAll();
                layer.msg(data.msg,{time:2000},function () {
                    g_extendContentMg.tableUser.ajax.reload(function(){
                        $("#userCheckBox_All").attr("checked",false);
                    });
                });
            },"application/json");
    });
}

//更新推广内容状态
function updateStatue(status, id){
    $.ajax({
        type : "POST",
        url : "updateContent",
        contentType: "application/json",
        data : JSON.stringify({id : id, status : status === 0 ? '1': '0' }),
        async : true,
        dataType : 'json',
        success : function(data) {
            layer.msg(data.msg,{time:2000},function () {
                g_extendContentMg.tableUser.ajax.reload(function(){
                });
            });
        }
    });
}

//添加、编辑用户信息
function updateUser(sign,id) {
    if(sign==0){
        $('#organ').html("");
        Comm.ajaxPost('user/detail',JSON.stringify(id),function(data){
                layer.closeAll();
                var user=data.data.user;
                var organStatus;
                Comm.ajaxPost('sysDepartment/findOne',"orgId="+user.orgId,function(data){
                        var organ=data.data;
                        if(organ){
                            organStatus = organ.status;//所属组织的状态
                            $("#deptPname").val(organ.name);
                        }else{
                            $("#deptPname").val("");
                        }
                    });
                $('input[name="user_account"]').val(user.account);
                $('input[name="user_mobile"]').val(user.tel);
                $('input[name="user_email"]').val(user.email);
                $('input[name="user_trueName"]').val(user.trueName);
                $("#organ").attr('disabled',true);
                $("#deptPid").val(user.orgId);
                if(user.status==1){
                    $("#qiyong").attr('selected','selected');
                }else{
                    $("#jinyong").attr('selected','selected');
                }
                $("#remark").val(user.remark);
                $("#isEdit").hide();
                layer.open({
                    type : 1,
                    title : '修改用户',
                    area : [ '576px', '370px' ],
                    content : $('#Add_user_style'),
                    btn : [ '保存', '取消' ],
                    yes : function(index, layero) {
                        if ($('input[name="user_account"]').val() == "") {
                            layer.msg("登录用户名不能为空",{time:2000});
                            return;
                        }
                        if ($('input[name="user_mobile"]').val() == "") {
                            layer.msg("手机号码不能为空",{time:2000});
                            return;
                        }
                        if ($('input[name="user_trueName"]').val() == "") {
                            layer.msg("真实姓名不能为空",{time:2000});
                            return;
                        }

                        var account=$('input[name="user_account"]').val();
                        var email=$('input[name="user_email"]').val();
                        var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                        if(email){
                            if(!emailReg.test(email)){
                                layer.msg("邮箱格式不正确",{time:2000});
                                return;
                            }
                        }
                        var tel=$('input[name="user_mobile"]').val();
                        var mobileReg=/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
                        if(!mobileReg.test(tel)){
                            layer.msg("手机号码格式不正确",{time:2000});
                            return;
                        }
                        var deptpname2 = $("#deptPname").val();
                        if(deptpname2 == ""){
                            layer.msg("请选择所属机构",{time:2000});
                            return;
                        }
                        var trueName=$('input[name="user_trueName"]').val();
                        var remark=$("#remark").val();
                        var isLock=$("#isLock").val();
                        var orgId = $("#deptPid").val();
                        if(organStatus==0 && isLock==1){
                            layer.msg("所属组织停用，状态不可更改！",{time:2000},function () {
                                $("#jinyong").attr('selected','selected');
                            });
                            return
                        }
                        var user={
                            account:account,
                            email:email,
                            tel:tel,
                            trueName:trueName,
                            remark:remark,
                            userId:id,
                            isLock:parseInt(isLock),
                            status:parseInt(isLock),
                            orgId:orgId
                        };
                        Comm.ajaxPost(
                            'user/edit',JSON.stringify(user),
                            function(data){
                                layer.closeAll();
                                layer.msg(data.msg,{time:2000},function () {
                                    $('#User_list').dataTable().fnDraw(false);
                                });
                            }, "application/json"
                        );
                    }
                });
            },"application/json","","","",false);
    }else{
        $("#organ").attr('disabled',false);
        $("#isEdit").show();
        $('input[name="user_account"]').val("");
        $('input[name="user_password"]').val("");
        $('input[name="user_mobile"]').val("");
        $('input[name="user_email"]').val("");
        $('input[name="user_trueName"]').val("");
        $('#deptPname').val("");
        $('#deptPid').val("");
        $("#remark").val("");
        $("#qiyong").attr('selected','selected');
        $("#organ").attr('disabled',false);
        layer.open({
            type : 1,
            title : '添加用户',
            area : [ '576px', '370px' ],
            content : $('#Add_user_style'),
            btn : [ '保存', '取消' ],
            yes : function(index, layero) {
                var password=$('input[name="user_password"]').val();
                if ($('input[name="user_account"]').val() == "") {
                    layer.msg("登录用户名不能为空",{time:2000});
                    return;
                }
                if (password == "") {
                    layer.msg("密码不能为空",{time:2000});
                    return;
                }
                if(password.length<6 ){
                    layer.msg("密码长度不小于6位",{time:2000});
                    return;
                }
                if ($('input[name="user_mobile"]').val() == "") {
                    layer.msg("手机号码不能为空",{time:2000});
                    return;
                }
                if ($('input[name="user_trueName"]').val() == "") {
                    layer.msg("真实姓名不能为空",{time:2000});
                    return;
                }
                var account=$('input[name="user_account"]').val();
                var email=$('input[name="user_email"]').val();
                var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                var patrn=/^(\w){6,20}$/;
                if(!patrn.exec(password)){
                    layer.msg("密码只能有数字字母组成",{time:2000});
                    return;
                }
                if(email){
                    if(!emailReg.test(email)){
                        layer.msg("邮箱格式不正确",{time:2000});
                        return;
                    }
                }
                var tel=$('input[name="user_mobile"]').val();
                //var mobileReg=/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
                var mobileReg=/^1(3|4|5|7|8)\d{9}$/;//(1[34578])\\d{9}$
                if(!mobileReg.test(tel)){
                    layer.msg("手机号码格式不正确~",{time:2000});
                    return;
                }
                var deptpname2 = $("#deptPname").val();
                if(deptpname2 == ""){
                    layer.msg("请选择所属机构",{time:2000});
                    return;
                }
                var trueName=$('input[name="user_trueName"]').val();
                var remark=$("#remark").val();
                var isLock=$("#isLock").val();
                var organId=$('#deptPid').val();
                var user={
                    account:account,
                    password:password,
                    email:email,
                    tel:tel,
                    trueName:trueName,
                    remark:remark,
                    isLock:parseInt(isLock),
                    status:parseInt(isLock),
                    orgId:organId
                };
                Comm.ajaxPost(
                    'user/add',JSON.stringify(user),
                    function(data){
                        layer.closeAll();
                        layer.msg(data.msg,{time:2000},function () {
                            g_extendContentMg.tableUser.ajax.reload(function(){
                            });
                        });
                    },"application/json"
                );
            }
        });
    }

}


//重置用户密码
function resetPwd(userId) {
    var userIds = new Array();
    userIds.push(userId);

    // var selectArray = $("#User_list tbody input:checked");
    // if(!selectArray || selectArray.length==0){
    //     layer.msg("请选择用户",{time:2000});
    //     return;
    // }
    // var userIds = new Array();
    // $.each(selectArray,function(i,e){
    //     var val = $(this).val();
    //     userIds.push(val);
    // });
    // if(userIds.lenght==0){
    //     return;
    // }
    layer.confirm('是否重置密码，重置后原密码将失效？', {
        btn : [ '重置', '取消' ]
    }, function() {
        Comm.ajaxPost(
            'user/resetPwd', JSON.stringify(userIds),
            function(data){
                layer.closeAll();
                layer.msg(data.msg,{time:2000},function () {
                    g_extendContentMg.tableUser.ajax.reload(function(){
                        $("#userCheckBox_All").attr("checked",false);
                    });
                });
            },"application/json"
        );
    });
}

