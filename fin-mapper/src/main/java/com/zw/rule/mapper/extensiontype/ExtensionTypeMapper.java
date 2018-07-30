package com.zw.rule.mapper.extensiontype;

import com.zw.rule.extensiontype.po.ExtensionType;

public interface ExtensionTypeMapper {
    int insertSelective(ExtensionType record);

    ExtensionType selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ExtensionType record);

}