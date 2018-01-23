import React, { Component } from 'react';

import Select from '../../components/Select';

import './Form.css';

class Form extends Component {
  state = {
    xcol: 'rent',
    ycol: 'size',
    selectedWards: ['Shinagawa'],
    numWards: 1,
    loading: true
  };

  async componentDidMount() {
    const { store, throwError } = this.props;

    this.setState(prev => ({ ...prev, loading: true, error: false }));

    try {
      let [wards, columns] = await Promise.all([
        store.get('wards'),
        store.get('columns')
      ]);

      this.setState(prev => ({ ...prev, wards, columns }));
    } catch (err) {
      throwError('Could not load initial data from database.', 3);
    } finally {
      this.setState(prev => ({ ...prev, loading: false }));
    }
  }

  handleSubmit = evt => {
    const { store, throwError } = this.props;

    let xcol = encodeURIComponent(this.state.xcol);
    let ycol = encodeURIComponent(this.state.ycol);
    let ward = encodeURIComponent(this.state.selectedWards.join());

    evt.preventDefault();

    store
      .get('data', { xcol, ycol, ward })
      .then(data => {
        this.props.onPlotData({
          data,
          xcol,
          ycol,
          selectedWards: this.state.selectedWards
        });
      })
      .catch(error => {
        throwError('There was a problem with the request.', 2);
      });
  };

  createWardSelector() {
    const { wards } = this.state;

    /*
     * Creates a component consisting of input fields (autocomplete), and +/- buttons to add/remove input fields.
     * Autocomplete data is the list of wards.
     */
    let items = [];

    for (let i = 0; i < this.state.numWards; i++) {
      items.push(
        <div key={i}>
          <Select
            elements={wards}
            value={this.state.selectedWards[i]}
            onChange={this.handleWardSelectorChange.bind(this, i)}
            onSelect={ward => {
              let s = this.state.selectedWards;
              s[i] = ward;
              this.setState({ selectedWards: s });
            }}
          />
          <button
            onClick={this.handleWardSelectorRemove.bind(this, i)}
            type="button"
          >
            -
          </button>
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
    this.setState({ selectedWards });
  }

  render() {
    const { xcol, ycol, loading, wards, columns } = this.state;

    return loading ? (
      <div>Loading</div>
    ) : wards && columns ? (
      <form onSubmit={this.handleSubmit}>
        <Select
          label={`I want to plot `}
          elements={columns}
          defaultSelected={`rent`}
          selected={xcol}
          onSelect={xcol => this.setState(prev => ({ ...prev, xcol }))}
        />
        <Select
          label={` in function of `}
          elements={columns}
          defaultSelected={`size`}
          selected={ycol}
          onSelect={ycol => this.setState(prev => ({ ...prev, ycol }))}
        />
        <label>for</label>
        <div>
          {/* Ward selector */}
          {this.createWardSelector()}
          <button
            type="button"
            onClick={() => this.setState({ numWards: this.state.numWards + 1 })}
          >
            +
          </button>
        </div>
        <br />
        <br />
        <input type="submit" value="Plot it!" />
      </form>
    ) : null;
  }
}

export default Form;
