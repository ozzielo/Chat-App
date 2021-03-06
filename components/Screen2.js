import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet, Button } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCsRsTaNiv1LAmw8CHlu4LMCfIdmm7xKC0",
    authDomain: "chat-app-a62eb.firebaseapp.com",
    projectId: "chat-app-a62eb",
    storageBucket: "chat-app-a62eb.appspot.com",
    messagingSenderId: "979063835142",
    appId: "1:979063835142:web:b893eb74cb273ae8a3d187",
    measurementId: "G-EC97ZTJ9NN"
};


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
                image: null,
                location: null
            },
            isConnected: false
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
    }



    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');

                this.setState({ isConnected: true });

                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);

                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any',
                        }
                    });
                });
                const systemMsg = {
                    _id: `sys-${Math.floor(Math.random() * 100000)}`,
                    text: `${name} has entered Chatter`,
                    createdAt: new Date(),
                    system: true
                }

                this.referenceChatMessages.add(systemMsg)

                this.saveMessages();


            } else {
                console.log('offline');

                this.setState({ isConnected: false });
                this.getMessages();
            }
        });

    }

    addMessage() {
        const message = this.state.messages[0];
        // add a new message to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }

    onSend(messages = []) {
        this.setState(
            previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessage();
                this.saveMessages();
            }
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    //to access CustomActions
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };


    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                system: data.system,
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages: messages,
        });
        this.saveMessages()
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    render() {
        // entered name state from Start screen gets displayed in status bar at the top of the app
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name })

        let bgColor = this.props.route.params.bgColor;

        return (
            <View style={styles.container}>
                <View style={{ ...styles.container, backgroundColor: bgColor ? bgColor : '#FFF' }}  >
                    <GiftedChat
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={this.state.user}
                        renderActions={this.renderCustomActions}
                        renderCustomView={this.renderCustomView}
                    />
                    {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                    }
                </View>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },



})
