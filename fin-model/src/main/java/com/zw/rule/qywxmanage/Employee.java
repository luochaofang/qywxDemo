package com.zw.rule.qywxmanage;

public class Employee {
    private Long id;

    private String headImage;

    private String name;

    private String userid;

    private Integer conutShare;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeadImage() {
        return headImage;
    }

    public void setHeadImage(String headImage) {
        this.headImage = headImage == null ? null : headImage.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid == null ? null : userid.trim();
    }

    public Integer getConutShare() {
        return conutShare;
    }

    public void setConutShare(Integer conutShare) {
        this.conutShare = conutShare;
    }
}