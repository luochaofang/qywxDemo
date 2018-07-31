package com.zw.rule.qywechat.service;

import com.zw.rule.qywxmanage.ExtensionType;

import java.util.List;
import java.util.Map;

/**
 * 推广类型
 * @author 陈淸玉 create on 2018-07-30
 */
public interface IExtensionTypeService {

    String BEAN_KEY = "extensionTypeService";

    List<ExtensionType> findTypes();

    /**
     * 获取类型列表（模糊查询）
     * @author 仙海峰
     * @param param
     * @return
     */
    List<ExtensionType> getExtensionTypeList(Map param);
}
