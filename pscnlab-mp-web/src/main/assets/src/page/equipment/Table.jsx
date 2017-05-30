import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Role extends BaseComponent {
    state = {
        table: [{
            num: 1,
        }, {
            num: 2,
        }, {
            num: 3,
        }],
    };

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该角色信息？',
            content: '注意：如果有成员绑定改角色，该角色将删除失败！',
            onOk() {
                console.log('444');
                this.request()
                    .noStoreId()
                    .get('/role/delete.json')
                    .params({id: id})
                    .success((data, res) => {
                        console.log('dddd44');
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    // 查询数据
    handleSearch(queryData = this.state.queryData) {
        this.setState({
            refundDataList: [],
            refundDataTotal: 0,
        });


        const sendData = {
        };

        this.request()
            .noStoreId()
            .get('/refunds.json')
            .params(sendData)
            .success((data, res) => {
                this.setState({
                    refundDataList: res.body.results || [],
                    refundDataTotal: res.body.totalCount || 0,
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        getAllOptions: (callBack) => {
            this.request()
                .noStoreId()
                .get('/refunds/conditions.json')
                .success((data, res) => {
                    let resultsStores = res.body.result.stores;

                    let store = resultsStores.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }));
                    store.unshift({value: '', label: '全部'});

                    let allOptions = {
                        store,
                    };
                    callBack(allOptions);
                })
                .end();
        },
        onSubmit: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData,
            });
            this.handleSearch(queryData);
        },
        onComplete: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData,
                loadFilter: false,
            });
            this.handleSearch(queryData);
        },
        items: this.renderStoreQueryTerms(),
    };

    renderStoreQueryTerms() {
        let storeQueryTerms = [
            [
                {
                    type: 'selectSearch',
                    label: '桌位号',
                    name: 'num',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 50,
                }, {
                    type: 'selectSearch',
                    label: '名字',
                    name: 'name',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 40,
            },
            ],
        ];
        return storeQueryTerms;
    }

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

    getTables = (tables = this.state.table) => {
        return tables.map((value, index) => {
            return (
                <div className="table-list">
                    <div className="table-title">一号桌</div>
                    <div className="table-body">
                        <div className="user-image">
                            <img/>
                        </div>
                        <div className="user-info">
                            <p>王丹婷</p>
                            <p>18875082742</p>
                        </div>
                    </div>
                    <div className="table-footer">
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`table/modify-table`}>
                            编辑
                        </Link>｜
                        <Button>删除</Button>
                    </div>
                </div>
            );
        });
    };

    render() {

        return (
            <Page header="auto" loading={this.state.loading}>
                <Link
                    style={{color: 'white'}}
                    activeStyle={{color: 'red'}}
                    to={`/table/add-table`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增桌位</Button>
                </Link>
                <Col>
                    <QueryTerms options={this.queryTermsOptions}/>
                </Col>
                <div className="table-list-container">
                    {this.getTables(this.state.table)}
                </div>
            </Page>
        );
    }
}
export default Role;
