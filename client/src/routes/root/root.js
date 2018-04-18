import React from 'react';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import {MenuItem} from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Grid from 'material-ui/Grid';
import web3 from '../../services/web3';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appFrame: {
        // height: 430,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    'content-left': {
        marginLeft: -drawerWidth,
    },
    'content-right': {
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
    rootContainer: {
        width: '70%',
        margin: 'auto'
    },
    gap20: {
        margin: '20px 0 20px 0'
    },
    heading:{
        color:theme.palette.primary.main
    },
    subheading: {
        fontWeight: 'bold',
        color:theme.palette.primary.light
    },
    statKey: {
        fontWeight: 'bold',
        color:theme.palette.secondary.dark
    },
    statVal: {

    },
});

class Root extends React.Component {
    state = {
        open: false,
        anchor: 'left',
    };

    constructor(props) {
        super(props);

        this.refreshStats = this.refreshStats.bind(this);

        this.refreshStats();
    }

    refreshStats = async () => {
        let {difficulty, hash, parentHash, nonce} = await web3.eth.getBlock('latest');
        let curHashrate = await web3.eth.getHashrate();
        let curGasprice = await web3.eth.getGasPrice();

        console.log(curHashrate);
        console.log(!!0);

        let curBlock = {
            difficulty,
            hash,
            parentHash,
            nonce
        };

        this.setState({curBlock, curHashrate, curGasprice})
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleChangeAnchor = event => {
        this.setState({
            anchor: event.target.value,
        });
    };

    render() {
        const {classes, theme} = this.props;
        const {anchor, open, curBlock, curHashrate, curGasprice} = this.state;

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: open,
                            [classes[`appBarShift-${anchor}`]]: open,
                        })}
                    >
                        <Toolbar disableGutters={!open}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, open && classes.hide)}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit" noWrap>
                                Ethereum Hub
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="persistent"
                        anchor={anchor}
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon/>
                            </IconButton>
                        </div>
                        <Divider/>
                    </Drawer>
                    <main
                        className={classNames(classes.content, classes[`content-${anchor}`], {
                            [classes.contentShift]: open,
                            [classes[`contentShift-${anchor}`]]: open,
                        })}
                    >
                        <Grid container justify="center" direction="column" style={{height:'100%'}}>
                            <div className={classes.rootContainer}>
                                <Typography variant="display2" align="center" className={classes.heading}>
                                    Current Statistics
                                </Typography>
                                <div className={classes.gap20}/>
                                <Grid container justify="center">
                                    <Grid item xs={12}>
                                        <Typography variant="headline" className={classes.subheading}>
                                            Current Block Information
                                        </Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Hash
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {curBlock ? curBlock.hash : '...loading'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Parent Hash
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {curBlock ? curBlock.parentHash : '...loading'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Nonce
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {curBlock ? curBlock.nonce : '...loading'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Difficulty
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {curBlock ? curBlock.difficulty : '...loading'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes.gap20}/>
                                        <Typography variant="headline" className={classes.subheading}>
                                            Current Hash Rate
                                        </Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Rate
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {(curHashrate || curHashrate === 0) ? curHashrate : '...loading'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes.gap20}/>
                                        <Typography variant="headline" className={classes.subheading}>
                                            Current Gas Price
                                        </Typography>
                                        <Divider/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statKey}>
                                            Rate
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="title" className={classes.statVal}>
                                            {curGasprice ? curGasprice + ' Wei' : '...loading'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </main>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Root);