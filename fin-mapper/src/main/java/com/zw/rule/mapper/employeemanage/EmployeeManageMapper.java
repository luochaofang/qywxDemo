package com.zw.rule.mapper.employeemanage;

import com.zw.rule.employeemanage.po.Employee;

/**
 * 推广员工mapper
 */
public interface EmployeeManageMapper {

    int insertSelective(Employee record);

    Employee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Employee record);

}