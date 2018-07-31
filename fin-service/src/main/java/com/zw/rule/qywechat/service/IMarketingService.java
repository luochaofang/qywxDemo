package com.zw.rule.qywechat.service;

import com.zw.rule.qywxmanage.Content;
import com.zw.rule.qywxmanage.ContentShare;
import com.zw.rule.qywxmanage.ExtensionType;

import java.util.List;
import java.util.Map;

/**
 * 营销任务service接口
 * Created by zh on 2018/7/31.
 */
public interface IMarketingService {
    /**
     * 获取推广类型
     *
     * @return
     */
    List<ExtensionType> findExtensionType();

    /**
     * 根据类型id获取推广内容
     *
     * @param typeId 类型id
     * @return
     */
    List<Content> findExtensionByType(long typeId);

    /**
     * 根据id获取推广内容详情
     *
     * @param id id
     * @return
     */
    Content findExtensionDetail(long id);

    Map addShareInfo(ContentShare share);
}
