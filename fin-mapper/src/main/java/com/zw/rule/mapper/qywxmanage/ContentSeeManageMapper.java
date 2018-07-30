package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ContentSee;

import java.util.List;
import java.util.Map;

/**
 * 推广内容已查看mapper
 */
public interface ContentSeeManageMapper {

    int insertSelective(ContentSee record);

    ContentSee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentSee record);

    List<Map<String, String>> selectForExtentionRecord(Long empId);

}