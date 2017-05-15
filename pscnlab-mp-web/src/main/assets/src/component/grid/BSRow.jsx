import './style.less';
import React from 'react';

class BSRow extends React.Component {
    state = {};
    static defaultProps = {};
    static propTypes = {};

    componentWillMount() {
    }

    render() {
        let className = 'row';
        if (this.props.className) {
            className = `${className} ${this.props.className}`;
        }
        return (
            <div {...this.props} className={className}>
                {this.props.children}
            </div>
        );
    }
}
export default BSRow;

