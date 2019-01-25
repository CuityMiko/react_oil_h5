import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default () => 
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <ActivityIndicator
        toast
        text="加载中..."
    />
</div>