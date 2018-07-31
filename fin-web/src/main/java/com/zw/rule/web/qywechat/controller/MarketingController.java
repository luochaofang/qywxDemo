package com.zw.rule.web.qywechat.controller;

import com.zw.rule.qywechat.service.IMarketingService;
import com.zw.rule.qywxmanage.Content;
import com.zw.rule.qywxmanage.ContentShare;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * 营销任务controller
 * Created by zh on 2018/7/31.
 */
@RestController
@RequestMapping("/marketing")
public class MarketingController {

    @Resource
    private IMarketingService marketingService;

    /**
     * 跳转分享页面
     */
    @RequestMapping("toExtendPage")
    public String toExtendPage() {
        return "marketing/extend";
    }

    /**
     * 跳转分享详情页面
     */
    @RequestMapping("toExtendDeatilPage")
    public String toExtendDeatilPage() {
        return "marketing/extendDetail";
    }

    /**
     * 跳转分享详情页面
     */
    @RequestMapping("toExtendShow")
    public String toExtendShow() {
        return "marketing/extendShow";
    }

    /**
     * 查看推广类型
     */
    @RequestMapping("findExtendType")
    @ResponseBody
    public Map findExtendType() {
        List types = marketingService.findExtensionType();
        Map resMap = new HashedMap();
        resMap.put("code", "0000");
        resMap.put("msg", "success");
        resMap.put("data", types);
        return resMap;
    }

    /**
     * 根据推广类型获取推广内容
     */
    @RequestMapping("findExtends")
    @ResponseBody
    public Map findExtends(Long typeId) {
        List contents = marketingService.findExtensionByType(typeId);
        Map resMap = new HashedMap();
        resMap.put("code", "0000");
        resMap.put("msg", "success");
        resMap.put("data", contents);
        return resMap;
    }

    /**
     * 获取推广内容详情
     */
    @RequestMapping("findExtendDetail")
    @ResponseBody
    public Map findExtendDetail(Long id) {
        Content content = marketingService.findExtensionDetail(id);
        Map resMap = new HashedMap();
        resMap.put("code", "0000");
        resMap.put("msg", "success");
        resMap.put("data", content);
        return resMap;
    }

    /**
     * 获取推广内容详情
     */
    @RequestMapping("addShareInfo")
    @ResponseBody
    public Map addShareInfo(ContentShare share) {
        Map map = marketingService.addShareInfo(share);
        Map resMap = new HashedMap();

        resMap.put("code", (boolean) map.get("succ") ? "0000" : "0001");
        resMap.put("msg", map.get("msg"));
        return resMap;
    }

}
