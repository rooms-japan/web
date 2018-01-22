import React from 'react';
import ReactAutocomplete from 'react-autocomplete';

import Plot from './Plot.js';
import Error from './components/Error'

import './App.css';

class App extends React.Component {
    state = {
        scale: 'linear',
        data: {"data":[], "distX": [], "distY": []},
        xcols: [],
        xcol: 'rent',
        ycols: [],
        ycol: 'size',
        wards: [],
        selectedWards: ['Shinagawa'],
        numWards: 1,
        errors: []
    }

    throwError(message, level) {
        /*
         * Adds an error to the list of encountered errors.
         *
         * message: The error message that will be displayed.
         * level: The gravity of the error.
         *        1: warning
         *        2: error hindering part of the intended behaviour
         *        3: error hindering most or all intended behaviour
         */
        const { errors } = this.state;

        for (let i = 0; i < errors.length; i++) {
            if (message === errors[i]) {
                return;
            }
        }

        errors.push({ message, level });
        this.setState({
            errors
        });
    }

    componentDidMount() {
        const { store } = this.props

        store.get('wards')
            .then((wards) => { this.setState((prev) => ({ ...prev, wards })) })
            .catch((error) => {
                this.throwError("Could not load initial ward data from database.", 3);
            })

        store.get('columns')
            .then((columns) => { this.setState((prev) => ({ ...prev, columns })) })
            .catch((error) => {
            this.throwError("Could not load initial data from database.", 3);
        })
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        const { store } = this.props

        let xcol = encodeURIComponent(this.state.xcol);
        let ycol = encodeURIComponent(this.state.ycol);
        let ward = encodeURIComponent(this.state.selectedWards.join());

        store.get('data', { xcol, ycol, ward })
            .then((data) => {
                this.setState(prev => ({ ...prev, data}))
            })
            .catch(error => {
                this.throwError("There was a problem with the request.", 2);
            })
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

    createWardSelector() {
        /*
         * Creates a component consisting of input fields (autocomplete), and +/- buttons to add/remove input fields.
         * Autocomplete data is the list of wards.
         */
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
        /*
         * If the "-" is pressed next to an input in the wardSelector, remove the corresponding ward from the list of selected wards.
         */
        let s = this.state.selectedWards.slice();
        s.splice(i, 1);
        this.setState({
            numWards: this.state.numWards - 1,
            selectedWards: s
        });
    }
    
    handleWardSelectorChange(i, event) {
        /*
         * Add ward to the list of selected wards.
         */
        let selectedWards = this.state.selectedWards.slice();
        selectedWards[i] = event.target.value;
        this.setState({selectedWards});
    }



    render() {
        const { errors } = this.state

        return (
            <div>
            {errors.map(({message, level}) => <Error level={level}>{message}</Error>)}
            
            <form onSubmit={this.handleSubmit}>
            <label>I want to plot
            {/* Field for x axis */}
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
            {/* Field for y axis */}
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
            {/* Ward selector */}
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
            {/* Plots for data and distributions */}
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
