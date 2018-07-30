package com.zw.rule.mapper.qywxmanage;

import com.zw.rule.po.CustomerManage;
import com.zw.rule.po.CustomerManageExample;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CustomerManageMapper {
    int countByExample(CustomerManageExample example);

    int deleteByExample(CustomerManageExample example);

    int deleteByPrimaryKey(Long id);

    int insert(CustomerManage record);

    int insertSelective(CustomerManage record);

    List<CustomerManage> selectByExample(CustomerManageExample example);

    CustomerManage selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") CustomerManage record, @Param("example") CustomerManageExample example);

    int updateByExample(@Param("record") CustomerManage record, @Param("example") CustomerManageExample example);

    int updateByPrimaryKeySelective(CustomerManage record);

    int updateByPrimaryKey(CustomerManage record);
}