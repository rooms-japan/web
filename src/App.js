import React from 'react';

import Error from './components/Error';
import Form from './containers/Form';
import Plot from './containers/Plot';

import './App.css';

class App extends React.Component {
  state = {
    scale: 'linear',
    errors: []
  };

  throwError = (message, level) => {
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
    this.setState({ errors });
  }

  updatePlotData = data => {
    this.setState(prev => ({ ...prev, ...data }));
  };

  render() {
    const { store } = this.props;
    const { columns, wards, errors } = this.state;

    return (
      <div>
        {errors.map(({ message, level }) => (
          <Error level={level}>{message}</Error>
        ))}

        <Form 
          store={store} 
          throwError={this.throwError} 
          onPlotData={this.updatePlotData} 
        />

        <div className="wrapper">
          {/* Plots for data and distributions */}
          {this.state.data && (
            <Plot
              data={this.state.data}
              wards={this.state.selectedWards}
              xlabel={this.state.xcol}
              ylabel={this.state.ycol}
              scale={this.state.scale}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
