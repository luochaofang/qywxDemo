package com.zw.rule.web.controller;


import com.junziqian.api.request.OrganizationAuditStatusRequest;
import com.junziqian.api.response.OrganizationAuditStatusResponse;
import com.mysql.jdbc.StringUtils;
import com.zw.base.util.DateUtils;
import com.zw.rule.core.Response;
import com.zw.rule.pcd.po.City;
import com.zw.rule.pcd.po.Province;
import com.zw.rule.pcd.service.IPCDLinkedService;
import com.zw.rule.po.Dict;
import com.zw.rule.po.SysDepartment;
import com.zw.rule.service.DictService;
import com.zw.rule.service.SysDepartmentService;
import com.zw.rule.upload.service.UploadService;
import com.zw.rule.web.aop.annotaion.WebLogger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 * Created by shengkf on 2017/6/13.
 */
@Controller
@RequestMapping("sysDepartment")
public class SysDepartmentController {
    @Resource
    public SysDepartmentService sysDepartmentService;
    @Resource
    private DictService dictService;
    @Resource
    private IPCDLinkedService pcdLinkedService;
    @Resource
    private UploadService uploadService;

    @RequestMapping({"/toindex"})
    public String testInfo() {
        return "/systemMange/magDepartment";
    }

    /**
     * 获取组织架构信息
     *
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping("getDepartmentZtree")
    public Response getDepartmentZtree() throws Exception {
        // 响应给前台数据的编码
        Map map = new HashMap();
        map.put("status", "1");//部门状态为启用
        String flag = "true";
        List list = sysDepartmentService.findAllDepts(map);
        if (list.size() == 0) {//判断表中是否有启用的部门公司
            flag = "false";
        }
        List<SysDepartment> departlist = new ArrayList<SysDepartment>(list);
        for (int i = 0; i < departlist.size(); i++) {//根据id查询省市的名称放到地址中
            Map pcdmap = new HashMap();
            String provinceId = departlist.get(i).getProvinceId();//省id
            String cityId = departlist.get(i).getCityId();//市id
            String provincename = "";
            String cityname = "";
            if (!"".equals(provinceId)) {
                Province province = pcdLinkedService.getProvinceById(provinceId);
                provincename = province == null ? "" : province.getProvinceName();
            }
            if (!"".equals(cityId)) {
                City city = pcdLinkedService.getCityById(cityId);
                cityname = city == null ? "" : city.getCityName();
            }
            departlist.get(i).setProAddress(provincename + cityname);
        }

        LinkedList<SysDepartment> finalList = new LinkedList<SysDepartment>();
        for (int i = 0; i < list.size(); i++) {
            Long l_parent_id = departlist.get(i).getPid();
            long l_id = departlist.get(i).getId();
            if (finalList.isEmpty()) {
                finalList.addLast(departlist.get(i));
            } else {
                for (int j = 0; j < finalList.size(); j++) {
                    long s_id = finalList.get(j).getId();
                    Long s_parent_id = finalList.get(j).getPid();
                    if (l_parent_id.equals(s_id)) {
                        finalList.add(j + 1, departlist.get(i));
                        for (int k = 0; k < finalList.size(); k++) {
                            SysDepartment sysDepartment = finalList.get(k);
                            Long k_parent_id = finalList.get(k).getPid();
                            if (l_id == k_parent_id) {
                                finalList.remove(k);
                                finalList.add(j + 2, sysDepartment);
                            }
                        }
                        break;
                    } else if (l_id == s_parent_id) {
                        if (j == 0) {
                            finalList.add(0, departlist.get(i));
                            break;
                        } else {
                            finalList.add(j - 1, departlist.get(i));
                            break;
                        }
                    } else if (finalList.size() - 1 == j) {
                        finalList.addLast(departlist.get(i));
                        break;
                    }
                }
            }
        }
        Response response = new Response();
        response.setData(finalList);
        response.setMsg(flag);
        return response;
    }

    /**
     * 添加按钮回显数据(暂时用不到)
     *
     * @param paramMap pid 父节点id
     *                 number 部门编号
     *                 id  部门id
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping("findAllByMap")
    public Response findAllByMap(@RequestBody HashMap<String, Object> paramMap) throws Exception {
        List list = sysDepartmentService.findAllDepts(paramMap);
        return new Response(list);
    }

    /**
     * 添加公司、部门保存
     *
     * @param department type 类型（公司、部门）
     *                   name  部门名称
     *                   pid 父级部门id
     *                   description 备注
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("saveDepartment")
    public Response saveOrUpdateDepartment(@RequestBody SysDepartment department) throws Exception {
        String grade = department.getGrade();//判断是父级还是子级
        if ("0".equals(grade)) {  //添加父级节点
            department.setPid(0);
        }
        //获取返回结果
        boolean flag = sysDepartmentService.saveDepartment(department);
        Response response = new Response();
        if (flag) {
            response.setMsg("保存成功！");
        } else {
            response.setMsg("保存失败！");
        }
        return response;

    }

    /**
     * 修改公司、部门
     *
     * @param department
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("updateDepartment")
    public Response UpdateDepartment(@RequestBody SysDepartment department) throws Exception {
        //获取返回结果
        boolean flag = sysDepartmentService.updateDepartment(department);
        Response response = new Response();
        if (flag) {
            response.setMsg("修改成功！");
        } else {
            response.setMsg("修改失败！");
        }
        return response;

    }

    public static String saveUrlAs(String url, String filePath, String method) {
        //System.out.println("fileName---->"+filePath);
        //创建不同的文件夹目录
        File file = new File(filePath);
        String fileName = "";
        //判断文件夹是否存在
        if (!file.exists()) {
            //如果文件夹不存在，则创建新的的文件夹
            file.mkdirs();
        }
        FileOutputStream fileOut = null;
        HttpURLConnection conn = null;
        InputStream inputStream = null;
        try {
            // 建立链接
            URL httpUrl = new URL(url);
            conn = (HttpURLConnection) httpUrl.openConnection();
            //以Post方式提交表单，默认get方式
            conn.setRequestMethod(method);
            conn.setDoInput(true);
            conn.setDoOutput(true);
            // post方式不能使用缓存
            conn.setUseCaches(false);
            //连接指定的资源
            conn.connect();
            //获取网络输入流
            inputStream = conn.getInputStream();
            BufferedInputStream bis = new BufferedInputStream(inputStream);
            //判断文件的保存路径后面是否以/结尾
            if (!filePath.endsWith("/")) {

                filePath += "/";

            }
            //写入到文件（注意文件保存路径的后面一定要加上文件的名称）
            fileName = filePath + UUID.randomUUID().toString() + ".png";
            fileOut = new FileOutputStream(fileName);
            BufferedOutputStream bos = new BufferedOutputStream(fileOut);
            byte[] buf = new byte[4096];
            int length = bis.read(buf);
            //保存文件
            while (length != -1) {
                bos.write(buf, 0, length);
                length = bis.read(buf);
            }
            bos.close();
            bis.close();
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("抛出异常！！");
        }
        //删除本地文件
        File file1=new File(fileName);
        file1.delete();
        return fileName;

    }

    @ResponseBody
    @RequestMapping("getDetailList")
    @WebLogger("根据大类名称获取字典")
    public Response getDetailList(@RequestBody Map map) {
        String name = String.valueOf(map.get("name"));
        List<Dict> dict = dictService.getDetailList(name);
        return new Response(dict);
    }

    @ResponseBody
    @PostMapping("findOne")
    public Response findOne(long orgId) {
        SysDepartment sysDepartment = sysDepartmentService.findById(orgId);
        return new Response(sysDepartment);
    }

    @ResponseBody
    @PostMapping("merUpload")
    public Response upload(HttpServletRequest request) throws Exception {
        Response response = new Response();
        String fileName = "";
        Map param = new HashMap();
        //捕获前台传来的图片，并用uuid命名，防止重复
        Map<String, Object> allMap = uploadService.uploadFileOSS(request, "/fintecher_file");
        //当前台有文件时，给图片名称变量赋值
        if (!allMap.isEmpty()) {
            fileName = (String) allMap.get("url");
            response.setMsg("上传成功！");
            param.put("activity_img_id", fileName);
            param.put("activity_img_fileName", fileName);
            response.setData(param);
        }
        if (StringUtils.isNullOrEmpty(fileName)) {
            response.setCode(1);
            response.setMsg("上传失败");
            return response;
        }
        return response;
    }

    /**
     * 获取所有公司 做下拉选使用
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("getAllGongsiName")
    @WebLogger("获取所有公司")
    public Response getAllGongsiName(@RequestBody Map map) {
        List<Map> list = sysDepartmentService.getAllGongsi(map);
        return new Response(list);
    }
}
