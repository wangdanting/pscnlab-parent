import './style.less';
import React, {Component, propTypes} from 'react';
import classNames from 'classnames';

class TableFooter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const visible = this.props.visible || false;

        if (props.children) { // 如果传入的是ReactDom
            const footerClassName = classNames({
                'footer-hidden': !visible,
                'footer-container': true,
                'pull-right': true,
            });

            return (
                <div className={footerClassName}>
                    {props.children}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
TableFooter.propTypes = {
    visible: React.PropTypes.bool,
    text: React.PropTypes.object,
};

export default TableFooter;
