import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import history from '../services/history';
import {ResponsiveDrawer} from '../components';
import {mainRoutes} from '../routes';
import Reboot from 'material-ui/Reboot';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';

/**
 * Pages
 * */

const mainSwitch = (
    <Switch>
        {mainRoutes.map(function (item, index) {
            return (
                item.wrapper ? 'Something else' : <Route key={index} path={item.path} component={item.component}/>
            )
        })}
    </Switch>
);

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});

export default class App extends React.Component {

    render() {
        return (
            <div>
                <Reboot/>
                <MuiThemeProvider theme={theme}>
                    <Router history={history}>
                        {mainSwitch}
                    </Router>
                </MuiThemeProvider>
            </div>
        );
    }
}