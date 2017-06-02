import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Progress, Icon} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {BaseComponent} from 'component';
const ProgressLine = Progress.Line;
import {Common} from 'common';
import './style.less';

class ProjectProgress extends BaseComponent {
    state = {
        progress: [],

    };

    componentDidMount() {
        this.initTableData();
    }

    initTableData = () => {
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/project/id/${this.props.params.id}/infos.json?memberUUId=${Common.getMerchant().uuidMember}`)
            .success((data, res) => {
                this.setState({
                    progress: data.projectPepoles,
                });
            })
            .end();
    };

    getProgress = (progress = this.state.progress) => {
        console.log(progress, 'progress');
        return progress.map((value, index) => {
            return (
                <div className="progress-width">
                    <label>{value.memberName}</label>
                    <ProgressLine className="progress-index" percent={value.progress} status="active" />
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
