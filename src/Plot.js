// Plot.js
import React from 'react';
import { XAxis, YAxis, CartesianGrid, LineChart, Tooltip, Line, ScatterChart, Scatter, Legend } from 'recharts';

class Plot extends React.Component {
    constructor() {
        super();
        this.state = {
            // Color palette from Tableau Medium
            colors: ["rgb(114,158,206)", "rgb(255,158,74)", "rgb(103,191,92)", "rgb(237,102,93)", "rgb(173,139,201)", "rgb(168,120,110)", "rgb(237,151,202)", "rgb(162,162,162)", "rgb(205,204,93)", "rgb(109,204,218)"],
            options: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const dataChanged = this.props.data !== nextProps.data;
        const scaleChanged = this.props.scale !== nextProps.scale;
        const opacityChanged = JSON.stringify(this.state.options) !== JSON.stringify(nextState.options);
        return (
            dataChanged 
            || scaleChanged
            || opacityChanged
        );
    }

    genScatters() {
        let scatters = [];

        for(let i = 0; i < this.props.wards.length; i++) {
            if (!(this.props.wards[i] in this.state.options)) {
                let opt = this.state.options;
                opt[this.props.wards[i]] = {"opacity": 0.5, "clicked": true};
                this.setState({options: opt});
            }

            let opt = this.state.options[this.props.wards[i]]; 

            scatters.push(
             <Scatter
                key={i}
                dataKey={this.props.wards[i]}
                data={
                    this.props.data.data.filter(
                        (w) => w.ward === this.props.wards[i])
                }
                stroke={this.state.colors[i] || "#000000"}       
                fill={this.state.colors[i] || "#000000"} 
                opacity={opt.opacity||0.5}
                />
            );
        }
        return scatters || null;
    }

    genDist(data) {
        return (
            <LineChart width={600} height={600} data={data} syncId="anyId"
                      margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                      <XAxis dataKey="x"/>
                      <YAxis dataKey="y"/>
                      <CartesianGrid />
                      <Tooltip/>
                      <Line type='monotone' dataKey='y' stroke='#82ca9d' fill='#82ca9d' />
                    </LineChart>
        );
    }

    handleClick(o) {
        let opt = JSON.parse(JSON.stringify(this.state.options));
        let s = o.dataKey; 

        if(opt[s].clicked) {
            for(let w in opt) {
                opt[w].opacity = 0.1;
            }
            opt[s].opacity = 0.9;
        }
        else {
            for(let w in opt) {
                opt[w].opacity = 0.5;
            }
        }

        opt[s].clicked = !opt[s].clicked;
        this.setState({options: opt});
    }
    
    render() {
        return (
        <div className="plots">
        <div className="distX">{this.genDist(this.props.data.distX)}</div>
        <div className="scatter">
            <ScatterChart width={600} height={600}
                      margin={{top: 10, right: 30, left: 0, bottom: 0}} syncId="anyId" >
          {this.genScatters()}
          <CartesianGrid />
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
            onClick={this.handleClick.bind(this)}
          />
            
        </ScatterChart>
        </div>
        <div className="distY">{this.genDist(this.props.data.distY)}</div>
        </div>
        );
    }

}

export default Plot;
