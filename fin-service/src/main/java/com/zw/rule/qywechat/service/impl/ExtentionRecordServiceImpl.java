package com.zw.rule.qywechat.service.impl;

import com.zw.rule.qywechat.service.IExtendService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 营销纪录服务
 * @author 陶勇明 create on 2018-07-30
 */
@Service(IExtendService.BEAN_KEY)
public class ExtentionRecordServiceImpl implements IExtendService {

    @Override
    public List<Map<String, String>> findExtendDetail() {
        return null;
    }

    @Override
    public List<Map<String, String>> findExtendList() {
        return null;
    }

}
