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
import axios from 'axios';
import Button from 'material-ui/Button';
import TradingViewWidget from 'react-tradingview-widget';
import Web3 from 'web3';
import Modal from 'material-ui/Modal';
import {CircularProgress} from 'material-ui/Progress';
import {
    TopBorderedPaper,
    NewsContainer,
    CoinsContainer
} from '../../components';
import red from 'material-ui/colors/red';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 'inherit'
    },
    appFrame: {
        // height: 430,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
        height:'inherit'
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
        height:'inherit'
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
    heading: {
        color: theme.palette.primary.main
    },
    subheading: {
        fontWeight: 'bold',
        color: theme.palette.primary.light
    },
    statKey: {
        fontWeight: 'bold',
        color: theme.palette.secondary.dark
    },
    statVal: {},
    toolbar: theme.mixins.toolbar,
    chartContainer: {
        height: '100%'
    },
    paper: {
        position: 'absolute',
        width: 1000,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
    modalTitle: {
        color: red[500],
        marginBottom: 20
    },
    closeBtn:{
        marginTop:30
    }
});

class Root extends React.Component {
    state = {
        open: false,
        anchor: 'left',
        news: [],
        topCoins: [],
        ethAddress: '',
        transactionHash: '',
        receipt: '',
        confirmation: 0,
        openModal: false,
        availAccounts: [],
        fromAccount: '',
        submitClick: false
    };

    constructor(props) {
        super(props);

        this.getNews = this.getNews.bind(this);
        this.getTopCoins = this.getTopCoins.bind(this);
        this.onChange = this.onChange.bind(this);
        this.refreshStats = this.refreshStats.bind(this);
        this.makeTransaction = this.makeTransaction.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getAccounts = this.getAccounts.bind(this);
    }

    refreshStats() {
        this.setState({
            transactionhash: '',
            receipt: '',
            confirmation: 0,
            availAccounts: [],
            submitClick: false
        })
    }

    componentDidMount() {
        this.getNews();
        this.loadTradingView();
        this.getTopCoins();
    }

    onChange = target => e => {
        if (target === 'eth') {
            this.setState({ethAddress: e.target.value});
        } else if (target === 'fromAcc') {
            this.setState({fromAccount: e.target.value});
        }
    };

    handleClose() {
        this.setState({
            openModal: false
        })
    }

    loadTradingView() {
        new window.TradingView.widget(
            {
                "symbol": "COINBASE:ETHUSD",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "Light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_chart"
            }
        );
    }

    async getTopCoins() {
        let response = await axios.get('/api/top-coins');

        this.setState({
            topCoins: response.data.data.coins
        });
    }

    async getAccounts() {
        this.refreshStats();

        this.setState({
            openModal: true
        });

        if (window.web3.currentProvider === undefined) {
            alert('Please Install Metamask');
            return;
        }

        let web3 = new Web3(window.web3.currentProvider);

        let accounts = await web3.eth.getAccounts();

        console.log(accounts);

        if (accounts.length < 1) {
            alert('Could not retrieve accounts');
            return;
        }

        this.setState({availAccounts: accounts});
    }

    async makeTransaction() {
        this.setState({submitClick: true});

        if (window.web3.currentProvider === undefined) {
            alert('Please Install Metamask');
            return;
        }

        if (!this.state.fromAccount) {
            alert('Could not retrieve account information');
            return;
        }

        let web3 = new Web3(window.web3.currentProvider);

        let address = this.state.ethAddress;

        if (!web3.utils.isAddress(address)) {
            alert('Invalid ETH Address');
            return;
        }

        this.setState({openModal: true});

        web3.eth.sendTransaction({
            from: this.state.fromAccount,
            to: this.state.ethAddress,
            value: '1000000000000000'
        })
            .on('transactionHash', (hash) => {
                this.setState({
                    transactionHash: hash
                })
            })
            .on('receipt', (receipt) => {
                this.setState({receipt})
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.setState({confirmation: this.state.confirmation + 1});
            })
            .on('error', (e) => {
                this.refreshStats();
                console.log(e);
                this.setState({openModal: false});
                alert('An error occurred');
            });
    }

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

    async getNews() {
        let response = await axios.get('https://newsapi.org/v2/everything?q=Ethereum&sortBy=popularity&apiKey=3252d6fa498d40328bd4d770027778a0');

        this.setState({
            news: response.data.articles
        })
    }

    render() {
        const {classes, theme} = this.props;
        const {anchor, open, curBlock, curHashrate, curGasprice, news, topCoins} = this.state;

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
                            <Typography variant="title" color="inherit" noWrap style={{marginLeft:20}}>
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
                        <div className={classes.toolbar}></div>
                        <Grid container justify="space-between" style={{height:'inherit'}}>
                            <Grid item lg={3} style={{height:'inherit'}}>
                                <Grid container style={{height:'inherit'}}>
                                    <TopBorderedPaper
                                        style={{height:'inherit'}}
                                        title="News Feeds"
                                        content={
                                            news.length < 1 ? 'loading...' :
                                                news.map(function (item) {
                                                    return <NewsContainer
                                                        title={item.title}
                                                        imgSrc={item.urlToImage}
                                                        author={item.author}
                                                        date={item.publishedAt}
                                                    />
                                                })
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item lg={6}>
                                <Grid container>
                                    <TopBorderedPaper
                                        title="Send ETH"
                                        content={
                                            <div>
                                                <TextField
                                                    id="eth-wallet-address"
                                                    label="ETH wallet address"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={this.state.ethAddress}
                                                    onChange={this.onChange('eth')}
                                                    placeholder="Enter ETH Wallet Hexacode"
                                                    helperText="Enter ETH Wallet Hexacode"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Grid container direction="row-reverse">
                                                    <Button variant="raised" color="secondary"
                                                            onClick={this.getAccounts}>
                                                        send
                                                    </Button>
                                                </Grid>
                                            </div>
                                        }
                                    />
                                </Grid>
                                <Grid container className={classes.chartContainer}>
                                    <TopBorderedPaper
                                        title="Chart"
                                        content={
                                            <div class="tradingview-widget-container">
                                                <div id="tradingview_chart"></div>
                                                <div className="tradingview-widget-copyright"><a
                                                    href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
                                                    rel="noopener" target="_blank"><span
                                                    class="blue-text">AAPL chart</span></a> by TradingView
                                                </div>
                                            </div>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item lg={3}>
                                <Grid container>
                                    <TopBorderedPaper
                                        title="Other Cryptos"
                                        content={
                                            topCoins.length < 1 ? 'loading...' :
                                                topCoins.map(function (item, index) {
                                                    return <div><CoinsContainer
                                                        imgSrc={'https://chasing-coins.com/coin/logo/' + item.symbol}
                                                        name={item.symbol}
                                                        index={index + 1}
                                                        price={'$' + item.price}
                                                    />
                                                        {index === topCoins.length - 1 ? '' : <Divider/>}
                                                    </div>
                                                })
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.openModal}
                            onClose={this.handleClose}
                        >
                            <div className={classes.paper}>
                                <Grid container justify="center">
                                    {this.state.submitClick ? this.state.transactionHash ?
                                        this.state.receipt ?
                                            this.state.confirmation > 11 ?
                                                <div>
                                                    <Typography variant="display1" align="center"
                                                                className={classes.modalTitle}>Getting
                                                        Confirmations</Typography>
                                                    <Typography variant="title" align="center">
                                                        Transaction Successful!
                                                    </Typography>
                                                    <Grid container justify="center" className={classes.closeBtn}>
                                                        <Button variant="raised" color="secondary" onClick={this.handleClose}>
                                                            Close
                                                        </Button>
                                                    </Grid>
                                                </div> :
                                                <div>
                                                    <Typography variant="display1" align="center"
                                                                className={classes.modalTitle}>Getting
                                                        Confirmations</Typography>
                                                    <Typography variant="title" align="center">Confirmation
                                                        Count</Typography>
                                                    <Typography variant="title"
                                                                align="center">{this.state.confirmation}</Typography>
                                                    <Grid container justify="center">
                                                        <CircularProgress className={classes.progress}
                                                                          color="secondary"/>
                                                    </Grid>
                                                </div> :
                                            <div>
                                                <Typography variant="display1" align="center"
                                                            className={classes.modalTitle}>Waiting for Transaction to be
                                                    Mined</Typography>
                                                <Typography variant="title" align="center">Your Transaction Hash
                                                    is</Typography>
                                                <Typography variant="body1"
                                                            align="center">{this.state.transactionHash}</Typography>
                                                <Typography variant="title" align="center">Please Wait for
                                                    Confirmations</Typography>
                                                <Grid container justify="center">
                                                    <CircularProgress className={classes.progress} color="secondary"/>
                                                </Grid>
                                            </div> :
                                        <div>
                                            <Typography variant="title" align="center">Loading...</Typography>
                                            <Grid container justify="center">
                                                <CircularProgress className={classes.progress} color="secondary"/>
                                            </Grid>
                                        </div> :
                                        <div>
                                            <Typography variant="display1" align="center"
                                                        className={classes.modalTitle}>Choose Account</Typography>
                                            <TextField
                                                id="select-currency"
                                                select
                                                label="Select"
                                                value={this.state.fromAccount}
                                                onChange={this.onChange('fromAcc')}
                                                helperText="Please select your currency"
                                                margin="normal"
                                                fullWidth
                                            >
                                                {this.state.availAccounts.length < 1 ? 'loading..' : this.state.availAccounts.map((acc, index) => (
                                                    <MenuItem key={index} value={acc}>
                                                        {acc}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <Button variant="raised" color="secondary" onClick={this.makeTransaction}>
                                                Submit
                                            </Button>
                                        </div>
                                    }
                                </Grid>
                            </div>
                        </Modal>
                    </main>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Root);