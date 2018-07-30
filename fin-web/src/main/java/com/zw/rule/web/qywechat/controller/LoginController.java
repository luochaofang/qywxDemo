package com.zw.rule.web.qywechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.zw.base.util.StringUtils;
import com.zw.rule.core.Response;
import com.zw.rule.qywechat.service.IEmployeeService;
import com.zw.rule.qywxmanage.Employee;
import com.zw.rule.util.HttpUtil;
import com.zw.rule.web.aop.annotaion.WebLogger;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;


@Controller
@RequestMapping("qywechatLogin")
public class LoginController {

    @Autowired
    private IEmployeeService employeeService;

    /**
     * 登录跳转页面
     * @author 仙海峰
     * @param request
     * @return
     */
    @GetMapping("loginPage")
    @WebLogger("登录跳转页面")
    public String loginPage(HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = session.getAttribute("userId").toString();
        String url="";
        if (StringUtils.isNotEmpty(userId)){
            url="";
        }else {
            url="qyWeChat/login";
        }
        return url;
    }


    /**
     * 免密登录
     * @author 仙海峰
     * @param request
     * @return
     */
    @PostMapping("login")
    @WebLogger("免密登录")
    public String login(HttpServletRequest request)throws Exception {
        String url="";
        String accessToken="";
        String code = request.getParameter("code");
        Employee newEmployee =new Employee();
        String userInfoJson = HttpUtil.doGet("https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="+accessToken+"&code="+code+"");
        if (StringUtils.isNotEmpty(userInfoJson)){
            //解析json
            JSONObject parse = (JSONObject)JSONObject.parse(userInfoJson);
            //获取UserId
            String userId = parse.getString("userid");
            //获取姓名
            String name = parse.getString("name");
            //获取头像URL
            String avatar = parse.getString("avatar");

            //封装Employee对象
            newEmployee.setUserid(userId);
            newEmployee.setName(name);
            newEmployee.setHeadImage(avatar);
        }

        Employee employee= employeeService.selectByUserId(newEmployee.getUserid());
        if (employee == null){
            employeeService.addEmployee(newEmployee);
        }

        //将userId放入session
        request.setAttribute("userId",newEmployee.getUserid());

        return url;
    }

}
