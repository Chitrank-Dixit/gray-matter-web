import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Main from '../components/Main';
import Loader from '../components/Loader';
import Quiz from '../components/Quiz';

import { PATH_BASE, AMOUNT, CATEGORY, DIFFICULTY, TYPE } from '../api';

import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';
import ScreamSkeleton from '../util/ScreamSkeleton';

import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

class test extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          isQuizStart: false,
          API: null,
          countdownTime: null,
          isLoading: false
        };
    
        this.startQuiz = this.startQuiz.bind(this);
        this.backToHome = this.backToHome.bind(this);
    }

    startQuiz(selectedValues) {
    const { category, numOfQ, difficulty, type, time } = selectedValues;

    const API = `${PATH_BASE + AMOUNT + numOfQ}&${CATEGORY +
        category}&${DIFFICULTY + difficulty}&${TYPE + type}`;

    this.setState({ isQuizStart: true, API, countdownTime: time });
    }

    backToHome() {
    this.setState({ isLoading: true });

    setTimeout(() => {
        this.setState({
        isQuizStart: false,
        API: null,
        countdownTime: null,
        isLoading: false
        });
    }, 1000);
    }

    componentDidMount() {
        this.props.getScreams();
    }
    render() {
        const { isQuizStart, API, countdownTime, isLoading } = this.state;
        return (
            <Grid container spacing={16}>
                <Grid item sm={12} xs={12}>
                    <div>
                        <p>This is me</p>
                    </div>
                    <Header />
                    {!isLoading && !isQuizStart && <Main startQuiz={this.startQuiz} />}
                    {!isLoading && isQuizStart && (
                    <Quiz
                        API={API}
                        countdownTime={countdownTime}
                        backToHome={this.backToHome}
                    />
                    )}
                    {isLoading && <Loader />}
                </Grid>
            </Grid>
        )
        
    }
}

test.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getScreams }
)(test);