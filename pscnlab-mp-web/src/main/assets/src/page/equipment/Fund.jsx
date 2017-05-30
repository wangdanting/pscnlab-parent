import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Fund extends BaseComponent {
    state = {
        dataSource: [{
            event: '聚餐',
            time: '2015-03-03',
            money: {
                income: 200,
                spend: 0
            }
        }, {
            event: '获奖',
            time: '2015-03-03',
            money: {
                income: 0,
                spend: 200
            }
        }],
    };

    columns = [
        {
            title: '事件',
            dataIndex: 'event',
            key: 'event',
        },
        {
            title: '事件',
            dataIndex: 'time',
            key: 'time',
        }, {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            render(text) {
                console.log(text, 'text');
                if (text.income) {
                    return <span>+ ¥ {text.income}</span>;
                }
                return <span>- ¥ {text.spend}</span>;
            }

        },
        {
            title: '操作',
            dataIndex: 'uuidFund',
            key: 'uuidFund',
            render(text) {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`fund/modify-fund/${text}`}>
                                编辑
                            </Link>｜
                            <Button onClick={() => {
                                console.log(this, 'this');
                                {/*this.showDeleteConfirm(text)*/}
                            }}>删除</Button>
                    </span>
                );
            },
        },
    ];

    // //确认删除角色对话框
    // showDeleteConfirm(id) {
    //     confirm({
    //         title: '你确定要删除该角色信息？',
    //         content: '注意：如果有成员绑定改角色，该角色将删除失败！',
    //         onOk() {
    //             console.log('444');
    //             this.request()
    //                 .noStoreId()
    //                 .get('/role/delete.json')
    //                 .params({id: id})
    //                 .success((data, res) => {
    //                     console.log('dddd44');
    //                 })
    //                 .end();
    //         },
    //         onCancel() {},
    //     })
    // };


    componentDidMount() {
        this.initTableData();
    }

    initTableData = () => {
        this.setState({
        });
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/role.json`)
            .success((data, res) => {
                console.log(data, 'data');
                this.setState({
                    dataSource: data,
                });
            })
            .end();
    };

    render() {
        let {dataSource} = this.state;

        return (
            <Page header="auto" loading={this.state.loading}>
                <Link
                    style={{color: 'white'}}
                    activeStyle={{color: 'red'}}
                    to={`/fund/add-fund`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增经费情况</Button>
                </Link>
                <Table columns={this.columns} rowKey={(record, index) => index} dataSource={dataSource} pagination={false}/>
            </Page>
        );
    }
}
export default Fund;
