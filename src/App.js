import React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import './App.css';
import Plot from './Plot.js';
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            scale: 'linear',
            data: {},
            xcols: [],
            xcol: '',
            ycols: [],
            ycol: '',
            wards: [],
            ward: '',
            err: ''
        };
    }
    
    setWards() {
        var xhr = new XMLHttpRequest();
        let url = "http://localhost:5000/api/info/wards";

        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                wards: data
            });
        }.bind(this);

        xhr.onerror = function() {alert('Initial err')}

        xhr.send(null);
    }

    setColumns() {
        var xhr = new XMLHttpRequest();
        let url = "http://localhost:5000/api/info/columns";
        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                xcols: data,
                ycols: data
            });
        }.bind(this);

        xhr.onerror = function() {alert('Initial err')}

        xhr.send(null);
    }

    componentDidMount() {
        // Set list of wards and table columns
        this.setColumns();
        this.setWards();
    }



    handleSubmit = (evt) => {
        evt.preventDefault();
        let xcol = encodeURIComponent(this.state.xcol);
        let ycol = encodeURIComponent(this.state.ycol);
        let ward = encodeURIComponent(this.state.ward);
        let url = "http://localhost:5000/api/hello/"+ xcol + "/" + ycol + "/" + ward ;

        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                data:data
            });

        }.bind(this);

        // Change for error tooltip
        xhr.onerror = function() {alert("Err");};

        xhr.send(null);
    };


    changeXCol = (evt) => {
        this.setState({
            xcol: evt.target.value
        });
    };
    changeYCol = (evt) => {
        this.setState({
            ycol: evt.target.value
        });
    };

    setLogX = () => {
        let newScale;
        if(this.state.scale === "log") {
            newScale = "linear"; 
        }
        else {
            newScale = "log";
        }
        this.setState({
            scale: newScale
        });
    }

    render() {
        return (
            <div>
            <div className="err">{this.state.err}</div>
            <form onSubmit={this.handleSubmit}>
            <label>I want to plot
            <ReactAutocomplete
                    items={this.state.xcols}
                    shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    getItemValue={item => item.label}
                    renderItem={(item, highlighted) =>
                                  <div
                                    key={item.id}
                                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                  >
                                    {item.label}
                                  </div>
                                }
                    value={this.state.xcol}
                    onChange={e => this.setState({ xcol: e.target.value })}
                    onSelect={xcol => this.setState({ xcol })}
                  />
            </label>
            <label>in function of 
            <ReactAutocomplete
                    items={this.state.ycols}
                    shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    getItemValue={item => item.label}
                    renderItem={(item, highlighted) =>
                                  <div
                                    key={item.id}
                                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                  >
                                    {item.label}
                                  </div>
                                }
                    value={this.state.ycol}
                    onChange={e => this.setState({ ycol: e.target.value })}
                    onSelect={ycol => this.setState({ ycol })}
                  />
            </label>
            <label>
            for
            </label>
            <ReactAutocomplete
                    items={this.state.wards}
                    shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    getItemValue={item => item.label}
                    renderItem={(item, highlighted) =>
                                  <div
                                    key={item.id}
                                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                  >
                                    {item.label}
                                  </div>
                                }
                    value={this.state.ward}
                    onChange={e => this.setState({ ward: e.target.value })}
                    onSelect={ward => this.setState({ ward })}
                  />
            <input type="submit" value="Plot it!"/>
            </form>
            <br/>
            <br/>
            <div className="wrapper">
            <Plot
                data={this.state.data}
                xlabel={this.state.xcol}
                ylabel={this.state.ycol}    
                scale={this.state.scale}
            />

            </div>
            </div>
        );
    }
}

export default App;
