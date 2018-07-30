package com.zw.rule.qywechat.service;

import java.util.List;
import java.util.Map;

/**
 * 推广服务
 * @author 陈淸玉 create on 2018-07-30
 */
public interface IExtendService {

    String BEAN_KEY = "extendServiceImpl";

    /**
     * 查看推广明细
     * @return 返回推广明细列表
     */
    List<Map<String,String>> findExtendDetail();

    /**
     * 查看推广列表
     * @return 返回推广列表
     */
    List<Map<String,String>> findExtendList();
}
