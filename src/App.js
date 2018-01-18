import React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import './App.css';
import Plot from './Plot.js';

class App extends React.Component {
    
    constructor() {
        super();
        this.state = {
            domain: "http://localhost",
            //domain: "http://tiphaineviard.com",
            scale: 'linear',
            data: [],
            xcols: [],
            xcol: 'rent',
            ycols: [],
            ycol: 'size',
            wards: [],
            selectedWards: ['Shinagawa'],
            numWards: 1,
            err: []
        };
    }

    throwError(msg, level) {
        /*
         * Adds an error to the list of encountered errors.
         *
         * msg: The error message that will be displayed.
         * level: The gravity of the error.
         *        1: warning
         *        2: error hindering part of the intended behaviour
         *        3: error hindering most or all intended behaviour
         */
        let err = this.state.err;

        for (let i = 0; i < err.length; i++) {
            if (msg === err[i]) {
                return;
            }
        }

        err.push(msg);
        this.setState({
            err: err
        });
    }
    
    setWards() {
        var xhr = new XMLHttpRequest();
        let url = this.state.domain + ":5000/api/info/wards";

        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                wards: data
            });
        }.bind(this);

        xhr.onerror = function() {
            this.throwError("Could not load initial ward data from database.", 3);
        }.bind(this);

        xhr.send(null);
    }

    setColumns() {
        var xhr = new XMLHttpRequest();
        let url = this.state.domain + ":5000/api/info/columns";
        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                xcols: data,
                ycols: data
            });
        }.bind(this);

        xhr.onerror = function() {
            this.throwError("Could not load initial data from database.", 3);
        }.bind(this);

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
        let url = this.state.domain + ":5000/api/hello/"+ xcol + "/" + ycol + "/" + ward ;

        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", url, true);

        xhr.onload = function() {
            let data = JSON.parse(xhr.response);
            this.setState({
                data:data
            });

        }.bind(this);

        xhr.onerror = function() {
            this.throwError("There was a problem with the request.", 2);
        }.bind(this);

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
            {this.state.err.map(e => <div className="err">{e}</div>)}
            <form onSubmit={this.handleSubmit}>
            <label>I want to plot
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
            <label>in function of 
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
            <label>
            for
            </label>
            <div>
            {this.createWardSelector()}
            <button type="button" onClick={() => this.setState({numWards: this.state.numWards + 1})}>+</button>
            </div>
            <br/>
            <br/>
            <input type="submit" value="Plot it!"/>
            </form>
            <br/>
            <br/>
            <div className="wrapper">
            <Plot
                data={this.state.data}
                wards={this.state.selectedWards}
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
