package com.zw.rule.qywechat.service;

import java.util.List;
import java.util.Map;

/**
 * 营销纪录服务
 * @author 陶勇明 create on 2018-07-30
 */
public interface IExtentionRecordService {

    String BEAN_KEY = "ExtentionRecordService";

    /**
     * 查看营销明细
     * @return 返回营销明细列表
     */
    List<Map<String,String>> findExtendDetail(long empid);

    /**
     * 查看营销列表
     * @return 返回营销列表
     */
    List<Map<String,String>> findExtendList(long empid);
}
