package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ExtensionType;

import java.util.List;
import java.util.Map;

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

    /**
     * 获取类型列表（模糊查询）
     * @param param
     * @return
     */
    List<ExtensionType> getExtensionTypeList(Map param);

}