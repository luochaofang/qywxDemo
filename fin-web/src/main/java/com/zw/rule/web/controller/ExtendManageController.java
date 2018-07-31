package com.zw.rule.web.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zw.rule.core.Response;
import com.zw.rule.jeval.tools.StringUtil;
import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.qywechat.service.IExtendContentService;
import com.zw.rule.qywxmanage.Content;
import com.zw.rule.web.util.PageConvert;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;



@Controller
@RequestMapping("extendManage")
public class ExtendManageController {
    @Resource
    private IExtendContentService extendContentService;

    @GetMapping("contentList")
    public String list() {
        return "extendManage/extendContent";
    }

    @ResponseBody
    @PostMapping("contentListPage")
    public Response list(@RequestBody ParamFilter queryFilter) {
        int pageNo = PageConvert.convert(queryFilter.getPage().getFirstIndex(),queryFilter.getPage().getPageSize());
        PageHelper.startPage(pageNo, queryFilter.getPage().getPageSize());
        List list = extendContentService.findExtendContentList(queryFilter);
        PageInfo pageInfo = new PageInfo(list);
        return Response.ok(pageInfo);
    }

    @ResponseBody
    @PostMapping("addContent")
    public Response addContent(@RequestBody Content content) {
        try {
            int num = extendContentService.addExtendContent(content);
            if(num > 0) {
                return Response.ok("操作成功",null);
            }
            return Response.error("操作失败");
        } catch (Exception e) {
            return Response.error();
        }
    }

    @ResponseBody
    @RequestMapping("updateContent")
    public Response updateContent(@RequestBody Content content) {
        try {
            if(null == content.getId()) {
                Response.error("内容id不能为空");
            }
            int num = extendContentService.updateExtendContent(content);
            if(num > 0) {
                return Response.ok("操作成功",null);
            }
            return Response.error("操作失败");
        } catch (Exception e) {
            return Response.error();
        }
    }

    @ResponseBody
    @PostMapping("deleteContent")
    public Response deleteContent(@RequestBody String id) {
        try {
            if(StringUtil.isBlank(id)){
                return Response.error("内容id不能为空");
            }
            extendContentService.deleteExtentContent(Long.valueOf(id));
            return Response.ok("操作成功");
        } catch (Exception e) {
            return Response.error();
        }
    }

    @ResponseBody
    @GetMapping("detailContent")
    public Response detailContent(@RequestBody String id) {
        try {
            if(StringUtil.isBlank(id)){
                return Response.error("内容id不能为空");
            }
            Content content = extendContentService.getExtentContent(Long.valueOf(id));
            return Response.ok(content);
        } catch (Exception e) {
            return Response.error();
        }
    }

}
