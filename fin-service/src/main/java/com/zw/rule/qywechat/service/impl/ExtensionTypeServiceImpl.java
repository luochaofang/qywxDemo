package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ExtensionTypeMapper;
import com.zw.rule.qywechat.service.IExtensionTypeService;
import com.zw.rule.qywxmanage.ExtensionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 推广类型
 * @author 陈淸玉 create on 2018-07-30
 */
@Service(IExtensionTypeService.BEAN_KEY)
public class ExtensionTypeServiceImpl implements IExtensionTypeService {

    @Autowired
    private ExtensionTypeMapper extensionTypeMapper;

    @Override
    public List<ExtensionType> findTypes() {
        return extensionTypeMapper.findTypes();
    }


    /**
     * 获取类型列表（模糊查询）
     * @author 仙海峰
     * @param param
     * @return
     */
    @Override
    public List<ExtensionType> getExtensionTypeList(Map param) {
        return extensionTypeMapper.getExtensionTypeList(param);
    }
}
