// Plot.js
import React from 'react';
import { XAxis, YAxis, CartesianGrid, ScatterChart, Scatter } from 'recharts';

class Plot extends React.Component {
    constructor() {
        super();
        this.state = {
            colors: ['#bada55', '#ff0000']
        }
    }

    shouldComponentUpdate(nextProps) {
        const dataChanged = this.props.data !== nextProps.data;
        const scaleChanged = this.props.scale !== nextProps.scale;
        //const wardsChanged = this.props.wards !== nextProps.wards;
        return dataChanged || scaleChanged;
    }

    genScatters() {
        let scatters = [];

        for(let i = 0; i < this.props.wards.length; i++) {
            scatters.push(
             <Scatter data={this.props.data.filter((w) => w.ward === this.props.wards[i])} stroke="#bada55" fill={this.state.colors[i] || "#000000"} />
            );
        }
        return scatters || null;
    }

    render() {
        return (
        <ScatterChart width={800} height={600} >
          {this.genScatters()}
          <CartesianGrid stroke="#ccc" />
          <XAxis
            label={this.props.xlabel}
            domain={['auto', 'auto']}
            scale="linear"
            dataKey="x"
            type="number"
          />
          <YAxis
            label={this.props.ylabel}
            dataKey="y"
            scale='linear'
            domain={['dataMin', 'dataMax']}
          />
        </ScatterChart>
        
        );
    }

}

export default Plot;
