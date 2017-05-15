import React, { Component } from 'react';
import { Icon, Upload, message } from 'antd';

const Dragger = Upload.Dragger;

class UploadImage extends Component {

    propTypes = {
        beforeUpload: React.PropTypes.func,
        success: React.PropTypes.func.isRequired,
        error: React.PropTypes.func,
        end: React.PropTypes.func,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        action: React.PropTypes.string.isRequired,
        IconType: React.PropTypes.string,
        value: React.PropTypes.isRequired,
    };

    onChange = (info) => {
        const { success, error, end } = this.props;
        if (info.file.status === 'done') {
            success(info.file.response.result.id, info.file.response.result.path);
            if (end) end();
        }
        if (info.file.status === 'error') {
            if (error) {
                error(info.file.response.message);
            } else {
                message.error(info.file.response.message, 3);
            }
            if (end) end();
        }
    };


    render() {
        let { width, height, action, IconType, value, beforeUpload } = this.props;
        beforeUpload = beforeUpload || function () {};
        const DraggerProps = {
            name: 'file',
            accept: 'image/*',
            listType: 'picture',
            value,
            showUploadList: false,
            action,
            onChange: this.onChange,
            beforeUpload,
        };
        width = width || 202;
        height = height || 180;
        IconType = IconType || 'plus';
        const imageWidth = width - 2;
        const imageHeight = height - 2;
        return (<div style={{ width, height}}>
            <Dragger
                {...DraggerProps}>
                {value ?
                    <img
                        role="presentation"
                        style={{width: imageWidth, height: imageHeight}}
                        src={value}/> :
                    <Icon type={IconType} style={{position: 'static'}}/>}
            </Dragger>
        </div>);
    }
}

export default UploadImage;
