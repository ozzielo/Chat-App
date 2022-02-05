import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

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
            },
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
    }



    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                firebase.auth().signInAnonymously();
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
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });

        // this.setState({
        //     messages: [
        //         {
        //             _id: 1,
        //             text: 'Hello developer',
        //             createdAt: new Date(),
        //             user: {
        //                 _id: 2,
        //                 name: 'React Native',
        //                 avatar: 'https://placeimg.com/140/140/any',
        //             },
        //         },
        //         {
        //             _id: 2,
        //             text: name + ' has entered the chat',
        //             createdAt: new Date(),
        //             system: true,
        //         },
        //     ],
        // })
    }

    addMessage() {
        const message = this.state.messages[0];
        // add a new message to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,
        });
    }

    onSend(messages = []) {
        this.setState(
            previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessage();
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
                user: data.user
            });
        });
        this.setState({
            messages: messages,
        });
    };

    render() {
        // entered name state from Start screen gets displayed in status bar at the top of the app
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name })

        let bgColor = this.props.route.params.bgColor;

        return (
            <View style={styles.container}>
                <View style={{ ...styles.container, backgroundColor: bgColor ? bgColor : '#FFF' }}  >
                    <GiftedChat
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={this.state.user}
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
