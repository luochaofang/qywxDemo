package com.zw.rule.qywechat.service;

import com.zw.rule.qywxmanage.Customer;

import java.util.List;
import java.util.Map;

/**
 * 推广服务
 * @author 陈淸玉 create on 2018-07-30
 */
public interface IExtendService {

    String BEAN_KEY = "extendServiceImpl";

    /**
     * 根据推广类型 统计每人推广总数
     * @param extensionType 推广类型
     * @return 每人推广总数
     */
    List<Map<String,String>> countExtendByExtensionType(Integer extensionType);
}
