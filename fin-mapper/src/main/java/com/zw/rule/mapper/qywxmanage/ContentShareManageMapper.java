package com.zw.rule.mapper.qywxmanage;

import com.zw.rule.qywxmanage.ContentShare;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 推广内容分享管理
 */
public interface ContentShareManageMapper {
    int insertSelective(ContentShare record);

    ContentShare selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentShare record);

    /**
     * 根据推广类型 统计每人推广总数
     * @param extensionType 推广类型
     * @return 每人推广总数
     */
    List<Map<String,String>> countExtendByExtensionType(@Param("extensionType") Integer extensionType);

}