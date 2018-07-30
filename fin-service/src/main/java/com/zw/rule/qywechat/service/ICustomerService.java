package com.zw.rule.qywechat.service;

import com.zw.rule.qywxmanage.Customer;

import java.util.List;

/**
 * 客户服务
 * @author 陈淸玉 create on 2018-07-30
 */
public interface ICustomerService {
    String BEAN_KEY = "customerServiceImpl";

    /**
     * 按推广类型查询查看人信息列表
     * @return 查看人信息列表
     */
    List<Customer> findCustomerDetail(Integer extensionType);
}
