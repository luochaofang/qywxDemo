package com.zw.rule.web.repayment.controller;//package com.zw.rule.web.LoanController;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zw.base.util.Consts;
import com.zw.base.util.StringUtils;
import com.zw.rule.api.asset.AssetRequest;
import com.zw.rule.core.Response;
import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.repayment.service.RepaymentService;
import com.zw.rule.web.util.PageConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("repayment")
public class RepaymentController {

    @Autowired
    private RepaymentService repaymentService;

    @RequestMapping(value = "list",method = RequestMethod.GET)
    public String list(){
        return "";
    }

    /* *
     * 获取分页的还款计划
     * */
    @RequestMapping(value = "getList" ,method = RequestMethod.POST)
    @ResponseBody
    public Response list(@RequestBody ParamFilter queryFilter){
        return getResponse(queryFilter);
    }

    /* *
    * 获取分页的还款计划商品贷
    * */
    @RequestMapping(value = "getListSP" ,method = RequestMethod.POST)
    @ResponseBody
    public Response listSP(@RequestBody ParamFilter queryFilter){
        return getResponse(queryFilter);
    }

    private Response getResponse(@RequestBody ParamFilter queryFilter) {
        Map param = queryFilter.getParam();
        Response response = new Response();
        int pageNo = PageConvert.convert(queryFilter.getPage().getFirstIndex(),queryFilter.getPage().getPageSize());
        PageHelper.startPage(pageNo, queryFilter.getPage().getPageSize());
        List list = repaymentService.getRepaymentList(param);
        PageInfo pageInfo = new PageInfo(list);
        response.setData(pageInfo);
        return response;
    }

    /**
     * 刷新还款计划
     * @author 韩梅生
     * @param request 订单编号+客户id
     * @return
     */
    @RequestMapping("getRepaymentListByProjectId")
    @ResponseBody
    public Response getRepaymentListByProjectId(@RequestBody AssetRequest request) {
        if (request == null) {
            return Response.error("参数异常");
        }
        try {
            String  assetDataStr = repaymentService.getRepaymentListByProjectId(request);
            if (StringUtils.isNotEmpty(assetDataStr)) {
                JSONObject resultStr = JSONObject.parseObject(assetDataStr);
                String resCode = resultStr.get("retCode").toString();
                if ((Consts.API_SUCCESS).equals(resCode)) {
                    return Response.ok("更新还款计划成功！",null);
                }
            }
            return Response.error("更新失败！");
        } catch (IOException e) {
            e.printStackTrace();
            return Response.error(e.getMessage());
        }
    }
}
