package com.zw.rule.qywechat.service;

import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.qywxmanage.Content;

import java.util.List;
import java.util.Map;

/**
 * 推广内容服务
 * @author luochaofang create on 2018-07-30
 */
public interface IExtendContentService {

    String BEAN_KEY = "extendContentServiceImpl";

    /**
     * 分页获取推广内容
     * @param param
     * @return
     */
    List<Content> findExtendContentList(ParamFilter param);

    /**
     * 添加推广内容
     * @param content
     * @return
     */
    int addExtendContent(Content content);

    /**
     * 更新推广内容
     * @param content
     * @return
     */
    int updateExtendContent(Content content);

    /**
     * 删除推广内容
     * @param id
     */
    void deleteExtentContent(Long id);

    /**
     * 根据主键id获取推广内容
     * @param id
     * @return
     */
    Content getExtentContent(Long id);

    /**
     * 获取所有推广类型
     * @return
     */
    List<Map<String,Object>> findExtentType();
}
