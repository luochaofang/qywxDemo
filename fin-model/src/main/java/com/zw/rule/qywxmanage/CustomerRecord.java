package com.zw.rule.qywxmanage;

public class CustomerRecord {
    /**
     * 头像
     */
    private String headImage;
    /**
     * 客户名称
     */
    private String name;
    /**
     * 推广信息id
     */
    private String contentId;
    /**
     * 推广标题
     */
    private String title;
    /**
     * 点击次数
     */
    private String numberOfClicks;

    public String getHeadImage() {
        return headImage;
    }

    public void setHeadImage(String headImage) {
        this.headImage = headImage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNumberOfClicks() {
        return numberOfClicks;
    }

    public void setNumberOfClicks(String numberOfClicks) {
        this.numberOfClicks = numberOfClicks;
    }
}
