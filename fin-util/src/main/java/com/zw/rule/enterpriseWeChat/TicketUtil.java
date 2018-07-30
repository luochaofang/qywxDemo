package com.zw.rule.enterpriseWeChat;

import com.alibaba.fastjson.JSONObject;
import com.zw.rule.util.HttpUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 获取身份票据Token
 * Created by zh on 2018/7/30.
 */
public class TicketUtil {
    /* 企业id */
    private static final String corpid = "wwdcbdde0b6a193a9e";
    /* 当前的身份票据<KEY：appid+应用id VALUE：应用对应的身份票据> */
    private static Map<String, TicketBean> atMap = new HashMap<String, TicketBean>();
    /* 当前的JSAPI票据<KEY：appid+应用id VALUE：应用对应的JSAPI票据> */
    private static Map<String, TicketBean> jtMap = new HashMap<String, TicketBean>();

    /**
     * @param appId 应用appId
     * @return 身份票据
     * @throws Exception
     */
    public synchronized static TicketBean getAccessTokenBean(
            String appId) throws Exception {
        TicketBean accessToken = atMap.get("appid" + appId);
        // 缓存中存在，直接使用缓存
        if (accessToken != null && !accessToken.isExpired()
                && accessToken.getTicket() != null) {
            return accessToken;
        }
        String corpsecret = "";
        if (appId != null && appId.trim().length() > 0) {
            corpsecret = AppEnum.getCorpsecret(appId);
        }

        long now = System.currentTimeMillis();
        if (corpsecret != null && corpsecret.trim().length() > 0) {
            // 重新获取Tiket
            String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid="
                    + corpid + "&corpsecret=" + corpsecret;
            String s = HttpUtil.doGet(url);
            // 转变为JSON
            JSONObject json = JSONObject.parseObject(s);
            if (!json.containsKey("access_token")) {
                return null;
            }

            accessToken = new TicketBean();
            accessToken.setStartSecond(now / 1000);
            // 减少100秒，提前强制过期，保证及时获取新的AccessToken
            accessToken.setExpireSecond(accessToken.getStartSecond()
                    + json.getInteger("expires_in") - 100);
            accessToken.setTicket(json.getString("access_token"));

            // 保存身份票据
            atMap.put("appid" + appId, accessToken);

            return accessToken;
        }

        return null;
    }

    /**
     * @param appId 应用id
     * @return 身份票据字符串
     * @throws IOException
     */
    public synchronized static String getAccessToken(String appId)
            throws Exception {
        TicketBean te = getAccessTokenBean(appId);

        return (te != null ? te.getTicket() : null);
    }

    /**
     * @param appId 应用id
     * @return 当前的JSAPI票据
     * @throws IOException
     */
    public synchronized static String getJsapiToken(String appId)
            throws Exception {
        // 身份票据字符串
        String at = getAccessToken("appid" + appId);
        if (at == null || at.trim().length() == 0) {
            return null;
        }

        TicketBean jsapiTicket = jtMap.get(appId);
        if (jsapiTicket == null || jsapiTicket.isExpired()
                || jsapiTicket.getTicket() == null) {
            // 重新获取Tiket
            String url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=" + at;

            long now = System.currentTimeMillis();
            String s = HttpUtil.doGet(url);
            // 转变为JSON
            JSONObject json = JSONObject.parseObject(s);
            if (!json.containsKey("ticket")) {
                return null;
            }

            jsapiTicket = new TicketBean();
            jsapiTicket.setStartSecond(now / 1000);
            // 减少100秒，提前强制过期，保证及时获取新的jsapiTicket
            jsapiTicket.setExpireSecond(jsapiTicket.getStartSecond()
                    + json.getInteger("expires_in") - 100);
            jsapiTicket.setTicket(json.getString("ticket"));

            // 保存JSAPI票据
            jtMap.put("appid" + appId, jsapiTicket);
        }

        return jsapiTicket.getTicket();
    }

    public static void main(String[] args) {
        try {
            System.out.println(getAccessToken("TBPIxYr4jOF_TTJFpD1XFIu3DlRgeFxr4qReSjJ4XhA"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
