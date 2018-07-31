<%@ page import="java.util.Date" %>
<%@ page import="com.zw.settings.RouterSettings" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="api_version" value="<%=RouterSettings.VERSION%>"/>
<c:set var="module" value="<%=RouterSettings.MODULE%>"/>
<c:set var="time" value="<%=new Date().getTime()%>"/>
<c:set var="version" value="?v=${time}"/>
<c:set var="userId" value='<%=String.valueOf(request.getSession().getAttribute("userId"))%>'/>

<script src="${ctx}/resources/js/qywxjs/base.js${version}"></script>
<link rel="stylesheet" href="${ctx}/resources/css/qywxcss/base.css${version}">
<link rel="stylesheet" href="${ctx}/resources/css/qywxcss/index.css${version}">


<script type="text/javascript">
    var _ctx = "${ctx}";
    var userId = "${userId}";
    _ctx = _ctx == null || _ctx == "/" ? "" : _ctx;
    var _version = "${time}";
    var _module = "${module}";
    var _api_version = "${api_version}";
</script>

