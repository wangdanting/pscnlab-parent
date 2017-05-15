import './style.less';
import React from 'react';
import assign from 'object-assign';
import EventProxy from 'eventproxy';
import moment from 'moment';
import {CheckBoxItem, RadioItem, SelectItem, ComboboxItem, DateTimeAreaItem} from '../form-item/index';
import {Button, DatePicker, TimePicker, InputNumber, Input, Form, Cascader, Row, Col, Tabs} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const ep = new EventProxy();

class QueryTerms extends React.Component {
    state = {
        allOptions: {},
    };
    format = {
        date: 'yyyy-MM-dd',
        dateArea: 'yyyy-MM-dd',
        time: 'HH:mm',
        timeArea: 'HH:mm',
        dateTime: 'yyyy-MM-dd HH:mm',
        dateTimeArea: 'yyyy-MM-dd HH:mm',
        month: 'yyyy-MM',
        monthArea: 'yyyy-MM',
    };
    eventNames = [];

    componentWillMount() {
        let eventNames = this.eventNames;
        const getAllOptions = this.props.options.getAllOptions;
        const items = this.props.options.items;
        const onComplete = this.props.options.onComplete;
        if (getAllOptions) {
            const allOptionsEvenName = Symbol();
            eventNames.push(allOptionsEvenName);
            getAllOptions((allOptions) => {
                this.setState({
                    allOptions,
                });
                ep.emit(allOptionsEvenName, allOptions);
            });
        }
        // 提取所有的异步（根据是否有url判断）
        items.forEach((item) => {
            if (item instanceof Array) {
                item.forEach((i) => {
                    if (i.url) {
                        eventNames.push(i.name);
                    }
                });
            } else if (item.url) {
                eventNames.push(item.name);
            }
        });

        if (eventNames.length) {
            ep.all(eventNames, () => {
                if (onComplete) {
                    onComplete(this.getValues());
                }
            });
        }
    }

    componentDidMount() {
        if (!this.eventNames.length) {
            const onComplete = this.props.options.onComplete;
            if (onComplete) {
                onComplete(this.getValues());
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        let onWillReceiveProps = this.props.options.onWillReceiveProps;
        if (onWillReceiveProps) {
            const formData = this.getValues();
            onWillReceiveProps(this, nextProps, this.state.allOptions, formData);
        }
    }

    getValues() {
        let formData = this.props.form.getFieldsValue();
        for (let key of Object.keys(formData)) {
            let data = formData[key];
            // 日期转是否字符串
            let dateToString = this.props.options.resultDateToString;
            dateToString = dateToString === undefined ? true : dateToString;
            if (dateToString) {
                let format = this.getFormatByName(key);
                formData[key] = this.dateToString(data, format);
            }
            // undefined转空字符串
            if (data === void 0 || data === 'undefined') {
                formData[key] = '';
            }
        }
        return formData;
    }

    getFormatByName = (name) => {
        let options = this.props.options;
        let result = '';
        options.items.forEach((value) => {
            if (value instanceof Array) {
                value.forEach((v) => {
                    if (v.name === name || v.startName === name || v.endName === name) {
                        result = v.format || this.format[v.type];
                    }
                });
            } else {
                if (value.name === name || value.startName === name || value.endName === name) {
                    result = value.format || this.format[value.type];
                }
            }
        });
        return result;
    }

    dateToString = (date, format) => {
        if (date instanceof Date) {
            format = format.replace('yyyy', 'YYYY');
            format = format.replace('dd', 'DD');
            return moment(date).format(format);
        }
        return date;
    };

    static defaultProps = {};
    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        setTimeout(() => {
            const formData = this.getValues();
            if (formData) {
                this.props.options.onSubmit(formData);
            }
        });
    };

    getItem = (options, itemOptions) => {
        const {getFieldProps} = this.props.form;
        const name = itemOptions.name;
        const itemType = itemOptions.type;
        const isRadioOrCheckBox = ['radio', 'radioButton', 'checkboxButton', 'checkbox'].indexOf(itemType) > -1;
        if (isRadioOrCheckBox && !itemOptions.fieldWidth) {
            itemOptions.fieldWidth = 'auto';
        }
        const defaultItemOptions = {
            fieldWidth: options.fieldWidth || 150,
            labelWidth: options.labelWidth || 'auto',
            labelFontSize: options.labelFontSize || 12,
            size: 'large',
            format: this.format[itemType],
        };
        itemOptions = assign({}, defaultItemOptions, itemOptions);
        if (this.state.allOptions[name]) {
            itemOptions.options = this.state.allOptions[name];
        }
        const className = itemOptions.className;
        const resultDateToString = options.resultDateToString;
        const searchOnChange = itemOptions.searchOnChange;
        const label = itemOptions.label;
        const startName = itemOptions.startName;
        const endName = itemOptions.endName;
        const fieldWidth = itemOptions.fieldWidth;
        const labelUnifiedFontCount = itemOptions.labelUnifiedFontCount;
        const labelFontSize = itemOptions.labelFontSize;
        const initialFirst = itemOptions.initialFirst;
        const onComplete = itemOptions.onComplete;
        let onChange = itemOptions.onChange;
        let onKeyDown = itemOptions.onKeyDown;
        let labelWidth = itemOptions.labelWidth;
        let placeholder = itemOptions.placeholder;
        const hasOptions = itemOptions.options && itemOptions.options.length;
        const isSelect = ['select', 'selectSearch', 'selectMultiple'].indexOf(itemType) > -1;
        // 从options根据selected checked属性，获取默认值
        if ((isSelect || isRadioOrCheckBox) && hasOptions) {
            if (['selectMultiple', 'checkbox', 'checkboxButton'].indexOf(itemType) > -1) {
                let initialValues = [];
                itemOptions.options.forEach((opt) => {
                    if (opt.selected || opt.checked) {
                        initialValues.push(opt.value);
                    }
                });
                if (initialValues && initialValues.length) {
                    itemOptions.initialValue = initialValues;
                }
            } else {
                for (let opt of itemOptions.options) {
                    if (opt.selected || opt.checked) {
                        itemOptions.initialValue = opt.value;
                        break;
                    }
                }
            }
        }
        // 处理异步数据，默认第一个
        if (initialFirst && hasOptions) {
            const firstOption = itemOptions.options[0];
            if (typeof firstOption === 'string') {
                itemOptions.initialValue = itemOptions.options[0];
            } else {
                itemOptions.initialValue = itemOptions.options[0].value;
            }
        }
        // 统一处理默认值
        if (itemOptions.initialValue
            && !(itemOptions.initialValue instanceof Array)
            && ['selectMultiple', 'checkbox', 'checkboxButton'].indexOf(itemType) > -1) {
            itemOptions.initialValue = [itemOptions.initialValue];
        }
        // 处理异步数据完成之后回调
        itemOptions.onComplete = (data) => {
            let allOptions = assign({}, this.state.allOptions);
            allOptions[name] = data;
            this.setState({
                allOptions,
            });
            ep.emit(name, data);
            if (onComplete) {
                onComplete(data);
            }
        };

        // 处理label宽度，优先级 px > labelUnifiedFontCount > auto
        if (labelWidth === 'auto' && labelUnifiedFontCount) {
            labelWidth = `${(labelUnifiedFontCount + 1) * labelFontSize}px`;
        }

        if (placeholder === undefined) {
            if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                placeholder = `请输入${label}`;
            } else {
                placeholder = `请选择${label}`;
            }
        }
        //  处理事件
        itemOptions.onChange = (e) => {
            // getFieldValue 获取的值是上一个值，这里通过e获取。
            const value = e && e.target ? e.target.value : e;
            if (onChange) {
                onChange(value, e, this);
            }
            if (options.onChange) {
                setTimeout(() => { // 不这么做，获取name的value是上一个值
                    options.onChange(this.getValues());
                });
            }
            if (searchOnChange) {
                if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.handleSubmit();
                    }, 300);
                } else {
                    this.handleSubmit();
                }
            }
        };
        const labelProps = {
            className: 'query-terms-label',
            style: {
                width: labelWidth,
            },
        };
        let itemProps = {
            className: 'query-terms-item',
            style: {
                width: fieldWidth,
            },
        };

        let eleProps = {
            placeholder,
            style: {
                width: '100%',
            },
        };

        let fieldPropsOptions;
        let startFieldPropsOptions;
        let endFieldPropsOptions;
        const onKeyDownFn = (e) => {
            if (onKeyDown) {
                onKeyDown(e);
            }
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        };
        const getValueFn = () => {
            if (['date', 'time', 'dateTime', 'month', 'monthArea', 'dateArea', 'timeArea', 'dateTimeArea'].indexOf(itemType) > -1) {
                return {
                    getValueFromEvent(date, dateString) {
                        if (resultDateToString) {
                            return dateString || date;
                        }
                        return date;
                    },
                };
            }
            return {};
        };
        if (name) {
            let fp = assign({}, getValueFn());
            fieldPropsOptions = getFieldProps(name, assign({}, fp, itemOptions));
            fieldPropsOptions = assign({}, itemOptions, fieldPropsOptions, eleProps);
            fieldPropsOptions.onKeyDown = onKeyDownFn;
        } else {
            if (startName) {
                let fp = assign({
                    initialValue: itemOptions.startInitialValue,
                }, getValueFn());
                startFieldPropsOptions = getFieldProps(startName, assign({}, fp, itemOptions));
                startFieldPropsOptions = assign({}, itemOptions, startFieldPropsOptions, eleProps);
                startFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
            if (endName) {
                let fp = assign({
                    initialValue: itemOptions.endInitialValue,
                }, getValueFn());
                endFieldPropsOptions = getFieldProps(endName, assign({}, fp, itemOptions));
                endFieldPropsOptions = assign({}, itemOptions, endFieldPropsOptions, eleProps);
                endFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
        }
        const labelJsx = label ? (
            <div {...labelProps}>
                {label}：
            </div>
        ) : '';
        if (itemType === 'input') {
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Input {...fieldPropsOptions}/>
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'inputNumber') {
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <InputNumber {...fieldPropsOptions}/>
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'combobox') {
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <ComboboxItem {...fieldPropsOptions} />
                    </FormItem>
                </Col>
            );
        }
        if (isSelect) {
            if (itemType === 'selectSearch') {
                fieldPropsOptions = assign({}, {showSearch: true}, fieldPropsOptions);
            }
            if (itemType === 'selectMultiple') {
                fieldPropsOptions = assign({}, {multiple: true}, fieldPropsOptions);
            }
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <SelectItem {...fieldPropsOptions} />
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'cascader') {
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Cascader
                            {...fieldPropsOptions}
                        />
                    </FormItem>
                </Col>
            );
        }
        if (isRadioOrCheckBox) {
            itemProps.style.marginBottom = '0px';
            const type = ['radioButton', 'checkboxButton'].indexOf(itemType) > -1 ? 'button' : 'radio';
            const expandable = itemOptions.expandable;
            const Element = ['checkbox', 'checkboxButton'].indexOf(itemType) > -1 ? CheckBoxItem : RadioItem;
            if (type === 'button') {
                fieldPropsOptions.button = true;
            }
            if (expandable) {
                fieldPropsOptions.expandable = true;
            }
            let marginLeft = '0px';
            if (labelWidth !== 'auto') {
                marginLeft = labelWidth;
            } else if (label) {
                marginLeft = `${(label.length + 1) * labelFontSize}px`;
            }
            return (

                <Col className={className}>
                    <FormItem {...itemProps} >
                        <div className="text-label" ref="label">
                            {labelJsx}
                        </div>
                        <div style={{marginLeft}}>
                            <Element
                                {...fieldPropsOptions}
                            />
                        </div>
                    </FormItem>
                </Col>
            );
        }
        if (['date', 'dateTime', 'time', 'month'].indexOf(itemType) > -1) {
            let Element = DatePicker;
            if (itemType === 'month') {
                Element = DatePicker.MonthPicker;
            }
            if (itemType === 'time') {
                Element = TimePicker;
            }
            if (itemType === 'dateTime') {
                fieldPropsOptions.showTime = true;
            }
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Element
                            {...fieldPropsOptions}
                        />
                    </FormItem>
                </Col>
            );
        }
        if (['dateArea', 'monthArea', 'timeArea', 'dateTimeArea'].indexOf(itemType) > -1) {
            let typeProps = {
                [itemType]: true,
            };
            if (options.resultDateToString) {
                eleProps.resultDateToString = true;
            }
            let width = window.parseInt(itemProps.style.width);
            itemProps.style.width = width * 2 + 10; // 10为中间的分隔符宽度
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <DateTimeAreaItem
                            {...typeProps}
                            width={fieldWidth}
                            startFieldProps={startFieldPropsOptions}
                            endFieldProps={endFieldPropsOptions}
                            {...eleProps}
                        />
                    </FormItem>
                </Col>
            );
        }
        if (['tabsCard', 'tabs'].indexOf(itemType) > -1) {
            if (itemType === 'tabsCard') {
                fieldPropsOptions.type = 'card';
            }
            return (
                <Tabs
                    className={className}
                    {...fieldPropsOptions}
                    defaultActiveKey={itemOptions.initialValue}
                >
                    {itemOptions.options.map((v) => {
                        return (
                            <TabPane tab={v.label} key={v.value}/>
                        );
                    })}
                </Tabs>
            );
        }
        if (itemType === 'customer') {
            let Component = itemOptions.component;
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Component
                            {...fieldPropsOptions}
                        />
                    </FormItem>

                </Col>
            );
        }
        throw Error(`查询条件没有此类型type:${itemType}`);
    }

    render() {
        let options = this.props.options;
        const defaultOptions = {
            searchBtnText: '查询',
            resultDateToString: true,
        };
        options = assign({}, defaultOptions, options);
        const searchBtnText = options.searchBtnText;
        const extraAfterSearchButton = options.extraAfterSearchButton;
        const items = options.items.map((value, index, array) => {
            if (value.hidden) return '';
            const rowProps = {
                type: 'flex',
                justify: 'start',
                align: 'top',
            };
            let buttons = [];
            if (index === array.length - 1) {
                if (options.showSearchBtn) {
                    buttons.push(
                        <Col key="search-btn">
                            <FormItem className="query-terms-item" style={{marginTop: '-1px'}}>
                                <Button type="primary" onClick={this.handleSubmit}>{searchBtnText}</Button>
                            </FormItem>
                        </Col>
                    );
                }
                if (extraAfterSearchButton) {
                    buttons.push(
                        <Col key="extra-btn">
                            <FormItem className="query-terms-item" style={{marginTop: '-1px'}}>
                                {extraAfterSearchButton}
                            </FormItem>
                        </Col>
                    );
                }
            }
            if (value instanceof Array) {
                // 一行多个查询条件
                return (
                    <Row key={index} {...rowProps}>
                        {value.map((v, i, a) => {
                            if (v.hidden) return '';
                            return [
                                this.getItem(options, v),
                                i === a.length - 1 ? buttons : undefined,
                            ];
                        })}
                    </Row>
                );
            }
            // 一行一个查询条件
            return (
                <Row key={index} {...rowProps}>
                    {this.getItem(options, value)}
                    {buttons}
                </Row>
            );
        });
        return (
            <div className="query-terms">
                <Form horizontal form={this.props.form}>
                    {items}
                </Form>
            </div>
        );
    }
}
export default createForm()(QueryTerms);
