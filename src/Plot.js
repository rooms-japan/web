// Plot.js
import React from 'react';
import { XAxis, YAxis, CartesianGrid, ScatterChart, Scatter } from 'recharts';

class Plot extends React.Component {

    shouldComponentUpdate(nextProps) {
        const dataChanged = this.props.data !== nextProps.data;
        const scaleChanged = this.props.scale !== nextProps.scale;
        return dataChanged || scaleChanged;
    }

    render() {
        return (
        <ScatterChart width={800} height={600} >
         <Scatter data={this.props.data} stroke="#8884d8" />
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
