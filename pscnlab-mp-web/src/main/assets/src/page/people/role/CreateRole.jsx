import React, { Component } from 'react';
import { Tabs, Table, Col, Button } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class CreateRole extends BaseComponent {
    state = {

    };


    componentWillMount() {

    }

    render() {

        const header = {
            back: { // 头部得返回按钮
                title: '返回列表页',
                // onClick: this.handleGoBack,
            },
            title: [
                {
                    text: '角色信息',
                    path: `/role`,
                }, {
                    text: '新增角色',
                },
            ],
            breadcrumbItems: 'auto',
        };

        return (
            <Page header={header} loading={this.state.loading}>

            </Page>
        );
    }
}
export default CreateRole;
