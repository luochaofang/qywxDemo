package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ExtensionTypeMapper;
import com.zw.rule.qywechat.service.IExtensionTypeService;
import com.zw.rule.qywxmanage.ExtensionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
