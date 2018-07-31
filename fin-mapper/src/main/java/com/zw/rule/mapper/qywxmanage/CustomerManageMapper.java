package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.Customer;
import com.zw.rule.qywxmanage.CustomerRecord;
import java.util.List;

public interface CustomerManageMapper {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Customer record);

    Customer selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Customer record);

    int updateByPrimaryKey(Customer record);

    List<CustomerRecord> clicksRecord(Long id);

    /**
     * 查询所有用户信息
     * @author 陈淸玉
     * @return 查看人信息列表
     */
    List<Customer> selectAll();
}