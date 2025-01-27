import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from './constants';

class Backdrop extends Component {

  constructor(...args) {
    super(...args);
    this.fadeAnim = new Animated.Value(0.001);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.contextMenuEvent = null;
  }

  componentWillUnmount() {
    // this event will only ever be thrown on web
    if (this.contextMenuEvent) {
      const event = this.contextMenuEvent;
      const { clientX, clientY } = event;

      // Use setTimeout to delay the execution of the code
      setTimeout(() => {
        let targetElement = document.elementFromPoint(clientX, clientY);

        if (targetElement) {
          targetElement.dispatchEvent(event);
        }

        this.contextMenuEvent = null;
      }, 0);
    }
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

  onContextMenu(e) {
    // on context menu is only supported on web
    e.preventDefault();
    e.stopPropagation();
    this.props.onPress();

    // Create a new event to bubble up
    this.contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
      button: e.button,
      buttons: e.buttons,
      relatedTarget: e.relatedTarget,
      screenX: e.screenX,
      screenY: e.screenY,
    });

    // hide the backdrop element so we can bubble the event correctly
    const backdropEl = e.target.parentElement;
    backdropEl.style.pointerEvents = 'none';
  }

  render() {
    const { onPress, style } = this.props;
    return (
      <Pressable style={[ styles.fullscreen, styles.noCursor ]} onPress={onPress} onContextMenu={this.onContextMenu}>
        <Animated.View style={[styles.fullscreen, styles.initialOpacity, { opacity: this.fadeAnim }]}>
          <View style={[styles.fullscreen, styles.initialOpacity, style]} />
        </Animated.View>
      </Pressable>
    );
  }

}

Backdrop.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  initialOpacity: {
    opacity: 0,
    pointerEvents: 'none'
  },
  noCursor: {
    cursor: 'auto'
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Backdrop;
