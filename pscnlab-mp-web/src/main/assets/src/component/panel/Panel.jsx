import './style.less';
import React, { Component } from 'react';
import { Row, Col } from 'antd';

export default class Panel extends Component {
    static defaultProps = {
        header: [
            {
                title: '默认标题',
                subTitle: '默认副标题',
            },
        ],
        width: '100%',
    };

    render() {
        let headers = [];
        if (!(this.props.header instanceof Array)) {
            if (typeof this.props.header === 'string') {
                headers.push({
                    title: this.props.header,
                });
            } else {
                headers.push(this.props.header);
            }
        } else {
            headers = this.props.header;
        }

        let span = Math.floor(12 / headers.length);
        const headerJsx = headers.map((header, index) => {
            return (
                <div key={index.toString(36) + index}>
                    <Col key={`${index}-title`} span={String(span)} className="title">{header.title}</Col>
                    <Col key={`${index}-sub-title`} span={String(span)} className="sub-title">{header.subTitle || ' '}</Col>
                </div>
            );
        });

        let style = Object.assign({}, {width: this.props.width}, this.props.style);

        return (
            <div className={`panel-wrap ${(this.props.className || '')}`} style={style}>
                <div className="header">
                    <Row>
                        {headerJsx}
                    </Row>
                </div>
                {this.props.children}
            </div>
        );
    }
}
