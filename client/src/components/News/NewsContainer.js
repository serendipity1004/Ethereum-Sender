import React from 'react';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

const styles = theme => ({
    root: {
        padding: 10,
    },
    thumbnail: {
        width: '100%',
        height: '100%'
    },
    title:{
        fontWeight:'bold'
    }
});

class NewsContainer extends React.Component {
    render() {
        let {classes, imgSrc, title, date, author} = this.props;

        return (
            <div className={classes.root}>
                <Paper elevation={1}>
                    <Grid container>
                        <Grid item lg={4}>
                            <img src={imgSrc} className={classes.thumbnail}/>
                        </Grid>
                        <Grid item lg={8}>
                            <Typography variant="button" className={classes.title}>
                                {title}
                            </Typography>
                            <Typography variant="body2">
                                {author}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(NewsContainer);