package com.zw.rule.qywechat.service;


import com.zw.rule.qywxmanage.Employee;

import java.util.List;
import java.util.Map;

/**
 * 员工管理
 * @author 仙海峰 create on 2018-07-30
 */
public interface IEmployeeService {

    String BEAN_KEY = "employeeServiceImpl";

    /**
     * 添加员工
     * @author 仙海峰
     * @param employee
     * @return
     */
    int addEmployee(Employee employee);

    /**
     * 根据员工userId获取员工
     * @author 仙海峰
     * @param userId
     * @return
     */
    Employee selectByUserId(String userId);

    /**
     * 查询所有员工信息
     * @author 陈淸玉
     * @return 员工列表
     */
    Map<String,String> findAllToMap();




}
