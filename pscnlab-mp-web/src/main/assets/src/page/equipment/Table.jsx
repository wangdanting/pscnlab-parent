import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import './style.less';
import defeatHeadImg from './defeat-head.jpg';

const confirm = Modal.confirm;

class Tablew extends BaseComponent {
    state = {
        //分页
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,

        table: [{
            num: 1,
        }, {
            num: 2,
        }, {
            num: 3,
        }, {
            num: 4,
        }, {
            num: 5,
        }, {
            num: 6,
        }, {
            num: 7,
        }, {
            num: 8,
        }, {
            num: 9,
        }, {
            num: 10,
        }, {
            num: 11,
        }, {
            num: 12,
        }, {
            num: 13,
        }, {
            num: 14,
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
                    .get('/table/id/{tableId}/delete_tables.json')
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
        const {pageSize, currentPage} = this.state;
        const params = {
            pageSize,
            currentPage,
        };
        this.initTableData(params);
    }

    initTableData = (params) => {
        const size = params.pageSize;
        const offset = (params.currentPage - 1) * size;
        const tableNum = '';
        const userName = '';
        const state = '';
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/table/lists.json?tableNum=${tableNum}&userName=${userName}&state=${state}&size=${size}&offset=${offset}`)
            .success((data, res) => {
            console.log(data, '999');
                this.setState({
                    table: data,
                    totalCount: res.body.totalCount,
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
                            <img src={defeatHeadImg}/>
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
                        <a>
                            <span onClick={()=>this.showDeleteConfirm(text)}>删除</span>
                        </a>
                    </div>
                </div>
            );
        });
    };

    render() {
        let {
            pageSize,
            currentPage,
            totalCount} = this.state;

        const paginationOptions = {
            showQuickJumper: false, // 默认true
            pageSize,
            currentPage,
            totalCount,
            onChange: (current, size) => {
                const params = {
                    pageSize: size,
                    currentPage: current,
                };
                this.initTableData(params);
                this.setState({
                    currentPage: current,
                    pageSize: size,
                });
            },
        };

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
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Tablew;
