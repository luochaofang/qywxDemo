package com.zw.rule.qywechat.service;

import com.zw.rule.qywxmanage.CustomerRecord;
import com.zw.rule.qywxmanage.ExtensionRecordQuery;
import com.zw.rule.qywxmanage.User;

import java.util.List;

/**
 * 营销纪录服务
 * @author 陶勇明 create on 2018-07-30
 */
public interface IExtentionRecordService {

    String BEAN_KEY = "ExtentionRecordService";


    /**
     * 查看营销列表
     * @return 返回营销列表
     */
    List<ExtensionRecordQuery> findExtendList(String userid);

    /**
     * 查看营销类型查询记录详情
     * @return 返回营销记录详情列表
     */
    List<CustomerRecord> clicksRecord(Long id);

    /**
     * 添加用户
     * @param record
     * @return
     */
    int insertSelective(User record);

    /**
     * 根据id查询用户
     * @param id
     * @return
     */
    User selectByPrimaryKey(Long id);

    /**
     * 修改用户
     * @param record
     * @return
     */
    int updateByPrimaryKeySelective(User record);

    /**
     * 删除用户
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Long id);

    /**
     * 根据手机查询用户，做验证用的
     * @param mobile
     * @return
     */
    User selectByMobile(String mobile);
}
