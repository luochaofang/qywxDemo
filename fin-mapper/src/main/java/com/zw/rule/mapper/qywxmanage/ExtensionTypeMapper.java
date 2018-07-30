package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ExtensionType;

import java.util.List;

/**
 * 推广类型mapper
 */
public interface ExtensionTypeMapper {
    int insertSelective(ExtensionType record);

    ExtensionType selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ExtensionType record);

    /**
     * 获取全部类型列表
     * @return 类型列表
     */
    List<ExtensionType> findTypes();

}