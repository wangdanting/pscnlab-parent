import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Progress, Icon} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {BaseComponent} from 'component';
const ProgressLine = Progress.Line;
import './style.less';

class ProjectProgress extends BaseComponent {
    state = {
        progress: [{
            name: '张三'
        }, {
            name: '张三'
        }, {
            name: '张三'
        }],

    };

    componentDidMount() {
        this.initTableData();
    }


    initTableData = () => {
        // this.request()
        //     .noMchId()
        //     .noStoreId()
        //     .get(`/api/dish/balances.json?size=${size}&offset=${offset}&mchId=${mchId}&storeId=${storeId}&dishName=${dishName}&isOnLined=${isOnLined}`)
        //     .success((data, res) => {
        //         this.getHandledData(data);
        //         this.setState({
        //             totalCount: res.body.totalCount,
        //         });
        //     })
        //     .end();
    };

    getProgress = (progress = this.state.progress) => {
        return progress.map((value, index) => {
            return (
                <div className="progress-width">
                    <label>王丹婷:</label>
                    <ProgressLine className="progress-index" percent={50} status="active" />
                </div>
            );
        });
    };

    render() {

        const header = {
            back: { // 头部得返回按钮
                title: '返回列表页',
                // onClick: this.handleGoBack,
            },
            title: [
                {
                    text: '项目管理',
                    path: `/project`,
                }, {
                    text: '项目进度',
                },
            ],
            breadcrumbItems: 'auto',
        };

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="progress-container">
                    {this.getProgress(this.state.progress)}
                </div>
            </Page>
        );
    }
}
export default ProjectProgress;
