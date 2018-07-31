package com.zw.rule.qywechat.service.impl;

import com.zw.rule.mapper.qywxmanage.ContentManageMapper;
import com.zw.rule.mapper.qywxmanage.ContentShareManageMapper;
import com.zw.rule.mapper.qywxmanage.ExtensionTypeMapper;
import com.zw.rule.qywechat.service.IMarketingService;
import com.zw.rule.qywxmanage.Content;
import com.zw.rule.qywxmanage.ContentShare;
import com.zw.rule.qywxmanage.ExtensionType;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 营销任务service实现类
 * Created by zh on 2018/7/31.
 */
@Service
public class MarketingServiceImpl implements IMarketingService {
    @Autowired
    private ExtensionTypeMapper extensionTypeMapper;

    @Autowired
    private ContentManageMapper contentManageMapper;

    @Autowired
    private ContentShareManageMapper contentShareManageMapper;


    @Override
    public List<ExtensionType> findExtensionType() {
        return extensionTypeMapper.findTypes();
    }

    @Override
    public List<Content> findExtensionByType(long typeId) {
        return contentManageMapper.selectByType(typeId);
    }

    @Override
    public Content findExtensionDetail(long id) {
        return contentManageMapper.selectByPrimaryKey(id);
    }

    @Override
    public Map addShareInfo(ContentShare share) {
        Map map = new HashMap();
        map.put("succ", true);
        map.put("msg", "保存成功");
        int i = contentShareManageMapper.insertSelective(share);
        if (i < 1)
        {
            map.put("succ", false);
            map.put("msg", "保存失败");
        }
        return map;
    }
}
