import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReactDOM from 'react-dom';
import './assets/index.css';
import cx from "classnames";
import {Link} from "react-router-dom";

import './quiz'


class LetterBar extends React.Component {

    render() {

        let alphas = [];
        for (var i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
            let x = String.fromCharCode(i);
            if (x === this.props.curLetter) {
                alphas.push(
                    <a onClick={() => this.props.setLetter(x)} style={{fontSize: '25px'}}> <u>{x}</u> </a>
                );
            } else {
                alphas.push(
                    <a onClick={() => this.props.setLetter(x)} style={{fontSize: '25px'}}> {x} </a>
                );
            }
        }

        return (
            <div className={cx('letterbar-container')}>
                <Container>
                    <Row>
                        <div style={{fontSize: '15px'}}> Select one of the letters to search for artists:</div>
                        <div style={{textAlign: 'center'}}>{alphas}</div>
                    </Row>
                </Container>
            </div>
        )
    }

}

class ArtistsContainer extends React.Component {


    render() {

        let rows = [];
        for (let i = 0; i < this.props.bands.length; i++) {
            let name = this.props.bands[i];
            rows.push(<Link to={"/quiz/" + name}><a onClick={() => this.props.setBand(name)}>{name}<br/></a></Link>)
        }

        return (
            <div className={cx('artists-container')}>
                <div style={{textAlign: 'center', fontSize: '20px'}}>{rows}</div>
            </div>
        )

    }

}

export class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            letter: '',
            band: '',
            bandList: []
        };
    }

    setLetter(x) {
        this.setState({
            letter: x
        });
        fetch("http://localhost:5000/artists/" + x, {"method": "GET"})
            .then(response => response.json())
            .then(response => this.setState({bandList: response.artists}))
            .catch(error => console.log(error));
    }

    setBand(x) {
        console.log(x);
        this.setState({
            band: x
        })
    }

    render() {

        let arts = <ArtistsContainer
                setBand={x => this.setBand(x)}
                curLetter={this.state.letter}
                bands={this.state.bandList}
            />;

        return (
            <div className={cx('quiz-screen-container')}>
                <Container fluid>
                    <Row style={{padding: "2%", height: '15vh'}}>
                        <h1>The Lyrics Game</h1>
                        <h3><i>We give you the lyrics, and you choose the correct song.</i></h3>
                    </Row>
                    <Row>
                        <LetterBar
                            setLetter={x => this.setLetter(x)}
                            curLetter={this.state.letter}
                        />
                    </Row>
                    <Row>
                        {arts}
                    </Row>
                </Container>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Menu/>, document.getElementById("root"));
