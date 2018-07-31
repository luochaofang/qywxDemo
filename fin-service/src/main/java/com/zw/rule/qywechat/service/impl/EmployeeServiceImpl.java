package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.EmployeeManageMapper;
import com.zw.rule.qywechat.service.IEmployeeService;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywxmanage.Customer;
import com.zw.rule.qywxmanage.Employee;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 员工管理
 * @author 仙海峰 create on 2018-07-30
 */
@Service(IEmployeeService.BEAN_KEY)
public class EmployeeServiceImpl implements IEmployeeService {

    @Resource
    private EmployeeManageMapper employeeMapper;

    /**
     * 添加员工
     * @author 仙海峰
     * @param employee
     * @return
     */
    @Override
    public int addEmployee(Employee employee) {
        int count= employeeMapper.insertSelective(employee);
        return count;
    }


    /**
     * 根据员工userId获取员工
     * @author 仙海峰
     * @param userId
     * @return
     */
    @Override
    public Employee selectByUserId(String userId) {
        return employeeMapper.selectByuserId(userId);
    }

    @Override
    public Map<String,String> findAllToMap() {
        List<Employee> employees = employeeMapper.findAll();
        if(CollectionUtils.isEmpty(employees)){return null;}

        Map<String,String> map = new HashMap<>(employees.size());
        for (Employee employee : employeeMapper.findAll()) {
            map.put(employee.getId().toString(),employee.getName());
        }
        return map;
    }


}
