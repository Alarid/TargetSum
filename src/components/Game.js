import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Icon} from 'react-native-elements';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
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

  shuffledRandomNumbers = shuffle(this.randomNumbers);

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
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
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
        <View style={styles.targetContainer}>
          <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
            {this.target}
          </Text>
        </View>

        <View style={styles.randomNumerContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
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

        <View style={styles.timerContainer}>
          <Icon name="timer" />
          <Text style={styles.timer}>{this.state.remainingSeconds}</Text>
        </View>

        <View style={styles.playAgain}>
          {this.gameStatus !== 'PLAYING' && (
            <Button title="Play again" onPress={this.props.onPlayAgain} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    justifyContent: 'space-between',
  },
  targetContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
  },
  target: {
    fontSize: 50,
    marginHorizontal: 40,
    backgroundColor: '#bbb',
    textAlign: 'center',
  },
  randomNumerContainer: {
    flex: 3,
    paddingTop: 10,
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
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timer: {
    fontSize: 30,
    marginLeft: 5,
  },
  playAgain: {
    flex: 1,
    marginHorizontal: 40,
  },
});

export default Game;
