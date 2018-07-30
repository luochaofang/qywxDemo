<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="navbar" id="navbar">

</div>
<!-- update password -->
<%
    String copId = "wwdcbdde0b6a193a9e";
    String redrectURI = "http://xxx.xxx.com/qywechat/home";
    String agentid = "1000002";

%>

<script type="application/javascript">
    window.loacation.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
        "appid=<%=copId%>&redirect_uri=<%=redrectURI%>&response_type=code&scope=snsapi_userinfo&agentid=<%=agentid%>&state=#wechat_redirect";
</script>