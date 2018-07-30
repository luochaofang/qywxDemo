package com.zw.rule.qywxmanage;

import java.util.Date;

public class ContentShare {
    private Long id;

    private Long contentId;

    private Long employeeId;

    private Long channelType;

    private Long extensionType;

    private Date addtime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getChannelType() {
        return channelType;
    }

    public void setChannelType(Long channelType) {
        this.channelType = channelType;
    }

    public Long getExtensionType() {
        return extensionType;
    }

    public void setExtensionType(Long extensionType) {
        this.extensionType = extensionType;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}