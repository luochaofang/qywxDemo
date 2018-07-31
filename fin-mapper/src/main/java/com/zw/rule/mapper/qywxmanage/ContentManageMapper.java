package com.zw.rule.mapper.qywxmanage;

import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.qywxmanage.Content;

import java.util.List;

/**
 * 推广内容mapper
 */
public interface ContentManageMapper {

    int insertSelective(Content record);

    void deleteByPrimaryKey(Long id);

    Content selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Content record);

    List<Content> findExtendContentList(ParamFilter paramFilter);

}