package com.zw.rule.web.qywechat.controller;


import com.zw.rule.qywechat.service.IExtentionRecordService;
import com.zw.rule.qywxmanage.ExtensionRecordQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("extensionrecord")
public class ExtensionRecordContorller {

    @Autowired
    IExtentionRecordService extentionRecordService;

    @GetMapping("queryrecord")
    public String queryrecord(Model model, HttpServletRequest request,
                              HttpServletResponse response
                              ){
        HttpSession session = request.getSession();
        String userId = "fdfdf";
        //String userId = session.getAttribute("userId").toString();
        List<ExtensionRecordQuery>  list = extentionRecordService.findExtendList(userId);
        model.addAttribute("list", list);
        return "qyWeChat/extensionrecord";
    }

}
