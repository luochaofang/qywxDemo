package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.Employee;

/**
 * 推广员工mapper
 */
public interface EmployeeManageMapper {

    int insertSelective(Employee record);

    Employee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Employee record);

}