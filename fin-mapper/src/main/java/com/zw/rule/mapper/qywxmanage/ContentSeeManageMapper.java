package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ContentSee;
import com.zw.rule.qywxmanage.ExtensionRecordQuery;

import java.util.List;

/**
 * 推广内容已查看mapper
 */
public interface ContentSeeManageMapper {

    int insertSelective(ContentSee record);

    ContentSee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentSee record);

    List<ExtensionRecordQuery> selectForExtentionRecord(String empId);

}