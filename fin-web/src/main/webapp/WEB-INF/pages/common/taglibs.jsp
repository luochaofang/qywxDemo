<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="time" value="<%=new Date().getTime()%>"/>
<c:set var="version" value="?v=${time}"/>
<c:set var="userId" value='<%=String.valueOf(request.getSession().getAttribute("userId"))%>'/>
<%
    String type = request.getParameter("type");

%>
<link rel="stylesheet" href="${ctx}/resources/assets/css/bootstrap.min.css${version}"/>
<link rel="stylesheet" href="${ctx}/resources/assets/css/font-awesome.min.css${version}"/>
<link rel="stylesheet" href="${ctx}/resources/assets/css/ace.min.css${version}"/>
<link rel="stylesheet" href="${ctx}/resources/assets/css/ace-rtl.min.css${version}"/>
<link rel="stylesheet" href="${ctx}/resources/assets/css/ace-skins.min.css${version}"/>
<%if(!"magTemplate".equals(type)){%>
    <link rel="stylesheet" href="${ctx}/resources/css/common.css${version}"/>
<%}%>
<link rel="stylesheet" href="${ctx}/resources/css/dataTables.bootstrap.css${version}">
<link rel="stylesheet" href="${ctx}/resources/css/dataTables.fontAwesome.css${version}">
<link rel="stylesheet" href="${ctx}/resources/css/jquery.dataTables.min.css${version}">
<script src="${ctx}/resources/js/lib/jquery/jquery-1.8.3.min.js${version}"></script>
<script src="${ctx}/resources/js/lib/dataTable/jquery.dataTables.js${version}"></script>
<script src="${ctx}/resources/js/lib/dataTable/dataTables.bootstrap.js${version}"></script>
<script src="${ctx}/resources/js/common/common.js${version}"></script>
<script src="${ctx}/resources/js/common/constant.js${version}"></script>
<script src="${ctx}/resources/assets/js/bootstrap.min.js${version}"></script>
<script src="${ctx}/resources/assets/layer/layer.js${version}"></script>
<script src="${ctx}/resources/js/system/index.js${version}"></script>

<script type="text/javascript">
    var _ctx = "${ctx}";
    var userId = "${userId}";
    _ctx = _ctx == null || _ctx == "/" ? "" : _ctx;
    var _version = "${time}";
</script>

