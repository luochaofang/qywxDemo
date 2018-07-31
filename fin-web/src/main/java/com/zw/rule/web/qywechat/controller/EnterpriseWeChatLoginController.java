package com.zw.rule.web.qywechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.zw.base.util.StringUtils;
import com.zw.base.util.TraceLoggerUtil;
import com.zw.rule.enterpriseWeChat.TicketUtil;
import com.zw.rule.qywechat.service.IEmployeeService;
import com.zw.rule.qywxmanage.Employee;
import com.zw.rule.util.HttpUtil;
import com.zw.settings.RouterSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;


/**
 * 企业微信免密登录
 * @author 仙海峰 2018-7-30
 */
@Controller
@RequestMapping(RouterSettings.VERSION + "/qywechatLogin")
public class EnterpriseWeChatLoginController {

    @Autowired
    private IEmployeeService employeeService;


    /**
     * 登录跳转页面
     * @author 仙海峰
     * @param request
     * @return
     */
    @ResponseBody
    @GetMapping("loginPage")
    public ModelAndView loginPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ModelAndView modelAndView = new ModelAndView("qyWeChat/qyWechatLogin");
        HttpSession session = request.getSession();
        String userId = String.valueOf(session.getAttribute("userId"));

        if (!"null".equals(userId) && StringUtils.isNotEmpty(userId)){
            request.getRequestDispatcher(RouterSettings.VERSION+"/extend/findPromotionByProTime").forward(request, response);
        }
        return modelAndView;
    }


    /**
     * 免密登录
     * @author 仙海峰
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "login")
    public void login(HttpServletRequest request,HttpServletResponse response)throws Exception {
        HttpSession session = request.getSession();
        Employee newEmployee =new Employee();
        String accessToken= TicketUtil.getAccessToken("1000002");
        String code = request.getParameter("code");

        TraceLoggerUtil.info("accessToken====="+accessToken);
        System.out.println("accessToken====="+accessToken);
        TraceLoggerUtil.info("code====="+code);
        System.out.println("code====="+code);

        if(StringUtils.isNotEmpty(accessToken) && StringUtils.isNotEmpty(code) && !"null".equals(code)){
            String userInfoJson = HttpUtil.doGet("https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="+accessToken+"&code="+code+"");

            System.out.println("userInfoJson====="+userInfoJson);
            TraceLoggerUtil.info("userInfoJson====="+userInfoJson);

            if (StringUtils.isNotEmpty(userInfoJson)){
                //解析json
                JSONObject parse = (JSONObject)JSONObject.parse(userInfoJson);
                //获取UserId
                String userId = parse.getString("userid");
                //获取姓名
                String name = parse.getString("name");
                //获取头像URL
                String avatar = parse.getString("avatar");
                //获取返回码
                String errcode = parse.getString("errcode");

                if ("0".equals(errcode)){
                    //封装Employee对象
                    newEmployee.setUserid(userId);
                    newEmployee.setName(name);
                    newEmployee.setHeadImage(avatar);

                    Employee employee= employeeService.selectByUserId(newEmployee.getUserid());
                    if (employee == null){
                        employeeService.addEmployee(newEmployee);
                    }
                    //将userId放入session
                    session.setAttribute("userId",newEmployee.getUserid());

                    request.getRequestDispatcher(RouterSettings.VERSION+"/extend/findPromotionByProTime").forward(request, response);
                }
            }
        }


    }

}
