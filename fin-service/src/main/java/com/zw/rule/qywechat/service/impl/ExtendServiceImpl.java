package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentShareManageMapper;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywxmanage.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 推广服务
 * @author 陈淸玉 create on 2018-07-30
 */
@Service(IExtendService.BEAN_KEY)
public class ExtendServiceImpl implements IExtendService {

    @Autowired
    private ContentShareManageMapper contentShareManageMapper;

    @Override
    public List<Map<String, String>> countExtendByExtensionType(Integer extensionType) {
        return contentShareManageMapper.countExtendByExtensionType(extensionType);
    }

}
