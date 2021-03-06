import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import { searchArticles } from '../../actions/searchArticles';
import { listArticles } from '../../actions/listArticles';
import compose from 'recompose/compose';
import API from '../../utils/API';

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  searchArticles: searchTerm => dispatch(searchArticles(searchTerm)),
  listArticles: list => dispatch(listArticles(list))
});

const styles = theme => ({
  root: {
    marginTop: '10px',
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`
  },
  wrapper: {
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paper: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4
  },
  button: {
    marginLeft: 10,
    color: '#ff6600'
  },
  title: {
    'font-family': 'Rubik',
    color: '#01163D'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ArticleList extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      open: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  searchArticles = event => {
    this.props.searchArticles(this.state.searchTerm);
    API.searchArticles(this.state.searchTerm).then(results => {
      console.log(results);
      if (results.status === 200) {
        this.props.listArticles(results.data.hits);
      }
      this.setState({ searchTerm: '' });
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      if (this.state.searchTerm) {
        this.searchArticles();
      } else {
        this.handleClickOpen();
      }
    }
  };

  renderList() {
    const { classes } = this.props;
    return this.props.list.arr.map(article => {
      return (
        <Paper className={classes.paper} key={article.objectID}>
          <a href={article.url} target="_blank" rel="noreferrer noopener">
            <h1 style={{ textAlign: 'center' }} className={classes.title}>
              {article.title}
            </h1>
          </a>
        </Paper>
      );
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Paper className={classes.paper}>
            <Grid container direction="row" spacing={24} alignItems="center">
              <Grid item xs={12} sm={10}>
                <TextField
                  id="standard-multiline-flexible"
                  style={{ margin: 8 }}
                  label="Search"
                  fullWidth
                  margin="normal"
                  name="searchTerm"
                  onKeyDown={this.keyPress}
                  value={this.state.searchTerm}
                  onChange={this.handleChange('searchTerm')}
                  // variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <Button
                  className={classes.button}
                  id="submitCommentBtn"
                  variant="outlined"
                  onClick={
                    this.state.searchTerm
                      ? this.searchArticles
                      : this.handleClickOpen
                  }>
                  Search
                </Button>
                <Dialog
                  open={this.state.open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description">
                  <DialogTitle id="alert-dialog-slide-title">
                    Woops!
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      You must enter a search term in order to get results back.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Ok
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Paper>
          {this.renderList()}
        </div>
      </div>
    );
  }
}

ArticleList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ArticleList);
