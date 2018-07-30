package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentSeeManageMapper;
import com.zw.rule.qywechat.service.IExtentionRecordService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * 营销纪录服务
 * @author 陶勇明 create on 2018-07-30
 */
@Service(IExtentionRecordService.BEAN_KEY)
public class ExtentionRecordServiceImpl implements IExtentionRecordService {

    @Resource
    ContentSeeManageMapper contentSeeManageMapper;

    @Override
    public List<Map<String, String>> findExtendList(long empid) {
        return null;
    }
    
    @Override
    public List<Map<String, String>> findExtendDetail(long empid) {
        return null;
    }


}
