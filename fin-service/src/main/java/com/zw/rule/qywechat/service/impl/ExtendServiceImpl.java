package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentShareManageMapper;
import com.zw.rule.mapper.qywxmanage.EmployeeManageMapper;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywxmanage.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import com.zw.rule.qywxmanage.Employee;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 推广服务
 * @author 陈淸玉 create on 2018-07-30
 */
@Service(IExtendService.BEAN_KEY)
public class ExtendServiceImpl implements IExtendService {
    @Resource
    private EmployeeManageMapper employeeManageMapper;

    @Override
    public List<Customer> findExtendDetails() {
        return null;
    }

    @Autowired
    private ContentShareManageMapper contentShareManageMapper;

    @Override
    public List<Map<String, String>> findExtends() {
        return null;
    }

    @Override
    public List<Map> findPromotionByProTime() {
        List<Employee> employeeList = employeeManageMapper.findPromotionByProTime();
        if(null != employeeList && employeeList.size() > 0) {
            List<Map> listMap = new ArrayList<>();
            for(Employee employee : employeeList) {
                Map<String, Object> map = new HashMap<>();
                map.put("id",employee.getId());
                map.put("headImage", employee.getHeadImage());
                map.put("name", employee.getName());
                map.put("conutShare", employee.getConutShare());
                listMap.add(map);
            }
            return listMap;
        }
        return null;
    }

    public List<Map<String, String>> countExtendByExtensionType(Integer extensionType) {
        return contentShareManageMapper.countExtendByExtensionType(extensionType);
    }


}
