package com.zw.rule.mapper.contentsharemanage;

import com.zw.rule.contentsharemanage.po.ContentShare;

/**
 * 推广内容分享管理
 */
public interface ContentShareManageMapper {
    int insertSelective(ContentShare record);

    ContentShare selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentShare record);

}