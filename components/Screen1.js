import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image, TouchableOpacity, Pressable } from 'react-native';
import BackgroundImage from '../assets/background-image.png';
const icon = require('../assets/icon2.png');

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            bgColor: this.colors.blue
        };
    }
    // function to update set of the cat background chosen by te user
    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    //chat background color choices
    colors = {
        ultimate: '#939597',
        peri: '#6867ab',
        blue: '#2a4d81',
        illuminating: '#f5df4d'
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ImageBackground source={BackgroundImage} resizeMode='cover' style={styles.backgroundImage}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>Chattopia</Text>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.inputBox}>
                            <Image source={icon} style={styles.userIcon} />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder='Your name:' />
                        </View>

                        <View style={styles.colorBox}>
                            <Text style={styles.chooseColor}> Choose Background Color</Text>
                        </View>
                        <View style={styles.colorArray}>
                            <TouchableOpacity
                                style={styles.color1}
                                onPress={() => this.changeBgColor(this.colors.ultimate)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color2}
                                onPress={() => this.changeBgColor(this.colors.peri)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color3}
                                onPress={() => this.changeBgColor(this.colors.blue)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color4}
                                onPress={() => this.changeBgColor(this.colors.illuminating)}>
                            </TouchableOpacity>
                        </View>

                        <Pressable
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Chat', {
                                name: this.state.name,
                                bgColor: this.state.bgColor
                            })}>
                            <Text style={styles.buttonText}>Chat Now</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundImage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleBox: {
        height: '50%',
        width: '88%',
        alignItems: 'center',
        paddingTop: 100
    },

    title: {
        fontSize: 45,
        fontWeight: "600",
        color: '#FFFFFF',
    },

    box: {
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

    inputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: 'grey',
        width: '88%',
        height: 60,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    userIcon: {
        width: 20,
        height: 20,
        marginRight: 10
    },

    input: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 0.5,
    },

    colorBox: {
        alignItems: 'center',
        width: '88%'
    },

    chooseColor: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 1,
    },

    colorArray: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
        paddingRight: 15,
        paddingLeft: 15,
    },

    color1: {
        backgroundColor: '#939597',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color2: {
        backgroundColor: '#6867ab',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color3: {
        backgroundColor: '#2a4d81',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color4: {
        backgroundColor: '#f5df4d',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    button: {
        width: '88%',
        height: 70,
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: "600"
    }
});