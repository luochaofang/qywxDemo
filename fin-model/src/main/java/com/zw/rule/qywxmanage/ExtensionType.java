package com.zw.rule.qywxmanage;

import java.util.Date;

public class ExtensionType {
    private Long id;

    private String name;

    private Integer sorting;

    private Integer status;

    private Date addtime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getSorting() {
        return sorting;
    }
    public void setSorting(Integer sorting) {
        this.sorting = sorting;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}