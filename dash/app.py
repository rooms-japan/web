import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
#import plotly.graph_objs as go
import urllib.request
import json

from MainGraph import MainGraph


app = dash.Dash()

wards = json.loads(urllib.request.urlopen("http://tiphaineviard.com:5000/api/info/wards").read())
wards_list = [w['value'] for w in wards]
print(wards_list)

columns = json.loads(urllib.request.urlopen("http://tiphaineviard.com:5000/api/info/columns").read())

# Download all data :D ?
df = pd.read_csv('bdd.csv')


# initial values for main plot
ward = ['shinagawa']
x = 'layout'
y = 'rent'
main_graph = MainGraph(df, ward, x, y)

app.layout = html.Div([
    dcc.Dropdown(
        id='selectedWards',
        options=wards,
        value='shinagawa',
        multi=True
    ),
    html.Div([
        dcc.Dropdown(
            id='x',
            options=columns,
            value='layout',
        ),
        dcc.Dropdown(
            id='y',
            options=columns,
            value='rent',
        ),
    ]),
    html.Div(id='main-graph')

    # dcc.Graph(
    #     id='main-graph',
    #         )
])



@app.callback(
    dash.dependencies.Output('main-graph', 'children'),
    [
        dash.dependencies.Input('selectedWards', 'value'),
        dash.dependencies.Input('x', 'value'),
        dash.dependencies.Input('y', 'value')
    ]
)
def update_info(w, x, y):
    main_graph.x = x
    main_graph.y = y
    main_graph.ward = w

    return main_graph.dcc_scatter

# def update_info(w, x, y):
#     # data = urllib.request.urlopen("").read()
#     if type(w) == str:
#         w = [w]
#     print("You want " + x + " against " + y + " for " + str(w) + ".")


#     # data = [
#     #     go.Box(
#     #     y=df[(df.layout == i) & (df.location.str.contains('shinagawa', case=False))][y],
#     #     boxpoints='all',
#     #     jitter=0.3,
#     #     pointpos=-1.8,
#     #     name=i
#     # ) for i in df['layout'].unique() if len(df[(df.layout == i) & (df.location.str.contains('shinagawa', case=False))][y]) > 10]


#     return {
#             'data': data,
#             'layout': go.Layout(
#                     xaxis={'title': x},
#                     yaxis={'title': y},
#                     margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
#                     legend={'x': 0, 'y': 1},
#                     hovermode='closest'
#                 )
#         }


if __name__ == '__main__':
    app.run_server(debug=True)
