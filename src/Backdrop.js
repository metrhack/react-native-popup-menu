import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from './constants';

class Backdrop extends Pressable {

  constructor(...args) {
    super(...args);
    this.fadeAnim = new Animated.Value(0.001);
  }

  open() {
    return new Promise(resolve => {
      Animated.timing(this.fadeAnim, {
        duration: OPEN_ANIM_DURATION,
        toValue: 1,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(resolve);
    });
  }

  close() {
    return new Promise(resolve => {
      Animated.timing(this.fadeAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(resolve);
    });
  }

  render() {
    const { onPress, style } = this.props;
    return (
      <Pressable onPress={onPress}>
        <Animated.View style={[styles.fullscreen, { opacity: this.fadeAnim }]}>
          <View style={[styles.fullscreen, style]} />
        </Animated.View>
      </Pressable>
    );
  }

}

const styles = StyleSheet.create({
  fullscreen: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Backdrop;
