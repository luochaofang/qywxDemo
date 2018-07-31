package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentManageMapper;
import com.zw.rule.mapper.qywxmanage.ExtensionTypeMapper;
import com.zw.rule.mybatis.ParamFilter;
import com.zw.rule.qywechat.service.IExtendContentService;
import com.zw.rule.qywxmanage.Content;
import com.zw.rule.qywxmanage.ExtensionType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.*;

/**
 * 推广内容服务
 * @author luochaofang create on 2018-07-30
 */
@Service(IExtendContentService.BEAN_KEY)
public class ExtendContentServiceImpl implements IExtendContentService {
    @Resource
    private ContentManageMapper contentManageMapper;

    @Resource
    private ExtensionTypeMapper extensionTypeMapper;

    @Override
    public List<Content> findExtendContentList(ParamFilter param) {
        return contentManageMapper.findExtendContentList(param);
    }

    @Override
    public int addExtendContent(Content content) {
        content.setAddtime(new Date());
        return contentManageMapper.insertSelective(content);
    }

    @Override
    public int updateExtendContent(Content content) {
        return contentManageMapper.updateByPrimaryKeySelective(content);
    }

    @Override
    public void deleteExtentContent(Long id) {
        this.deleteExtentContent(id);
    }

    @Override
    public Content getExtentContent(Long id) {
        return contentManageMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Map<String, Object>> findExtentType() {
        List<ExtensionType> extensionTypesList = extensionTypeMapper.findTypes();
        if(null != extensionTypesList) {
            List<Map<String, Object>> listMap = new ArrayList<>();
            for (ExtensionType extensionType : extensionTypesList){
                if(BigInteger.ZERO.intValue() != extensionType.getStatus()) {
                    Map<String, Object> map = new HashMap<>(2);
                    map.put("id", extensionType.getId());
                    map.put("name", extensionType.getName());
                    listMap.add(map);
                }
            }
            return listMap;
        }
        return null;
    }
}
