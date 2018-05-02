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
});

export default class App extends React.Component {

    render() {
        return (
            <div style={{height:'inherit'}}>
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