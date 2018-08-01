import dash_core_components as dcc
import plotly.graph_objs as go



class MainGraph(object):

    def __init__(self, df, ward, x, y, graphid="graph1"):
        self.id = graphid
        self._set_ward(ward)
        self._set_x(x)
        self._set_y(y)
        self.df = df
        self._data_scatter = None
        self._dcc_scatter = None

    def _reset(self):
        self._data_scatter = None
        self._dcc_scatter = None

    def _get_x(self):
        return self._x

    def _set_x(self, x):
        self._reset()
        self._x = x

    x = property(_get_x, _set_x)

    def _get_y(self):
        return self._y

    def _set_y(self, y):
        self._reset()
        self._y = y

    y = property(_get_y, _set_y)

    def _get_ward(self):
        return self._ward

    def _set_ward(self, ward):
        self._reset()
        if type(ward) == str:
            ward = [ward]
        self._ward = ward

    ward = property(_get_ward, _set_ward)

    def _get_data_scatter(self):
        if self._data_scatter is None:
            self._data_scatter = [
            go.Scatter(
                x=self.df[self.df.location.str.contains(i, case=False)][self.x],
                y=self.df[self.df.location.str.contains(i, case=False)][self.y],
                mode='markers',
                opacity=0.7,
                name=i,
                marker={
                    'size': 15,
                    'line': {'width':0.5, 'color': 'white'}
                }
            ) for i in self.ward
            ]

    def _get_dcc_scatter(self):
        if self._data_scatter is None:
            self._get_data_scatter()

        if self._dcc_scatter is None:
            self._dcc_scatter = dcc.Graph(
                id=self.id,
                figure={
                    'data': self._data_scatter,
                    'layout': go.Layout(
                            xaxis={'title': self.x},
                            yaxis={'title': self.y},
                            margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                            legend={'x': 0, 'y': 1},
                            hovermode='closest'
                        )
                    }
                )
        return self._dcc_scatter

    dcc_scatter = property(_get_dcc_scatter)


class SideGraph(object):
    ## XXX make a parent class with common properties with MainGraph

    def __init__(self, df, ward, x, graphid="graph2"):
        self.id = graphid
        self._set_ward(ward)
        self._set_x(x)
        self.df = df
        self._data_hist = None
        self._dcc_hist = None

    def _reset(self):
        self._data_hist = None
        self._dcc_hist = None

    def _get_x(self):
        return self._x

    def _set_x(self, x):
        self._reset()
        self._x = x

    x = property(_get_x, _set_x)

    def _get_ward(self):
        return self._ward

    def _set_ward(self, ward):
        self._reset()
        if type(ward) == str:
            ward = [ward]
        self._ward = ward

    ward = property(_get_ward, _set_ward)

    def _get_data_hist(self):
        if self._data_hist is None:
            data_hist = []
            for i in self.ward:
                items_i = list(self.df.loc[self.df.location.str.contains(i, case=False),self.x])
                hist_i = go.Histogram(
                    histfunc = "sum",
                    x = items_i,
                    y = ["1"]*len(items_i),
                    name = i
                )
                data_hist = data_hist + [hist_i]

            self._data_hist = data_hist

    def _get_dcc_hist(self):
        if self._data_hist is None:
            self._get_data_hist()

        if self._dcc_hist is None:
            self._dcc_hist = dcc.Graph(
                id=self.id,
                figure={
                    'data': self._data_hist,
                    'layout': go.Layout(
                            xaxis={'title': self.x},
                            yaxis={'title': 'count'},
                            # margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                            legend={'x': 0, 'y': 1},
                            hovermode='closest'
                        )
                    }
                )
        return self._dcc_hist

    dcc_hist = property(_get_dcc_hist)










