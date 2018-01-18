// Plot.js
import React from 'react';
import { XAxis, YAxis, CartesianGrid, LineChart, Tooltip, Line, ScatterChart, Scatter, Legend } from 'recharts';

class Plot extends React.Component {
    constructor() {
        super();
        this.state = {
            // Color palette from Tableau Medium
            colors: ["rgb(114,158,206)", "rgb(255,158,74)", "rgb(103,191,92)", "rgb(237,102,93)", "rgb(173,139,201)", "rgb(168,120,110)", "rgb(237,151,202)", "rgb(162,162,162)", "rgb(205,204,93)", "rgb(109,204,218)"],
            opacity: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const dataChanged = this.props.data !== nextProps.data;
        const scaleChanged = this.props.scale !== nextProps.scale;
        const opacityChanged = JSON.stringify(this.state.opacity) !== JSON.stringify(nextState.opacity);
        console.log(opacityChanged);
        console.log(this.state.opacity);
        console.log(nextState.opacity);
        return (
            dataChanged 
            || scaleChanged
            || opacityChanged
        );
    }

    genScatters() {
        let scatters = [];

        for(let i = 0; i < this.props.wards.length; i++) {
            scatters.push(
             <Scatter
                key={i}
                dataKey={this.props.wards[i]}
                data={
                    this.props.data.filter(
                        (w) => w.ward === this.props.wards[i])
                }
                stroke={this.state.colors[i] || "#000000"}       
                fill={this.state.colors[i] || "#000000"} 
                opacity={this.state.opacity[this.props.wards[i]]||0.5}
                />
            );
        }
        return scatters || null;
    }

    genDistX() {
        let data = [{"x":1, "y":1},{"x":3, "y":9},{"x":5, "y":25}, {"x":7, "y":49}]
        return (
            <LineChart width={400} height={400} data={data} syncId="anyId"
                      margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                      <XAxis dataKey="x"/>
                      <YAxis dataKey="y"/>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <Tooltip/>
                      <Line type='monotone' dataKey='y' stroke='#82ca9d' fill='#82ca9d' />
                    </LineChart>
        );
    }


    handleMouseEnter(o) {
        let op = {...this.state.opacity};
        for ( var i in op) {
            op[i] = 0.1;
        }
        op[o.dataKey] = 1;
        this.setState({opacity: op});
    }
    
    handleMouseLeave(o) {
        let op = {...this.state.opacity};
        for ( var i in op) {
            op[i] = 0.5;
        }
        this.setState({opacity: op});
    }

    render() {
        return (
        <div className="plots">
        <ScatterChart width={600} height={600}
                      margin={{top: 10, right: 30, left: 0, bottom: 0}} >
          {this.genScatters()}
          <CartesianGrid stroke="#ccc" strokeDashArray="5 5"/>
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
          <Tooltip />
          <Legend 
            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
          />
            
        </ScatterChart>
        </div>
        
        );
    }

}

export default Plot;
