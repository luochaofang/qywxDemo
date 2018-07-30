package com.zw.rule.web.qywechat.controller;

import com.zw.settings.RouterSettings;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * 推广控制器
 * @author 陈淸玉 create on 2018-07-30
 */
@RestController
@RequestMapping(RouterSettings.VERSION + "/extend")
public class ExtendController {

    /**
     * 查看推广列表
     */
    @RequestMapping
    public void findExtendList(HttpServletRequest request){

    }

}
