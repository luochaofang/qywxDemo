<%--
 推广查看人员明细
  User: 陈清玉
  Date: 2018/7/31
  Time: 14:08
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <%@include file="../common/qywxtaglibs.jsp"%>
    <link rel="stylesheet" href="${ctx}/resources/css/qywxcss/expandDetails.css${version}">
</head
<body>
<header class="title">
    <a href="${ctx}${module}/extend/extendDetail" class="back font32"></a>
    <div class="title-name center font36">推广明细</div>
</header>
<div class="expandDetails">
    <div class="detailsInfo font24">
        <span>${employee.name}</span>，
        <span>${extensionType.name}</span>推广查看人员明细：
    </div>
    <ul class="personList font32 center">
        <li class="itemInfo clearfix">
            <div class="photo fl">头像</div>
            <div class="name fr">姓名</div>
        </li>
        <c:forEach items="${customerIdList}" var="customerId">
        <li class="itemInfo clearfix">
            <c:set var="customerObj" value="${customerMap.get(customerId.toString())}"/>
            <div class="photo fl">
                <img src="${ctx}/resources/images/${customerObj.headImage}" alt="">
            </div>
            <div class="name fr">${customerObj.name}</div>
        </li>
        </c:forEach>
    </ul>
</div>
</body>
</html>