<%@ page import="com.zw.rule.util.HttpUtil" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="navbar" id="navbar">

</div>
<!-- update password -->
<%
    String copId = "wwdcbdde0b6a193a9e";
    String redrectURI = "http://weixin.fintecher.cn/1.0.0/qywechatLogin/login";
    String agentid = "1000002";

    HttpUtil.doGet("https://open.weixin.qq.com/connect/oauth2/authorize?appid="+copId+"&redirect_uri="+redrectURI+"&response_type=code&scope=snsapi_userinfo&agentid="+agentid+"&state=#wechat_redirect");


%>




    <%--<script type="application/javascript">--%>
        <%--window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +--%>
            <%--"appid=<%=copId%>&redirect_uri=<%=redrectURI%>&response_type=code&scope=snsapi_userinfo&agentid=<%=agentid%>&state=#wechat_redirect";--%>
    <%--</script>--%>