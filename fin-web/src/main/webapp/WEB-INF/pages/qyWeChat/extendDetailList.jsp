<%--
  员工推广明细
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
    <link rel="stylesheet" href="${ctx}/resources/css/qywxcss/staffExpand.css${version}">
</head>

<body>
<header class="title">
    <a href="./index.html" class="back font32"></a>
    <div class="title-name center font36">员工推广明细</div>
</header>
<div class="expandDetails">
    <table class="expandTable center font28">
        <tbody>
        <tr class="expandTitle">
            <td>员工姓名</td>
            <c:forEach items="${typeList}" var="type">
                <td>${type.name}</td>
            </c:forEach>
        </tr>
        <c:forEach items="${extendDetailList}" var="list">
        <tr>
            <td> ${employeeMap.get(list.employeeId.toString())} (${list.extensionTypeNum})</td>
            <c:forEach items="${typeList}" var="type">
            <td><a href="./extendDetail/${type.id}/${list.employeeId}">${list.get(type.id.toString()) eq null ? 0 : list.get(type.id.toString())}</a></td>
            </c:forEach>
        </tr>
        </c:forEach>
        </tbody>
    </table>
</div>
</body>
</html>