package com.zw.rule.web.qywechat.controller;

import com.zw.base.util.ObjectUtils;
import com.zw.rule.qywechat.service.ICustomerService;
import com.zw.rule.qywechat.service.IEmployeeService;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywechat.service.IExtensionTypeService;
import com.zw.rule.qywxmanage.Customer;
import com.zw.rule.qywxmanage.Employee;
import com.zw.rule.qywxmanage.ExtensionType;
import com.zw.rule.web.qywechat.business.ExtendBusiness;
import com.zw.settings.RouterSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

/**
 * 推广控制器
 * @author 陈淸玉 create on 2018-07-30
 */
@Controller
@RequestMapping(RouterSettings.VERSION + "/extend")
public class ExtendController {

    @Autowired
    private IExtendService extendService;

    @Autowired
    private IExtensionTypeService extensionTypeService;

    @Autowired
    private IEmployeeService employeeService;

    @Autowired
    private ICustomerService customerService;

    /**
     * 查看推广列表 create on 陈淸玉
     */
    @GetMapping("extendDetail")
    public String extendDetail(Model model){
        //推广列表
        List<ExtensionType> typeList = extensionTypeService.findTypes();
        if(CollectionUtils.isEmpty(typeList)){
            throw new RuntimeException("推广类型为空！");
        }
        ExtendBusiness extendBusiness = new ExtendBusiness(extendService,typeList);
        List<Map<String, Object>> maps = extendBusiness.extendDetailList();
        //推广明细list
        model.addAttribute("extendDetailList",maps);
        //推广类型
        model.addAttribute("typeList",typeList);
        //员工信息
        model.addAttribute("employeeMap",employeeService.findAllToMap());
        return "qyWeChat/extendDetailList";
    }

    /**
     * 获取推广查看人员列表
     * @author 陈淸玉 create on  2018-0-31
     * @param extendTypeId 推广类型ID
     * @param employeeId 推广人ID
     */
    @GetMapping("extendDetail/{extendTypeId}/{employeeId}")
    public String extendDetail(Model model, @PathVariable Long extendTypeId,  @PathVariable Long employeeId){
        ExtensionType extensionType = extensionTypeService.getExtensionTypeById(extendTypeId);
        Employee employee = employeeService.getEmployeeById(employeeId);
        //推广查看人员id
        List<Long> customerIdList = extendService.selectExtendSeeCustomer(extendTypeId, employeeId);
        //推广查看人信息
        List<Customer> customerList = customerService.selectAll();
        Map<String, Customer> customerMap = ObjectUtils.ListToMap("id",  customerList);
        //查看用户列表
        model.addAttribute("customerIdList",customerIdList);
        //全部查看用户map
        model.addAttribute("customerMap",customerMap);
        //推广类型
        model.addAttribute("extensionType",extensionType);
        //推广用户
        model.addAttribute("employee",employee);
        return "qyWeChat/extendDetail";
    }

    /**
     * 查询推广排行榜员工信息
     */
    @GetMapping("findPromotionByProTime")
    public ModelAndView findPromotionByProTime(){
        ModelAndView modelAndView = new ModelAndView("qyWeChat/index");
        try {
            List<Map> listMap = extendService.findPromotionByProTime();
            modelAndView.addObject("listMap",listMap);
            return modelAndView;
        } catch (Exception e) {
            e.printStackTrace();
            return modelAndView.addObject("message","系统异常");
        }
    }






}
