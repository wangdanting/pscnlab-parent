import './style.less';
import React from 'react';
import {Icon} from 'antd';

class EmptyDataTip extends React.Component {

    render() {
        let { children, style, text} = this.props;
        text = text || '暂无数据';
        children = children || <span><Icon type="frown"/>&nbsp;{text}</span>;
        return (
            <div className="empty-data-tip" style={style}>
                {children}
            </div>
        );
    }
}
export default EmptyDataTip;
