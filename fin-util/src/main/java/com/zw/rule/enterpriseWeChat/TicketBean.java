package com.zw.rule.enterpriseWeChat;

/**
 * 身份票据
 * Created by zh on 2018/7/30.
 */
public class TicketBean {
    /* 票据获取时间 */
    private long startSecond = 0L;
    /* 票据失效时间 */
    private long expireSecond = 0L;
    /* 票据 */
    private String ticket = null;

    public long getStartSecond() {
        return startSecond;
    }

    public void setStartSecond(long startSecond) {
        this.startSecond = startSecond;
    }

    public long getExpireSecond() {
        return expireSecond;
    }

    public void setExpireSecond(long expireSecond) {
        this.expireSecond = expireSecond;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    /**
     * @return 是否已经过期
     */
    public boolean isExpired() {
        // 当前时间(以秒为单位)
        long now = System.currentTimeMillis() / 1000;
        return (now >= expireSecond);
    }
}