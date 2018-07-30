package com.zw.rule.mapper.qywxmanage;

import com.zw.rule.qywxmanage.ContentShare;

/**
 * 推广内容分享管理
 */
public interface ContentShareManageMapper {
    int insertSelective(ContentShare record);

    ContentShare selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentShare record);

}