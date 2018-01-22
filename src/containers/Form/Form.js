import React, { Component } from 'react'
import ReactAutocomplete from 'react-autocomplete';

import './Form.css'

class Form extends Component {
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

  handleSubmit = (evt) => {
    const { store } = this.props

    let xcol = encodeURIComponent(this.state.xcol);
    let ycol = encodeURIComponent(this.state.ycol);
    let ward = encodeURIComponent(this.state.selectedWards.join());

    evt.preventDefault();

    store.get('data', { xcol, ycol, ward })
        .then((data) => {
            this.props.onPlotData({ data, xcol, ycol, selectedWards: this.state.selectedWards })
        })
        .catch(error => {
            this.throwError("There was a problem with the request.", 2);
        })
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
    return (
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
    )
  }
}

export default Form
