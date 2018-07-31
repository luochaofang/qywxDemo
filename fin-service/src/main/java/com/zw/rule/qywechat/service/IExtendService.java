package com.zw.rule.qywechat.service;

import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.qywxmanage.Content;
import com.zw.rule.qywxmanage.Customer;
import com.zw.rule.qywxmanage.Employee;

import java.util.List;
import java.util.Map;

/**
 * 推广服务
 * @author 陈淸玉 create on 2018-07-30
 */
public interface IExtendService {

    String BEAN_KEY = "extendServiceImpl";

    /**
     * 查询推广排行榜员工信息
     * @return
     */
    List<Map> findPromotionByProTime() throws Exception;

    /**
     * 根据推广类型 统计每人推广总数
     * @author 陈淸玉 create on 2018-07-30
     * @param extensionType 推广类型
     * @return 每人推广总数
     */
    List<Map<String,Object>> countExtendByExtensionType(Long extensionType);

    /**
     * 统计每人推广总数
     * @author 陈淸玉 create on 2018-07-30
     * @return 每人推广总数
     */
    List<Map<String,Object>> countExtendAll();


    /**
     * 获取推广查看人员列表
     * @author 陈淸玉 create on  2018-0-31
     * @param extendTypeId 推广类型ID
     * @param employeeId 推广人ID
     * @return 推广查看人员列表
     */
    List<Long> selectExtendSeeCustomer(Long extendTypeId,Long employeeId);

}
