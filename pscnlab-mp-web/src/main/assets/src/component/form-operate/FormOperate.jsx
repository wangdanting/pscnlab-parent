import React, { Component } from 'react';
import { Form, Row, Col, Input, InputNumber, DatePicker, TimePicker, Cascader } from 'antd';
const FormItem = Form.Item;
import { CheckBoxItem, RadioItem, SelectItem, ComboboxItem, DateTimeAreaItem } from '../form-item/index';
import EventProxy from 'eventproxy';
const ep = new EventProxy();
import './style.less';

let eventNames = [];

class FormOperate extends Component {
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

    state = {
        allOptions: {},
    };

    componentWillMount() {
        const { options } = this.props;
        const getAllOptions = options.getAllOptions;
        const items = options.items;
        const onComplete = options.onComplete;

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
                item.forEach((childItem) => {
                    if (childItem.url) {
                        eventNames.push(childItem.name);
                    }
                });
            } else if (item.url) {
                eventNames.push(item.name);
            }
        });

        if (eventNames.length) {
            ep.all(eventNames, () => {
                if (onComplete) {
                    onComplete(this.getFormValue());
                }
            });
        }
    }

    componentDidMount() {
        if (!eventNames.length) {
            const onComplete = this.props.options.onComplete;
            if (onComplete) {
                onComplete(this.getFormValue());
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        let onWillReceiveProps = this.props.options.onWillReceiveProps;
        if (onWillReceiveProps) {
            console.log(this, 123);
            const formData = this.getFormValue();
            onWillReceiveProps(this, nextProps, this.state.allOptions, formData);
        }
    }

    getFormValue = () => {
        let formData = this.props.form.getFieldsValue();

        Object.keys(formData).forEach((key) => {
            let data = formData[key];
            let dateToString = this.props.options.resultDateToString;
            if (dateToString) {
                let format = this.getFormatByName(key);
                formData[key] = this.dateToString(data, format);
            }

            // undefined转空字符串
            if (data === void 0 || data === 'undefined') {
                formData[key] = '';
            }
        });

        return formData;
    };

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

    handleChange = (e) => {
        if (e) {
            e.preventDefault();
        }

        setTimeout(() => {
            this.props.form.validateFields((errors, values) => {
                console.log(errors, values, 'form data');
                if (!!errors) {
                    if (values) {
                        this.props.options.onSubmit(values, false);
                    }
                } else {
                    if (values) {
                        this.props.options.onSubmit(values, true);
                    }
                }
            });
        }, 500);
    };

    getItem = (options, itemOptions) => {
        const { getFieldProps } = this.props.form;
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
        itemOptions = Object.assign({}, defaultItemOptions, itemOptions);
        if (this.state.allOptions[name]) {
            itemOptions.options = this.state.allOptions[name];
        }
        const className = itemOptions.className;
        const resultDateToString = options.resultDateToString;
        const onSubmitChange = itemOptions.onSubmitChange;
        const label = itemOptions.label;
        const isRequired = itemOptions.isRequired;
        const rules = itemOptions.rules;
        const tips = itemOptions.tips;
        const startName = itemOptions.startName;
        const startRules = itemOptions.startRules;
        const endRules = itemOptions.endRules;
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
            let allOptions = Object.assign({}, this.state.allOptions);
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
                    options.onChange(this.getFormValue());
                });
            }
            if (onSubmitChange) {
                if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.handleChange();
                    }, 300);
                } else {
                    this.handleChange();
                }
            }
        };
        const labelProps = {
            className: 'query-terms-label',
            style: {
                width: labelWidth,
                display: 'inline-block',
                float: 'left',
                lineHeight: '32px',
                textAlign: 'right',
            },
        };
        let itemProps = {
            className: 'query-terms-item',
            style: {
                width: fieldWidth,
                display: 'inline-block',
                float: 'left',
            },
        };

        let eleProps = {
            placeholder,
            style: {
                width: '100%',
                float: 'left',
            },
        };

        const tipProps = {
            style: {
                display: 'inline-block',
                marginLeft: tips ? 12 : 0,
                lineHeight: '32px',
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
                this.handleChange();
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
            let fp = Object.assign({}, getValueFn());
            fieldPropsOptions = getFieldProps(name, Object.assign({}, fp, itemOptions, rules));
            fieldPropsOptions = Object.assign({}, itemOptions, fieldPropsOptions, eleProps);
            fieldPropsOptions.onKeyDown = onKeyDownFn;
        } else {
            if (startName) {
                let fp = Object.assign({
                    initialValue: itemOptions.startInitialValue,
                }, getValueFn());
                startFieldPropsOptions = getFieldProps(startName, Object.assign({}, fp, itemOptions, startRules));
                startFieldPropsOptions = Object.assign({}, itemOptions, startFieldPropsOptions, eleProps);
                startFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
            if (endName) {
                let fp = Object.assign({
                    initialValue: itemOptions.endInitialValue,
                }, getValueFn());
                endFieldPropsOptions = getFieldProps(endName, Object.assign({}, fp, itemOptions), endRules);
                endFieldPropsOptions = Object.assign({}, itemOptions, endFieldPropsOptions, eleProps);
                endFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
        }
        const labelJsx = label ? (
            <label {...labelProps} className={isRequired ? 'ant-form-item-required' : ''}>
                <span>{label}：</span>
            </label>
        ) : '';
        if (itemType === 'input') {
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Input {...fieldPropsOptions} />
                    </FormItem>
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
                </Col>
            );
        }
        if (isSelect) {
            if (itemType === 'selectSearch') {
                fieldPropsOptions = Object.assign({}, {showSearch: true}, fieldPropsOptions);
            }
            if (itemType === 'selectMultiple') {
                fieldPropsOptions = Object.assign({}, {multiple: true}, fieldPropsOptions);
            }
            return (
                <Col className={className}>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <SelectItem {...fieldPropsOptions} />
                    </FormItem>
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
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
                    <span {...tipProps}>{tips}</span>
                </Col>
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
                    <span {...tipProps}>{tips}</span>
                </Col>
            );
        }
        throw Error(`查询条件没有此类型type:${itemType}`);
    }

    render() {
        const { options } = this.props;

        const items = options.items.map((value, index) => {
            if (value.hidden) return '';

            const rowProps = {
                type: 'flex',
                justify: 'start',
                align: 'top',
            };

            if (value instanceof Array) { // 一行多个查询条件
                return (
                    <Row key={`array${index}`} {...rowProps}>
                        {value.map((v) => {
                            if (v.hidden) return '';
                            return this.getItem(options, v);
                        })}
                    </Row>
                );
            }
            // 一行一个查询条件
            return (
                <Row key={index} {...rowProps}>
                    {this.getItem(options, value)}
                </Row>
            );
        });

        return (
            <Form horizontal className="form-operate" form={this.props.form}>
                {items}
            </Form>
        );
    }
}

export default Form.create()(FormOperate);
