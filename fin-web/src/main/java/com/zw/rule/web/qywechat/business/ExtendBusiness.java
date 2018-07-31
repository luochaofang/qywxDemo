package com.zw.rule.web.qywechat.business;

import com.zw.rule.qywechat.service.IExtendService;
import com.zw.rule.qywechat.service.IExtensionTypeService;
import com.zw.rule.qywxmanage.ExtensionType;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;

/**
 * 推广明细业务
 * @author 陈淸玉 create on 2018-07-30
 */
public class ExtendBusiness {

    private IExtendService extendService;

    private List<ExtensionType> extensionTypes;

    public ExtendBusiness(IExtendService extendService , List<ExtensionType> extensionTypes) {
        this.extendService = extendService;
        this.extensionTypes = extensionTypes;
    }

    private List<Map<String, Object>> extendAll;

    /**
     * 获取推广明细列表
     * @return 推广明细列表
     */
    public List<Map<String,Object>> extendDetailList(){
        //获取全部推广明细信息
        extendAll = extendService.countExtendAll();
        if(CollectionUtils.isEmpty(extendAll)){
            return extendAll;
        }
        //获取推广类型
        for (ExtensionType type : extensionTypes) {
            handleData(type.getId());
        }
        return  extendAll;
    }

    /**
     * 吧明细数据组合到总数据里面
     * @param typeId 推广类型Id
     * @return 返回处理完成的数据 供前端展示
     */
    private List<Map<String, Object>> handleData(Long typeId){
        List<Map<String, Object>> extensionList = extendService.countExtendByExtensionType(typeId);
        for (Map<String, Object> extendMap : extendAll) {
            Long extendEmployeeId = (Long)extendMap.get("employeeId");
            for (Map<String, Object> extendTypeMap : extensionList) {
                Long extendTypeEmployeeId  = (Long)extendTypeMap.get("employeeId");
                if (extendEmployeeId.equals(extendTypeEmployeeId)) {
                    extendMap.put(typeId.toString(),extendTypeMap.get("extensionTypeNum"));
                    break;
                }
            }
        }
       return extendAll;
    }

}
