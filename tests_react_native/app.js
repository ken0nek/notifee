/*
 * Copyright (c) 2016-present Invertase Limited
 */

import React, { Component } from 'react';
import { AppRegistry, NativeModules, StyleSheet, Text, View } from 'react-native';

import jet from '@notifee/jet';
import notifee from '@notifee/react-native';
import NativeEventEmitter from '@notifee/react-native/src/NotifeeNativeEventEmitter';

jet.exposeContextProperty('module', notifee);
jet.exposeContextProperty('NativeModules', NativeModules);
jet.exposeContextProperty('NativeEventEmitter', NativeEventEmitter);

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTest: null,
    };

    jet.exposeContextProperty('root', this);
  }

  render() {
    const { currentTest } = this.state;

    if (!currentTest) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <Text style={[styles.item, styles.module]} testID="module">
            {'No Tests Started'}
          </Text>
          <Text style={styles.item} testID="group">
            {'N/A'}
          </Text>
          <Text style={styles.item} testID="title">
            {"Ensure you're running the Jet Packager together with the Detox test command."}
          </Text>
        </View>
      );
    }

    const module = (() => {
      if (currentTest.parent && currentTest.parent.parent) {
        return currentTest.parent.parent.title;
      }
      return currentTest.parent.title;
    })();

    const group = (() => {
      if (currentTest.parent && currentTest.parent.parent) {
        return currentTest.parent.title;
      }
      return '';
    })();

    const retrying = (() => {
      const retry = currentTest.currentRetry();
      if (retry > 0) {
        return `⚠️ Test failed, retrying... (${retry})`;
      }
      return null;
    })();

    return (
      <View style={[styles.container, styles.horizontal]}>
        <Text style={[styles.item, styles.module]} testID="module">
          {module}
        </Text>
        <Text style={styles.item} testID="group">
          {group}
        </Text>
        <Text style={styles.item} testID="title">
          {currentTest.title}
        </Text>
        {retrying && (
          <Text style={[styles.retry, styles.item]} testID="title">
            {retrying}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    marginBottom: 10,
    textAlign: 'center',
  },
  retry: {
    marginTop: 10,
    fontSize: 20,
    color: '#cccc33',
  },
  module: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  group: {
    fontSize: 16,
    color: 'grey',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    width: 135,
  },
});

AppRegistry.registerComponent('testing', () => Root);

function BubbleTest() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bubbling Hell</Text>
    </View>
  );
}

AppRegistry.registerComponent('bubble', () => BubbleTest);
