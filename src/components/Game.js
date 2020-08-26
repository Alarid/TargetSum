import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import RandomNumber from './RandomNumber';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = 'PLAYING';

  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  // TODO shuffle random numbers

  componentDidMount() {
    this.countdown = setInterval(() => {
      this.setState(
        (prevState) => ({
          remainingSeconds: prevState.remainingSeconds - 1,
        }),
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.countdown);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.countdown);
      }
    }
  }

  isNumberSelected = (idx) => this.state.selectedIds.indexOf(idx) >= 0;

  selectNumber = (idx) => {
    this.setState((state) => ({
      selectedIds: [...state.selectedIds, idx],
    }));
  };

  calcGameStatus = (nextState) => {
    console.log('calcGameStatus');
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.randomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    return 'LOST';
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>

        <View style={styles.randomNumerContainer}>
          {this.randomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>

        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 50,
    margin: 40,
    backgroundColor: '#bbb',
    textAlign: 'center',
  },
  randomNumerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
