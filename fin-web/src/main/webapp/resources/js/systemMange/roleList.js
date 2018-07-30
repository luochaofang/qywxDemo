$(function (){
    Comm.ajaxPost(
        'user/getPermission',"{}",
        function(data){
            var data=data.data;
            var html='';
            for(var i=0;i<data.length;i++){
                if(data[i] =="/role/add"){
                    $("#addBtn").show();
                }
                if(data[i] =="/role/update"){
                    $("#updateBtn").show();
                }
                if(data[i] =="/role/delete"){
                    $("#deleteBtn").show();
                }
                if(data[i] =="/roleMenu/getMenuByRole"){
                    $("#assignBtn").show();
                }
            }

        },"application/json"
    );
    g_userManage.tableUser = $('#Role_list').dataTable($.extend({
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
            Comm.ajaxPost('role/list',JSON.stringify(queryFilter),function(result){
                var returnData = {};
                var resData = result.data;
                var resPage = result.page;
                returnData.draw = data.draw;
                $('#pagesize').val(resPage.pageSize);
                returnData.recordsTotal = resPage.resultCount;
                returnData.recordsFiltered = resPage.resultCount;
                returnData.data = resData;
                callback(returnData);
            },"application/json")
        },
        "order": [],//取消默认排序查询,否则复选框一列会出现小箭头
        "columns": [
            {
                'data':null,
                "searchable":false,"orderable" : false
            },
            {"data": "roleCode","orderable" : false},
            {"data": "roleName","orderable" : false},
            {
                "data" : null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    if(data.status==1){
                        return '启用'
                    }else{
                        return '停用'
                    }
                }
            },
            {
                "data":null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    return json2TimeStamp(data.birth);
                }
            },
            {
                "data":null,
                "searchable":false,
                "orderable" : false,
                "render" : function(data, type, row, meta) {
                    return json2TimeStamp(data.updateTime);
                }
            },
            {"data": "roleDesc","orderable" : false},
            {
                "data": "null", "orderable": false,
                "defaultContent":""
            }
        ],
        "createdRow": function ( row, data, index,settings,json ) {
            var btnDel = $('<a class="tabel_btn_style" onclick="updateRole(0,\''+data.roleId+'\')">修改</a>&nbsp;<a class="tabel_btn_style" onclick="assignPerission(\''+data.roleId+'\')">权限分配</a>&nbsp;<a class="tabel_btn_style_dele" onclick="deleteRole(\''+data.roleId+'\')">删除</a>');
            $('td', row).eq(7).append(btnDel);
        },
        "initComplete" : function(settings,json) {
            //操作
            $("#Role_list").on("click",".operate",function(e){
                var target = e.target||window.event.target;
                var roleId = $(target).parents("tr").children().eq(1).children("input").val();
                updateRole(0,roleId);
            });
            //全选
            $("#userCheckBox_All").click(function(J) {
                if (!$(this).prop("checked")) {
                    $("#Role_list tbody tr").find("input[type='checkbox']").prop("checked", false)
                } else {
                    $("#Role_list tbody tr").find("input[type='checkbox']").prop("checked", true)
                }
            });
            //搜索
            $("#btn_search").click(function() {
                g_userManage.fuzzySearch = true;
                g_userManage.tableUser.ajax.reload();
            });
            //重置
            $("#btn_search_reset").click(function() {
                $("#sign").val("");
                $("#name").val("");
                g_userManage.fuzzySearch = true;
                g_userManage.tableUser.ajax.reload();
            });
            //单选行
            $("#Role_list tbody").delegate( 'tr','click',function(e){
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
    g_userManage.tableUser.on("order.dt search.dt", function() {
        g_userManage.tableUser.column(0, {
            search : "applied",
            order : "applied"
        }).nodes().each(function(cell, i) {
            cell.innerHTML = i + 1
        })
    }).draw()
});

var g_userManage = {
    tableUser : null,
    currentItem : null,
    fuzzySearch : false,
    getQueryCondition : function(data) {
        var paramFilter = {};
        var page = {};
        var param = {};

        //自行处理查询参数
        param.fuzzySearch = g_userManage.fuzzySearch;
        if (g_userManage.fuzzySearch) {
            param.roleCode = $("#sign").val();
            param.roleName = $("#name").val();
        }
        param.status="1";
        paramFilter.param = param;

        page.firstIndex = data.start == null ? 0 : data.start;
        page.pageSize = data.length  == null ? 10 : data.length;
        paramFilter.page = page;

        return paramFilter;
    }
};

//修改和添加
function updateRole(sign,roleId) {
    if(sign==0){
        Comm.ajaxPost('role/detail', roleId, function(data){
                layer.closeAll();
                var role=data.data;
                var organStatus;
                /*Comm.ajaxPost('sysDepartment/findOne',"orgId="+role.orgId,function(data){
                    var organ=data.data;
                    if(organ){
                        organStatus = organ.status;//所属组织的状态
                        $("#deptPname").val(organ.name);
                    }else{
                        $("#deptPname").val("");
                    }
                });*/
                $('input[name="role_key"]').val(role.roleCode);
                $('input[name="role_name"]').val(role.roleName);
                $("#role_remark").val(role.roleDesc);
                //$("#organ").attr('disabled',true);
                if(role.status==1){
                    $("#qiyong").attr('selected','selected');
                }else{
                    $("#jinyong").attr('selected','selected');
                }
                layer.open({
                    type : 1,
                    title : '修改角色',
                    maxmin : true,
                    shadeClose : false,
                    area : [ '576px', '300px' ],
                    content : $('#Add_Roles_style'),
                    btn : [ '保存', '取消' ],
                    yes : function(index, layero) {
                        if ($("#role_key").val() == "") {
                            layer.msg("角色标识不能为空",{time:2000});
                            return;
                        }
                        if ($("#role_name").val() == "") {
                            layer.msg("角色名称不能为空",{time:2000});
                            return;
                        }
                        role.roleCode=$('input[name="role_key"]').val();
                        role.roleName=$('input[name="role_name"]').val();
                        role.roleDesc=$("#role_remark").val();
                        role.status=parseInt($("#status").val());
                        //role.orgId =$('#deptPid').val();
                        if(organStatus==0 && role.status==1){
                            layer.msg("所属组织停用，状态不可更改！",{time:1000},function () {
                                $("#jinyong").attr('selected','selected');
                            });
                            return
                        }
                        Comm.ajaxPost(
                            'role/getdetail',JSON.stringify(role),
                            function(data){
                                debugger
                                if(data.data.length>1){
                                    layer.msg("角色名称已经存在！",{time:2000});
                                    return
                                }
                                if(data.data.length==1){
                                    if (data.data[0].roleId!=roleId){
                                    layer.msg("角色名称已经存在！",{time:2000});
                                        return;
                                    }
                                }
                                Comm.ajaxPost('role/update',JSON.stringify(role), function(data){
                                    layer.closeAll();
                                    layer.msg("修改成功",{time:2000});
                                    $('#Role_list').dataTable().fnDraw(false);
                                }, "application/json");
                            }, "application/json");
                    }
                });
            }, "application/json");
    }else{
        //$("#organ").attr('disabled',false);
        $('input[name="role_key"]').val("");
        $('input[name="role_name"]').val("");
        $("#role_remark").val("");
        layer.open({
            type : 1,
            title : '添加角色',
            maxmin : true,
            shadeClose : false,
            area : [ '576px', '300px' ],
            content : $('#Add_Roles_style'),
            btn : [ '保存', '取消' ],
            yes : function(index, layero) {
                if ($("#role_key").val() == "") {
                    layer.msg("角色标识不能为空",{time:2000});
                    return;
                }
                if ($("#role_name").val() == "") {
                    layer.msg("角色名称不能为空",{time:2000});
                    return;
                }
                var role={
                    roleCode:$('input[name="role_key"]').val(),
                    roleName:$('input[name="role_name"]').val(),
                    roleDesc:$("#role_remark").val(),
                    status:parseInt($("#status").val()),
                    //orgId:$('#deptPid').val()
                };
                Comm.ajaxPost(
                    'role/getdetail',JSON.stringify(role),
                    function(data){
                        debugger
                        if(data.data.length>0){
                            layer.msg("角色名称已经存在！",{time:2000});
                            return
                        }
                        Comm.ajaxPost(
                            'role/add',JSON.stringify(role),
                            function(data){
                                layer.closeAll();
                                layer.msg("添加成功",{time:2000});
                                g_userManage.tableUser.ajax.reload();
                            }, "application/json");
                    }, "application/json");

            }
        });
    }
}

//删除
function deleteRole(roleId){
    // var selectArray = $("#Role_list tbody input:checked");
    // if (!selectArray || (selectArray.length <= 0)) {
    //     layer.msg("请选择一个用户", {time: 2000});
    //     return;
    // }
    var roleIds = new Array();
    roleIds.push(roleId);
    // $.each(selectArray,function(i,e){
    //     var val = $(this).val();
    //     roleIds.push(val);
    // });
    // if(roleIds.length==0){
    //     return;
    // }
    layer.confirm('是否删除用户？', {
        btn : [ '确定', '取消' ]
    }, function() {
        Comm.ajaxPost('role/delete', JSON.stringify(roleIds),function (data) {
                layer.msg("删除成功", {time: 1000}, function () {
                    g_userManage.tableUser.ajax.reload();
                });
            }, "application/json");
    });
}
//分配权限
function assignPerission(roleId) {
    var roleMenuIds = [];
    Comm.ajaxPost('roleMenu/getMenuByRole', roleId, function(data){
            roleMenuIds = data.data;
            // 显示树
            showCheckboxTree("/menu/getTree","tree",roleMenuIds);
            openMenuTree(roleId);
        },"application/json"
    );
}

//树形结构
function openMenuTree(roleId){
    layer.open({
        type : 1,
        title : '资源权限',
        shadeClose : true, //点击遮罩关闭层
        offset:["20px"],
        area : ['250px','450px'],
        content : $('#Assigned_Roles_style'),
        btn : [ '保存', '取消' ],
        yes : function(index, layero) {
            var menuIds = getCheckboxTreeSelNode("tree");
            //var param = {"roleId":roleId,"menuIds":menuIds};
            var param = {"roleId":roleId,"menuIds":menuIds};
            //var param = {"roleId":roleId};
            Comm.ajaxPost(
                'roleMenu/add',param,
                function(data){
                    layer.msg('保存成功！',{time:1000},function(){
                        layer.close(index);
                    });
                })
        }
    });
}
//点击所属部门，加载树
var showDeptZtree = function(){
    //打开部门ztree弹框
    var deptTree = layer.open({
        title:"部门",
        type: 1,
        maxWidth:'auto',
        area:['300px','300px'],
        skin: 'layer_normal',
        shift: 5,
        offset:'150px',
        btn : [ '保存', '取消' ],
        shadeClose:false,
        content: $("#jstree").show(),
        success: function(layero, index){
            getDepartmentZtree();

            $('#jstree').delegate('span.text', 'click', function () {
                var id = $(this).attr('title');
                var deptName = $(this).text();
                $('#deptPname').val(deptName);
                $('#deptPid').val(id);
            })
        },
        yes: function () {
            layer.close(deptTree);
        }
    });
};







