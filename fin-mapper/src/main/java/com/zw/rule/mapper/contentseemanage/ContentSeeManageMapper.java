package com.zw.rule.mapper.contentseemanage;

import com.zw.rule.contentseemanage.po.ContentSee;

public interface ContentSeeManageMapper {

    int insertSelective(ContentSee record);

    ContentSee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentSee record);

}