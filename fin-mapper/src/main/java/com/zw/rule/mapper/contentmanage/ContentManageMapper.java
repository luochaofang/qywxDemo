package com.zw.rule.mapper.contentmanage;

import com.zw.rule.contentmanage.po.Content;

public interface ContentManageMapper {

    int insertSelective(Content record);

    Content selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Content record);

}