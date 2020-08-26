import React from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

class RandomNumber extends React.Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
  };

  handlePress = () => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress} activeOpacity={0.5}>
        <Text
          style={[
            styles.randomNumber,
            this.props.isDisabled && styles.disabled,
          ]}>
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  randomNumber: {
    backgroundColor: '#999',
    width: 100,
    paddingVertical: 5,
    marginHorizontal: 15,
    marginVertical: 20,
    fontSize: 35,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});

export default RandomNumber;
