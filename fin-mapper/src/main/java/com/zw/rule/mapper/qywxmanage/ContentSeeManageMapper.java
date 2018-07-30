package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ContentSee;

public interface ContentSeeManageMapper {

    int insertSelective(ContentSee record);

    ContentSee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentSee record);

}