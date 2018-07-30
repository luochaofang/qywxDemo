package com.zw.rule.mapper.qywxmanage;

import com.zw.rule.qywxmanage.Content;

public interface ContentManageMapper {

    int insertSelective(Content record);

    Content selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Content record);

}