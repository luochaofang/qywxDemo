package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentSeeManageMapper;
import com.zw.rule.mapper.qywxmanage.CustomerManageMapper;
import com.zw.rule.mapper.qywxmanage.UserMapper;
import com.zw.rule.qywechat.service.IExtentionRecordService;
import com.zw.rule.qywxmanage.CustomerRecord;
import com.zw.rule.qywxmanage.User;
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
    @Resource
    CustomerManageMapper customerManageMapper;
    @Resource
    UserMapper userMapper;
    @Override
    public List<Map<String, String>> findExtendList(long empid) {
        return null;
    }

    @Override
    public List<Map<String, String>> findExtendDetail(long empid) {
        return null;
    }

    @Override
    public List<CustomerRecord> clicksRecord(Long id) {
        return customerManageMapper.clicksRecord(id);
    }

    @Override
    public int insertSelective(User record) {
        return userMapper.insertSelective(record);
    }

    @Override
    public User selectByPrimaryKey(Long id) {
        return userMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(User record) {
        return userMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int deleteByPrimaryKey(Long id) {
        return userMapper.deleteByPrimaryKey(id);
    }

    @Override
    public User selectByMobile(String mobile) {

        return userMapper.selectByMobile(mobile);
    }

}
