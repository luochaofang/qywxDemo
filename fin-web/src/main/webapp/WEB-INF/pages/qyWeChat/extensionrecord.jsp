<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="${pageContext.request.contextPath}/resources/js/base.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/base.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/marketingRecord.css">
</head>

<body>
<header class="title">
    <a href="./marketing.html" class="back"></a>
    <div class="title-name center font36">营销记录</div>
</header>
<div class="marketingRecord">
    <table class="recordTable center font32">
        <tbody>
        <tr>
            <td class="marketingType">种类</td>
            <td class="expandNumber">推广次数</td>
            <td class="clickNumber">点击次数</td>
            <td class="operate">操作</td>
        </tr>
        <c:forEach items="${list}" var="bean">
        <tr>


                <td class="marketingType">  ${bean.extensionType}</td>
                <td> ${bean.extendNum}</td>
                <td> ${bean.clickNum}</td>
                <td class="view">
                    <a href="./#">查看</a>
                </td>

        </tr>
        </c:forEach>
        </tbody>
    </table>
</div>
</body>
</html>