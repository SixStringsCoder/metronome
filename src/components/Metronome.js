import React, { Component } from 'react';
import './Metronome.css';
import click1 from './audio/click1.wav';
import click2 from './audio/click2.wav';
import click3 from './audio/click3.wav';
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
      beatsPerMeasure: 4,
      subDivPlaying: false
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
    this.click3 = new Audio(click3);
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
        playing: false,
        subDivPlaying: false,
        count: 0
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
    count > 0 ? this.click1.play() : this.click2.play();

    this.setState(state => ({
      count: (state.count + 1) % state.beatsPerMeasure
    }));
  }

  startStopSubDiv = event => {
    const beat = {
      eighths: (60000 / this.state.bpm) / 2,
      triplets: (60000 / this.state.bpm) / 3,
      sixteenths: (60000 / this.state.bpm) / 4,
    }
    let subDivision = event.target.id;

    if (this.state.subDivPlaying) {
      clearInterval(this.subDivClick);
      this.setState({ subDivPlaying: false });
    } else if (this.state.playing) {
      this.subDivClick = setInterval(this.playSubDClick, beat[subDivision]);
      this.setState({ subDivPlaying: true });
    } else {
      alert("The metronome must be playing to hear subdivions.")
    }
  }

  playSubDClick = () => this.click3.play();

  handleTimeSigSelect = (event) => {
    if (this.state.playing) {
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, 60000 / this.state.bpm);
      this.setState({
        count: 0,
        beatsPerMeasure: parseInt(event.target.value)
      });
    } else {
      this.setState({
        count: 0,
        beatsPerMeasure: parseInt(event.target.value)
      });
    }
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

            <div className="timeSigSelect">
            <label>Beats Per Measure</label>
              <select onChange={this.handleTimeSigSelect}>
                <option value="3">3</option>
                <option value="4" selected>4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            <div id="subDivBtnContainer">
              <a><img onMouseDown={this.startStopSubDiv} className="subDivBtn" id="eighths" src={eighthNotes} /></a>
              <a><img onMouseDown={this.startStopSubDiv} className="subDivBtn" id="triplets" src={tripletNotes} /></a>
              <a><img onMouseDown={this.startStopSubDiv} className="subDivBtn" id="sixteenths" src={sixteenthNotes} /></a>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Metronome;
