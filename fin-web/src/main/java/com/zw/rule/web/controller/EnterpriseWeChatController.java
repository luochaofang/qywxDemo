package com.zw.rule.web.controller;

import com.zw.base.util.DigestUtil;
import com.zw.base.util.TraceLoggerUtil;
import com.zw.rule.enterpriseWeChat.TicketUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

/**
 * 企业微信controller
 * Created by zh on 2018/7/30.
 */
@Controller
@RequestMapping("/enterpriseWeChat")
public class EnterpriseWeChatController {

    /**
     * @param appId     应用id
     * @param noncestr  生成签名的随机串
     * @param timestamp 时间戳
     * @param url       当前页面路径
     * @return 签名
     * @throws Exception
     */
    @RequestMapping("/jsSignature")
    @ResponseBody
    public String jsSignature(
            @RequestParam(value = "appId", defaultValue = "") String appId,
            @RequestParam(value = "noncestr", defaultValue = "") String noncestr,
            @RequestParam(value = "timestamp", defaultValue = "") String timestamp,
            @RequestParam(value = "url", defaultValue = "") String url)
            throws Exception {
        String signature = "";
        try {
            // 注意这里参数名必须全部小写，且必须有序
            String string1 = "jsapi_ticket="
                    + TicketUtil.getJsapiToken(appId) + "&noncestr="
                    + noncestr + "&timestamp=" + timestamp + "&url=" + url;

            signature = DigestUtil.sha1().digest(string1);
        } catch (IOException e) {
            TraceLoggerUtil.error("生成签名异常", e);
        }
        return signature;
    }


    @RequestMapping("/test")
    public String jsSignature(String appId)
            throws Exception {

        return "test/test";
    }
}
