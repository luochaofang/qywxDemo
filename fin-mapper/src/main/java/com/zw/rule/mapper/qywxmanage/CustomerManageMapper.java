package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.Customer;

import java.util.List;

public interface CustomerManageMapper {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Customer record);

    Customer selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Customer record);

    int updateByPrimaryKey(Customer record);

    List<Customer> findByExtensionType(Integer extensionType);
}