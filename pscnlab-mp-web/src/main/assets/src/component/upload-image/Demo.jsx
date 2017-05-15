import React from 'react';
import UploadImage from './UploadImage';
import {Common} from 'common';

class Demo extends React.Component {
    state = {
        imgSrc: '',
        imgId: '',
    };

    render() {
        const { imgSrc } = this.state;
        const uploadProps = {
            action: `/api/m/${Common.getMerchantID.byUrl()}/dish/resource.json`,
            value: imgSrc,
            success: (id, path) => this.setState({
                imgSrc: path,
                imgId: id,
            }),
            beforeUpload: () => this.setState({loading: true}),
            end: () => this.setState({loading: false}),
        };
        return (
            <div>
                <UploadImage {...uploadProps}/>
            </div>
        );
    }
}

export default Demo;

