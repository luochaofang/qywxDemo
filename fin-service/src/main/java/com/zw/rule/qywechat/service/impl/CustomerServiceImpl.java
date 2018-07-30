package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.CustomerManageMapper;
import com.zw.rule.qywechat.service.ICustomerService;
import com.zw.rule.qywxmanage.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 客户服务
 * @author 陈淸玉 create on 2018-07-30
 */
@Service(ICustomerService.BEAN_KEY)
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private CustomerManageMapper customerManageMapper;

    @Override
    public List<Customer> findCustomerDetail(Integer extensionType) {
        return customerManageMapper.findByExtensionType(extensionType);
    }
}
