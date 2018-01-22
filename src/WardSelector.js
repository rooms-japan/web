import React from 'react';
import ReactAutocomplete from 'react-autocomplete';

class WardSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      numWards: 1,
      selectedWards: []
    };
    this.myprops = {
      data: []
    };
  }

  getSelectedWards() {
    return this.state.selectedWards;
  }

  createWardSelector() {
    let items = [];

    for (let i = 0; i < this.state.numWards; i++) {
      items.push(
        <div key={i}>
          <ReactAutocomplete
            items={this.myprops.data}
            shouldItemRender={(item, value) =>
              item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
            }
            getItemValue={item => item.label}
            renderItem={(item, highlighted) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: highlighted ? '#eee' : 'transparent'
                }}
              >
                {item.label}
              </div>
            )}
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
    this.setState({ selectedWards });
  }

  render() {
    return (
      <div>
        {this.createWardSelector()}
        <button
          type="button"
          onClick={() => this.setState({ numWards: this.state.numWards + 1 })}
        >
          +
        </button>
      </div>
    );
  }
}

export default WardSelector;
