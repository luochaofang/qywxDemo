package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentSeeManageMapper;
import com.zw.rule.mapper.qywxmanage.ContentShareManageMapper;
import com.zw.rule.mapper.qywxmanage.EmployeeManageMapper;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywxmanage.Employee;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private ContentShareManageMapper contentShareManageMapper;

    @Autowired
    private ContentSeeManageMapper contentSeeManageMapper;

    @Override
    public List<Map> findPromotionByProTime() {
        List<Employee> employeeList = employeeManageMapper.findPromotionByProTime();
        if(null != employeeList && employeeList.size() > 0) {
            List<Map> listMap = new ArrayList<>();
            for(Employee employee : employeeList) {
                Map<String, Object> map = new HashMap<>(4);
                map.put("id",employee.getId());
                map.put("headImage", employee.getHeadImage());
                map.put("name", employee.getName());
                map.put("countShare", employee.getConutShare());
                listMap.add(map);
            }
            return listMap;
        }
        return null;
    }

    @Override
    public List<Map<String, Object>> countExtendByExtensionType(Long extensionType) {
        return contentShareManageMapper.countExtendByExtensionType(extensionType);
    }

    @Override
    public List<Map<String, Object>> countExtendAll() {
        return contentShareManageMapper.countExtendAll();
    }

    @Override
    public List<Long> selectExtendSeeCustomer(Long extendTypeId, Long employeeId) {
        return contentSeeManageMapper.selectExtendSeeCustomer(extendTypeId,employeeId);
    }
}
