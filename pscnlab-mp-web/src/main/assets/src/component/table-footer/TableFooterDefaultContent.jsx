/*
 * 自定义table footer
 * */
import './style.less';
import React, {Component, propTypes} from 'react';
import classNames from 'classnames';

class TableFooterDefaultContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        const textContentKeyClassName = classNames({
            'footer-container-text-key': true,
        });
        const textContentKey = <span className={textContentKeyClassName}>{props.data.key}</span>;

        const textContentValueClassName = classNames({
            'footer-container-text-value': true,
        });
        const textContentValue = <span className={textContentValueClassName}>{props.data.value}</span>;

        const textContentClassName = classNames({
            'pull-right': true,
            'footer-container-text': true,
        });
        return (
            <span className={textContentClassName}>
                {textContentKey}
                {textContentValue}
            </span>
        );
    }
}
TableFooterDefaultContent.propTypes = {
    text: React.PropTypes.object,
};

export default TableFooterDefaultContent;
