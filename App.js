import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import Start from './components/Screen1';
import Chat from './components/Screen2';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomActions from './components/CustomActions';

const Stack = createStackNavigator();





export default class App extends React.Component {

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };


  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}