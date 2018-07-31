<%@ page contentType="text/html; charset=UTF-8" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<%
    // appId
    String appId = (String) request.getAttribute("appId");
%>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script language="javascript">
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }

    var corpId = "wwdcbdde0b6a193a9e";
    var p_timestamp = (new Date()).getTime();
    var p_noncestr = generateMixed(20);
    // 当前地址，需要保留参数
    var p_url = location.href;
    p_url = p_url.replace(/\?/ig, '%3F');
    p_url = p_url.replace(/&/ig, '%26');
    var nIndex = p_url.indexOf('#');
    if (nIndex > 0) {
        p_url = p_url.substr(0, nIndex);
    }

    // 获得sha1签名
    var url = '${ctx}/enterpriseWeChat/jsSignature?appId=<%= appId%>&noncestr=' + p_noncestr + '&timestamp=' + p_timestamp + '&url=' + p_url;
    $.get(url, function (result) {
        if (result == null) {
            return;
        }
        result = $.trim(result);
        if (result == '') {
            return;
        }
        wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: corpId, // 必填，企业微信的corpID
            timestamp: p_timestamp, // 必填，生成签名的时间戳
            nonceStr: p_noncestr, // 必填，生成签名的随机串
            signature: result,// 必填，签名，见附录1
            jsApiList: ["onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "uploadImage",
                "downloadImage",
                "previewFile",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "onHistoryBack",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode",
                "selectEnterpriseContact",
                "openEnterpriseChat",
                "chooseInvoice"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    });
    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert("初始化微信脚本失败，可能是网络原因，请稍候尝试！");
    });
</script>