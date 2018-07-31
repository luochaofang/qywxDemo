<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>首页</title>
    <%@include file="../common/qywxtaglibs.jsp"%>
</head>
<body>
<header class="title">
    <div class="title-name center font36">首页</div>
</header>
<div class="rankList">
    <div class="rankListTitle center font36">推广排行榜</div>
    <ul class="listContent center font32">
        <c:choose>
            <c:when test="${listMap.size() > 0}">
                <c:forEach items="${listMap}" varStatus="i" var="map">
                    <li class="listDetails clearfix">
                        <c:if test="${i.index eq 0}">
                            <div class="ranking fl">第一名</div>
                        </c:if>
                        <c:if test="${i.index eq 1}">
                            <div class="ranking fl">第二名</div>
                        </c:if>
                        <c:if test="${i.index eq 2}">
                            <div class="ranking fl">第三名</div>
                        </c:if>
                        <div class="photo fl">
                            <img src="${map.get("headImage")}" alt="">
                        </div>
                        <div class="name fl">${map.get("name")}</div>
                        <div class="expandNumber fl">${map.get("conutShare")}</div>
                    </li>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <div> 暂无数据</div>
            </c:otherwise>

        </c:choose>
    </ul>
</div>
<div class="viewAll font30">
    <a href="${ctx}${api_version}/extend/extendDetail">查看全部员工推广明细</a>
    <a href="./activityExpand.html">查看全部活动推广明细</a>
</div>

</body>
</html>