import React, { Component } from 'react';
import './Metronome.css';
import click1 from './audio/click1.wav';
import click2 from './audio/click2.wav';
import eighthNotes from './graphics/eighths.png';
import tripletNotes from './graphics/triplets.png';
import sixteenthNotes from './graphics/sixteenths.png';

class Metronome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpm: 100,
      playing: false,
      count: 0,
      beatsPerMeasure: 4
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  handleBpmChange = event => {
    if (this.state.playing) {
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, 60000 / this.state.bpm);
      this.setState({
        count: 0,
        bpm: event.target.value
      });
    } else {
      this.setState({ bpm: event.target.value });
    }
  };

  startStop = () => {
    if (this.state.playing) {
      clearInterval(this.timer);
      this.setState({
        playing: false
      })
    } else {
      this.timer = setInterval(this.playClick, 60000 / this.state.bpm);
      this.setState(
        {
          playing: true,
          count: 0
        },
        this.playClick)
    }
  };

  playClick = () => {
    const {count, beatsPerMeasure} = this.state;
    // Put accented beat on 1 and softer beat on other beats
    count > 0 ? this.click1.play()
    :
    this.click2.play();

    this.setState(state => ({
      count: (state.count + 1) % state.beatsPerMeasure
    }));
  }


  render() {
    const { bpm, playing } = this.state;

    return (
      <main>
        <header><h1>ACME TIME MACHINE</h1></header>
        <section>
          <div className="metronome">
            <div className="bpm-slider">
              <input onChange={this.handleBpmChange}
                className="slider"
                type="range"
                min="50" max="256"
                value={bpm} />
            </div>
            <div id="bpmLabel">{bpm} BPM</div>
            <button onMouseDown={this.startStop} id="playBtn">{playing ? 'Stop' : 'Play'}</button>
            <div id="subDivBtnContainer">
              <a><img className="subDivBtn" id="eighths" src={eighthNotes} /></a>
              <a><img className="subDivBtn" id="triplets" src={tripletNotes} /></a>
              <a><img className="subDivBtn" id="sixteenths" src={sixteenthNotes} /></a>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Metronome;
