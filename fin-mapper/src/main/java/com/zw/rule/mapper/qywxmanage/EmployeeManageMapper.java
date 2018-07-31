package com.zw.rule.mapper.qywxmanage;


import com.zw.rule.qywxmanage.Employee;

import java.util.List;

/**
 * 推广员工mapper
 */
public interface EmployeeManageMapper {

    int insertSelective(Employee record);

    Employee selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Employee record);

    /**
     * 查询推广员工信息(排序)
     * @return
     */
    List<Employee> findPromotionByProTime();

    /**
     * 根据userId获取员工
     * @param userId
     * @return
     */
    Employee selectByuserId(String userId);

}