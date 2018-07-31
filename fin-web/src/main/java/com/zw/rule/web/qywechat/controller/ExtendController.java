package com.zw.rule.web.qywechat.controller;

import com.zw.rule.core.Response;
import com.zw.rule.qywechat.service.IExtendService;
import com.zw.settings.RouterSettings;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 推广控制器
 * @author 陈淸玉 create on 2018-07-30
 */
@RestController
@RequestMapping(RouterSettings.VERSION + "/extend")
public class ExtendController {

    @Resource
    private IExtendService extendService;

    /**
     * 查看推广列表
     */
    @RequestMapping
    public void findExtendList(HttpServletRequest request){

    }

    /**
     * 查询推广排行榜员工信息
     */
    @ResponseBody
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
