import './style.less';
import React from 'react';
import assign from 'object-assign';
import Request from 'superagent';
import {Spin, Select} from 'antd';
const Option = Select.Option;
class SelectItem extends React.Component {
    state = {
        options: this.props.options,
    };
    static defaultProps = {
        size: 'large',
        options: [],
        optionsFilter(res) {
            return res.body.results;
        },
        onError() {
        },

    };
    static propTypes = {
        options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    };
    loadingValue = 'select-item-loading-value';

    componentDidMount() {
        const url = this.props.url;
        let options = this.props.options;
        if (url) {
            options.push({
                value: this.loadingValue,
                label: <div className="spin-wrap"><Spin /></div>,
            });
            const optionsFilter = this.props.optionsFilter;
            const onError = this.props.onError;
            Request
                .get(url)
                .end((err, res) => {
                    options = options.filter((v) => {
                        return v.value !== this.loadingValue;
                    });
                    if (err) {
                        options.push({
                            value: this.loadingValue,
                            label: <div className="spin-wrap error">获取数据失败</div>,
                        });
                        onError(err, res);
                    } else {
                        const newOptions = optionsFilter(res);
                        options = options.concat(newOptions);
                    }
                    //options = options.map((v) => {
                    //    return {value: v.value.toString(), label: v.label};
                    //});
                    this.setState({
                        options,
                    });
                    if (this.props.onComplete) {
                        this.props.onComplete(options);
                    }
                });
        }
    }

    render() {
        let options = this.props.url ? this.state.options : this.props.options;
        let props = this.props;
        if (this.props.showSearch) {
            props = assign({}, {
                optionFilterProp: 'children',
                notFoundContent: '无法找到',
                searchPlaceholder: '输入关键词',
            }, this.props);
        } else {
            props = assign({}, this.props);
        }
        delete props.label;
        return (
            <Select {...props}>
                {options.map((v, i) => {
                    if (v.value === this.loadingValue) {
                        return <span key={i.toString(36) + i}>{v.label}</span>;
                    }
                    return <Option key={i.toString(36) + i} value={v.value}>{v.label}</Option>;
                })}
            </Select>
        );
    }
}
export default SelectItem;
