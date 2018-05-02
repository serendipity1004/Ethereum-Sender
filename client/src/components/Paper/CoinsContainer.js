import React from 'react';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';

const styles = theme => ({
    root: {},
    inline: {
        display: 'inline-block'
    },
    img: {
        width: 20,
        height: 20,
        verticalAlign: 'middle',
        marginRight: 20
    },
    name: {
        color: indigo[500]
    },
    price: {
        color:red[500]
    }
});

class CoinsContainer extends React.Component {
    render() {
        const {classes, imgSrc, name, price, index} = this.props;

        return (
            <div className={classes.root}>
                <Grid container justify="space-between">
                    <Grid item lg={6}>
                        <Typography variant="subheading" className={classes.name}>
                            {index}.
                            <img src={imgSrc} className={classes.img}/>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="subheading" className={classes.price}>
                            {price}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(CoinsContainer);