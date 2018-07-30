package com.zw.rule.qywxmanage;

public class User {
    private Long id;

    private String name;

    private String mobile;

    private String email;

    private Integer shen;

    private String shenName;

    private Integer shi;

    private String shiName;

    private Integer qu;

    private String quName;

    private String address;

    private Long employeeId;

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

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile == null ? null : mobile.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public Integer getShen() {
        return shen;
    }

    public void setShen(Integer shen) {
        this.shen = shen;
    }

    public String getShenName() {
        return shenName;
    }

    public void setShenName(String shenName) {
        this.shenName = shenName == null ? null : shenName.trim();
    }

    public Integer getShi() {
        return shi;
    }

    public void setShi(Integer shi) {
        this.shi = shi;
    }

    public String getShiName() {
        return shiName;
    }

    public void setShiName(String shiName) {
        this.shiName = shiName == null ? null : shiName.trim();
    }

    public Integer getQu() {
        return qu;
    }

    public void setQu(Integer qu) {
        this.qu = qu;
    }

    public String getQuName() {
        return quName;
    }

    public void setQuName(String quName) {
        this.quName = quName == null ? null : quName.trim();
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
}