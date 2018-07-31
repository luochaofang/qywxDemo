package com.zw.rule.web.qywechat.controller;

import com.zw.rule.qywechat.service.IEmployeeService;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywechat.service.IExtensionTypeService;
import com.zw.rule.qywxmanage.ExtensionType;
import com.zw.rule.web.qywechat.business.ExtendBusiness;
import com.zw.settings.RouterSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
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
        //用户信息
        model.addAttribute("employeeMap",employeeService.findAllToMap());
        return "qyWeChat/extendDetailList";
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
