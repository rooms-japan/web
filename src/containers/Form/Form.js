import React, { Component } from 'react';

import Select from '../../components/Select';

import './Form.css';

class Form extends Component {
  state = {
    xcol: 'rent',
    ycol: 'size',
    selectedWards: [{ id: this.generateId(), value: 'Shinagawa' }],
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

  handleAddWardSelector = () => {
    let { selectedWards } = this.state;

    // Array.push() is a mutating operation so it modifies the current
    // array instead of returning a new array with the added entry.
    selectedWards.push({ id: this.generateId(), value: 'Shinagawa' });

    this.setState(prev => ({ ...prev, selectedWards }));
  };

  handleRemoveWardSelector = () =>
    this.setState(prev => ({
      ...prev,
      selectedWards: prev.selectedWards.filter(w => w.id !== ward.id)
    }));

  handleSelectWard = value =>
    this.setState(prev => ({
      ...prev,
      selectedWards: prev.selectedWards.map(
        w => (w.id === ward.id ? { ...ward, value } : w)
      )
    }));

  handleSubmit = evt => {
    const { store, throwError, clearErrors } = this.props;

    let xcol = encodeURIComponent(this.state.xcol);
    let ycol = encodeURIComponent(this.state.ycol);
    let ward = encodeURIComponent(
      this.state.selectedWards.map(ward => ward.value).join()
    );

    evt.preventDefault();

    clearErrors();

    store
      .get('data', { xcol, ycol, ward })
      .then(data => {
        this.props.onPlotData({
          data,
          xcol,
          ycol,
          selectedWards: this.state.selectedWards.map(ward => ward.value)
        });
      })
      .catch(error => {
        throwError('There was a problem with the request.', 2);
      });
  };

  generateId() {
    return parseInt(new Date().getTime().toString(), 10).toString(36);
  }

  render() {
    const { xcol, ycol, loading, wards, columns, selectedWards } = this.state;

    console.log(selectedWards);

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
          {selectedWards.map(ward => (
            <div key={ward.id}>
              <Select
                label={``}
                elements={wards}
                defaultSelected={`Shinagawa`}
                selected={ward.value}
                onSelect={this.handleSelectWard}
              />
              <button type="button" onClick={this.handleRemoveWardSelector}>
                -
              </button>
            </div>
          ))}
          <button type="button" onClick={this.handleAddWardSelector}>
            +
          </button>
        </div>
        <input type="submit" value="Plot it!" />
      </form>
    ) : null;
  }
}

export default Form;
