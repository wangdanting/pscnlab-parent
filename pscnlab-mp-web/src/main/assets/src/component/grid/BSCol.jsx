import './style.less';
import React from 'react';

class BSCol extends React.Component {
    state = {};
    static defaultProps = {
        className: 'col-xs-12',
    };
    static propTypes = {
        className: React.PropTypes.string.isRequired,
    };

    componentWillMount() {
    }

    render() {
        let className = this.props.className;
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
export default BSCol;

