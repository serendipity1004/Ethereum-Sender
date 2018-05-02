import React from 'react';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

/**
 * Colors
 * */
import purple from 'material-ui/colors/purple';
import pink from 'material-ui/colors/pink';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxHeight:'calc(100vh - 100px)',
        padding: 16,
        overflowY:'scroll'
    },
    paperRoot: {
        width: '100%',
        borderTop: `4px solid ${purple[500]}`,
        padding:16
    },
    title: {
        borderBottom: `2px solid ${pink[500]}`,
        color:'#000000',
        margin:20
    }
});

class TopBorderedPaper extends React.Component {
    render() {
        const {classes, title, content} = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paperRoot}>
                    <Grid container>
                        <Typography variant="display1" className={classes.title}>
                            {title}
                        </Typography>
                    </Grid>
                    {content}
                </Paper>
            </div>
        )
    }
}

TopBorderedPaper.propTypes = {
    classes: PropTypes.object.isRequired,
    title:PropTypes.string.isRequired,
    content:PropTypes.func.isRequired
};

export default withStyles(styles)(TopBorderedPaper);