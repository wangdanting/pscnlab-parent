import './style.less';
import React from 'react';

class OrderTable extends React.Component {
    state = {};
    static defaultProps = {};
    static propTypes = {};
    getValue = (record, index, col) => {
        let text;
        if (col.dataIndex) {
            text = record[col.dataIndex];
        }
        if (col.render) {
            return col.render(text, record, index);
        }
        return text;
    };

    render() {
        let subHeadColSpan = 0;
        const columns = this.props.columns;
        const data = this.props.dataSource;
        let head = [];
        let subHead = [];
        columns.forEach((v) => {
            if (v.subHead) {
                subHead.push(v);
            } else {
                head.push(v);
                subHeadColSpan += 1;
            }
        });
        return (
            <div>
                <div className="ant-table order-table">
                    <table>
                        <thead>
                            <tr>
                                {head.map((v) => {
                                    return <th key={v.key}>{v.title}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                        {data.map((v, i) => {
                            return [
                                <tr className="blank-row">
                                    <td colSpan={subHeadColSpan}>&nbsp;</td>
                                </tr>,
                                <tr className="sub-head">
                                    <td colSpan={subHeadColSpan}>
                                        {subHead.map((vv, ii, aa) => {
                                            return (
                                                <div key={`${i}-${ii}`} style={{width: `${100 / aa.length}%`}}>{vv.title}：{this.getValue(v, i, vv)}</div>
                                            );
                                        })}
                                    </td>
                                </tr>,
                                <tr>
                                    {head.map((vv, ii) => {
                                        return (
                                            <td key={`${i}-${ii}`}>
                                                <div>
                                                    {this.getValue(v, i, vv)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>,
                            ];
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="ant-table-placeholder" style={{position: 'static', display: ((data && data.length) ? 'none' : 'block')}}>
                    <i className=" anticon anticon-frown"/>
                    暂无数据
                </div>
            </div>
        );
    }
}
export default OrderTable;
