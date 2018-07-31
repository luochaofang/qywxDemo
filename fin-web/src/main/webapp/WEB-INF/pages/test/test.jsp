<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <c:import url="../common/wx_js_sdk.jsp">
        <c:param name="appId" value="${appId}" />
    </c:import>
    <title>企业微信测试</title>
    <script>
        wx.ready(function () {
            getLocation();
        });

        function getLocation(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    alert(res.latitude)
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                }
            });
        }
    </script>
</head>
<body onload="loading();">

</body>
<script>
</script>
</html>

