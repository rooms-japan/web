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
            numWards: 1,
            selectedWards: [''],
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
        let ward = encodeURIComponent(this.state.selectedWards.join());
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

    createWardSelector() {
        let items = [];

        for (let i = 0; i < this.state.numWards; i++) {
            items.push(
            <div key={i}> 
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
                        value={this.state.selectedWards[i]}
                        onChange={this.handleWardSelectorChange.bind(this,i)}
                        onSelect={ward => { let s = this.state.selectedWards; s[i] = ward; this.setState({ selectedWards: s })}}
                      />
                    <button onClick={this.handleWardSelectorRemove.bind(this, i)} type="button">-</button>
            </div>
            );
        }
       return items || null; 
    }

    handleWardSelectorRemove(i, event) {
        let s = this.state.selectedWards.slice();
        s.splice(i, 1);
        this.setState({
            numWards: this.state.numWards - 1,
            selectedWards: s
        });
    }
    
    handleWardSelectorChange(i, event) {
        let selectedWards = this.state.selectedWards.slice();
        selectedWards[i] = event.target.value;
        this.setState({selectedWards});
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
            {this.createWardSelector()}
            <button type="button" onClick={() => this.setState({numWards: this.state.numWards + 1})}>+</button>
            <br/>
            <br/>
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
