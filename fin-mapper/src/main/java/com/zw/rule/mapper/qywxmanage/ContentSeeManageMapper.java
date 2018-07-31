package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.ContentSee;
import com.zw.rule.qywxmanage.ExtensionRecordQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 推广内容已查看mapper
 */
public interface ContentSeeManageMapper {

    int insertSelective(ContentSee record);

    ContentSee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContentSee record);

    List<ExtensionRecordQuery> selectForExtentionRecord(String empId);

    /**
     * 获取推广查看人员列表
     * @author 陈淸玉 create on  2018-0-31
     * @param extendTypeId 推广类型ID
     * @param employeeId 推广人ID
     * @return 推广查看人员列表
     */
    List<Long> selectExtendSeeCustomer(@Param("extendTypeId") Long extendTypeId,@Param("employeeId") Long employeeId);
}