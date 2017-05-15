import React, {Component} from 'react';
import Lodash from 'lodash';
import G2 from 'g2';

export default class Chart extends Component {
    defaultProps = {
        data: [],
        chartQuery: {},
    }
    static propTypes = {
        data: React.PropTypes.array,
        chartQuery: React.PropTypes.object,
    }
    componentDidMount() {
        const data = this.props.data;

        if (data && data.length) {
            this.initChart(data);
        } else {
            this.container.innerHTML = '<div class="marginbottom15 margintop15 text-center">暂无数据</div>';
        }
    }

    shouldComponentUpdate(nextProps) {
        return !Lodash.isEqual(this.props.data, nextProps.data);
    }

    componentDidUpdate() {
        const data = this.props.data;

        if (data && data.length) {
            this.container.innerHTML = '';
            this.initChart(data);
        } else {
            return (
                this.container.innerHTML = '<div class="marginbottom15 margintop15 text-center">暂无数据</div>'
            );
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    initChart(data) {
        const container = this.container;
        const Stat = G2.Stat;
        this.chart = new G2.Chart({
            container,
            forceFit: true,
            height: this.props.chartQuery.height,
            plotCfg: {
                margin: [20, 60, 100, 60],
            },
        });
        this.chart.legend('bottom');
        this.chart.source(data, {
            '..percent': {max: 1, min: 0},
        });
        const Frame = G2.Frame;
        const frame = new Frame(data);
        if (Frame.max(frame, this.props.chartQuery.value) === 0){
            this.container.innerHTML = '<div class="marginbottom15 margintop15 text-center">暂无数据</div>';
        }
        this.chart.coord('polar').transpose();
        this.chart.intervalStack().position(Stat.summary.percent(this.props.chartQuery.position)).color(this.props.chartQuery.colorKey, this.props.chartQuery.color);
        this.chart.render();
    }
    render() {
        return (
            <div style={{height: this.props.chartQuery.height}} ref={(view) => this.container = view}></div>
        );
    }
}
