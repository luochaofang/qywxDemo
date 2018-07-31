package com.zw.rule.enterpriseWeChat;

/**
 * 应用枚举类
 * Created by zh on 2018/7/30.
 */
public enum AppEnum {
    APPONE("1000002", "oV6cXT0NT_c2xcgD5uuU6tYs0akju7YmklXl992EVCk"),
    APPTWO("1000003", "TBPIxYr4jOF_TTJFpD1XFIu3DlRgeFxr4qReSjJ4XhA");

    private String appId;
    private String corpsecret;

    AppEnum(String appId, String corpsecret) {
        this.appId = appId;
        this.corpsecret = corpsecret;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getCorpsecret() {
        return corpsecret;
    }

    public void setCorpsecret(String corpsecret) {
        this.corpsecret = corpsecret;
    }

    /**
     * 根据应用id 获取应用
     *
     * @param appId 应用id
     * @return
     */
    public static AppEnum getApp(String appId) {
        for (AppEnum app : AppEnum.values()) {
            if (appId.equals(app.getAppId()))
                return app;
        }
        return null;
    }

    /**
     * 根据应用id获取secret
     *
     * @param appId 应用id
     * @return
     */
    public static String getCorpsecret(String appId) {
        for (AppEnum app : AppEnum.values()) {
            if (appId.equals(app.getAppId()))
                return app.getCorpsecret();
        }
        return null;
    }

}
