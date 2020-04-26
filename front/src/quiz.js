import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import './assets/index.css';
import cx from "classnames";
import {Link} from "react-router-dom";

import './menu'

function ChoiceButton(props) {

    let cls = 'button';
    if (props.selected) {
        cls = 'selected_button'
    }

    return (
        <button
            className={cx(cls)}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );

}

function ConfirmButton(props) {
    return (
        <button
            className={cx('confirm_button')}
            onClick={props.onClick}
        >
            Confirm Answer
        </button>
    );
}

function InvisibleButton(props) {
    return (
        <button
            className={cx('invisible_button')}
        >

        </button>
    );
}

class Board extends React.Component {

    renderButton(x) {
        return (
            <ChoiceButton
                key={x.uniqueId}
                value={x}
                onClick={() => this.props.onClick(x)}
                selected={x === this.props.choice}
            />
        );
    }

    render() {

        let items = [];
        for (const v of this.props.songs) {
            items.push(<Row> {this.renderButton(v)} </Row>)
        }

        let confirmButton = '';
        if (this.props.showConfirm) {
            confirmButton = <Row>
                <ConfirmButton
                    onClick={this.props.confirmFunc}
                />
            </Row>
        } else {
            confirmButton = <Row>
                <InvisibleButton/>
            </Row>
        }

        let lyricsBox = (<Row>
            {this.props.lyrics.split('\n').map((item, i) => {
                return <p>{item}</p>;
            })}
        </Row>);

        return (
            <div>
                <Container fluid>
                    {lyricsBox}
                    {items}
                    {confirmButton}
                </Container>
            </div>
        );
    }

}

class AnswerScreen extends React.Component {

    render() {

        let text = '';
        if (this.props.isCorrect) {
            text = 'Good Job!'
        } else {
            text = 'Unlucky...'
        }

        return (
            <div>
                <h1> {text} </h1>
                <br/>
                <p> Lyrics was: {this.props.lyrics}</p>
                <p> You chose: {this.props.plaOption}</p>
                <p> Correct answer was: {this.props.corOption}</p>
                <button
                    className={cx('confirm_button')}
                    onClick={this.props.continueAction}
                >
                    Continue
                </button>
            </div>
        );
    }

}

class ResultScreen extends React.Component {

    render() {

        let btn = '';
        if (this.props.started) {
            btn = <button
                className={cx('confirm_button')}
                style={{backgroundColor: "darkblue"}}
            >
                Waiting...
            </button>
        } else {
            btn = <button
                className={cx('confirm_button')}
                onClick={() => this.props.continueAction()}
            >
                Try Again
            </button>
        }

        return (
            <div>
                <h1> Done. </h1>
                <h2> You got {this.props.cor} out of {this.props.tot}.</h2>
                <br/>
                <Container fluid>
                    <Row>
                        {btn}

                        <Link to="/">
                            <button
                                className={cx('confirm_button')}
                            >
                                Menu
                            </button>
                        </Link>
                    </Row>
                </Container>
            </div>
        );
    }

}

class StartScreen extends React.Component {

    render() {

        let btn = '';
        if (this.props.started) {
            btn = <button
                className={cx('confirm_button')}
                style={{backgroundColor: "darkblue"}}
            >
                Waiting...
            </button>
        } else {
            btn = <button
                className={cx('confirm_button')}
                onClick={() => this.props.continueAction()}
            >
                Start
            </button>
        }

        return (
            <div>
                <h1> Start The Quiz. </h1>
                <Container fluid>
                    <Row>
                        {btn}

                        <Link to="/">
                            <button
                                className={cx('confirm_button')}
                            >
                                Menu
                            </button>
                        </Link>
                    </Row>
                </Container>
            </div>
        );
    }

}

class TopBar extends React.Component {

    render() {
        return (
            <div className={cx('banner_container')}>
                <Container>
                    <Row>
                        <div style={{textAlign: 'left'}}>
                            Band: {this.props.band} <br/>
                            Current score: {this.props.score} out of {this.props.curr} <br/>
                            Question: {this.props.curr} of {this.props.tot}
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }

}

export class Quiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            choice: '',
            selected: false,
            confirmed: false,
            gameFinished: false,
            lastCorrect: false,
            started: false,
            pressed: false,
            questions: [],
            qnum: 0,
            qans: 0,
            tot: 5,
            corrects: 0,
            band: ''
        };
    }

    componentDidMount() {
        const {artist} = this.props.match.params;
        this.setState({
           band: artist
        });
    }

    resetState() {
        this.setState({
            pressed: true,
        });
        fetch("http://localhost:5000/questions/" + this.state.band, {"method": "GET"})
            .then(response => response.json())
            .then(response => {
                this.setState({
                    choice: '',
                    selected: false,
                    confirmed: false,
                    gameFinished: false,
                    lastCorrect: false,
                    pressed: false,
                    started: true,
                    questions: response.questions,
                    qnum: 0,
                    qans: 0,
                    tot: response.count,
                    corrects: 0
                });
            })
            .catch(error => console.log(error))
    }

    handleSelection(x) {
        this.setState({
            choice: x,
            selected: true,
        });
    }

    confirmAction() {
        let isCorrect = this.state.choice === this.state.questions[this.state.qnum].correct;
        this.setState({
            confirmed: true,
            lastCorrect: isCorrect,
            corrects: this.state.corrects + isCorrect,
            qans: this.state.qans + 1
        })
    }

    continueAction() {
        let gameEnd = this.state.qnum + 1 === this.state.tot;
        this.setState({
            choice: '',
            gameFinished: gameEnd,
            qnum: this.state.qnum + 1,
            selected: false,
            confirmed: false,
        });
    }

    render() {

        let i = this.state.qnum;
        let scr = '';

        if (this.state.started) {
            if (this.state.gameFinished) {
                scr = (
                    <ResultScreen
                        tot={this.state.tot}
                        cor={this.state.corrects}
                        continueAction={() => this.resetState()}
                        started={this.state.pressed}
                    />
                )
            } else if (this.state.confirmed) {
                scr = (
                    <AnswerScreen
                        isCorrect={this.state.lastCorrect}
                        lyrics={this.state.questions[i].lyrics}
                        plaOption={this.state.choice}
                        corOption={this.state.questions[i].correct}
                        continueAction={() => this.continueAction()}
                    />
                );
            } else {
                scr = (
                    <Board
                        lyrics={this.state.questions[i].lyrics}
                        songs={this.state.questions[i].options}
                        showConfirm={this.state.selected}
                        onClick={k => this.handleSelection(k)}
                        confirmFunc={() => this.confirmAction()}
                        choice={this.state.choice}
                    />
                );
            }
        } else {
            scr = (
                <StartScreen
                    continueAction={() => this.resetState()}
                    started={this.state.pressed}
                />
            )
        }

        let bar = (
            <TopBar
                band={this.state.band}
                score={this.state.corrects}
                curr={this.state.qans}
                tot={this.state.tot}
            />
        );

        return (
            <div className={cx('quiz-screen-container')}>
                <Container fluid>
                    <Row>
                        {bar}
                    </Row>
                    <Row>
                        <div className={cx('quiz-container')}>
                            {scr}
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }
}
