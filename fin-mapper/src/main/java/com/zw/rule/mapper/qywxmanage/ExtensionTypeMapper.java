package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ExtensionType;

/**
 * 推广类型mapper
 */
public interface ExtensionTypeMapper {
    int insertSelective(ExtensionType record);

    ExtensionType selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ExtensionType record);

}