import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import emitter from 'tiny-emitter/instance';

import AntIcon from "react-native-vector-icons/EvilIcons";
import Foundation from "react-native-vector-icons/Foundation";
import UserLogged from '../img/userLogged.svg';

import api from '../api';
import ModalInfo from './ModalInfo';

export default class Profil extends React.Component {
    constructor(props) {
        super();
        // console.log('PROPS PROFIL: ', props);
    }

    render() {
        return (
            this.props.user ?
                <User user={this.props.user} {...this.props} />
                :
                <Login navigation={this.props.navigation} {...this.props} />
        )
    }
}

class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: 'andrei',
            password: '1234',
            loading: false,
        }
        this.refModal = React.createRef();
        // console.log('PROPS LOGIN: ', props)
    }

    checkLogin = () => {
        this.setState({ loading: true });
        api.post('login', { username: this.state.username, password: this.state.password })
            .then(result => {
                // console.log('RESPONSE LOGIN: ', result)
                if (result.data == false)
                    this.refModal.current.setText('Nume sau parola gresita!');
                else {
                    emitter.emit('login', { username: this.state.username, user_id: result.data[1] });
                    if (this.props.route.params?.shouldRedirect) {
                        this.props.navigation.navigate('TabNav', { screen: this.props.route.params.shouldRedirect });
                        if (this.props.route.params.shouldRedirect == 'Rezervari') {
                            emitter.emit('refreshReservations');
                        }
                        else if (this.props.route.params.shouldRedirect == 'Cautare') {
                            emitter.emit('sendReservation');
                        }
                    }
                }
            })
            .catch(error => {
                console.error(error);
                alert('Eroare autentificare: ' + JSON.stringify(error.message));
            })
            .finally(() => {
                setTimeout(() => this.setState({ loading: false }), 1000);
            })
    }

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                colors={['#3b5998', '#192f6a']}
                style={{ flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>

                <ModalInfo ref={this.refModal} />

                {this.state.loading ?
                    <ActivityIndicator style={{ color: '#00FF00	', alignSelf: 'center', width: 30 }} size={30} />
                    :
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                autoCompleteType={'username'}
                                style={{ color: '#fff', paddingLeft: 50, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 0.5, borderColor: 'black', elevation: 5, marginBottom: 20 }}
                                value={this.state.username}
                                onChangeText={text => this.setState({ username: text })}
                            />
                            <AntIcon style={{ position: 'absolute', top: 10, left: 10 }} name="user" color="white" size={30} />
                        </View>

                        <View style={{ width: '100%' }}>
                            <TextInput
                                autoCompleteType={'password'}
                                secureTextEntry={true}
                                style={{ color: '#fff', paddingLeft: 50, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 0.5, borderColor: 'black', elevation: 5 }}
                                onChangeText={text => this.setState({ password: text })}
                                value={this.state.password}
                            />
                            <Foundation style={{ position: 'absolute', top: 14, left: 15 }} name="key" color="white" size={20} />
                        </View>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={
                                ['#3CDE87', '#C49C0F']
                            }
                            style={{ width: '40%', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 10, marginTop: 20, borderRadius: 20 }}>
                            <TouchableOpacity
                                style={{ textAlign: 'center' }}
                                onPress={() => { this.checkLogin() }}>
                                <Text style={{ color: '#fff' }}>Autentificare</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={
                                ['#3CDE87', '#C49C0F']
                            }
                            style={{ width: '40%', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 10, marginTop: 20, borderRadius: 20 }}>
                            <TouchableOpacity
                                style={{}}
                                onPress={() => { this.props.navigation.navigate('Register') }}>
                                <Text style={{ color: '#fff' }}>Inregistreaza-te</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                }
            </LinearGradient>
        )
    }
}

class User extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            reservations: null,
        }
        // console.log('PROPS USER: ', props);
    }

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                colors={['#3b5998', '#192f6a']}
                style={{ flex: 1, padding: 10 }}>

                {this.state.loading ?
                    <ActivityIndicator style={{ color: '#00FF00	', alignSelf: 'center', width: 30 }} size={30} />
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: this.state.reservations ? 0 : 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                <UserLogged style={{ marginBottom: 10 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignItems: 'center', paddingVertical: 5, paddingHorizontal: 15, borderWidth: 1, borderRadius: 20, borderColor: '#fff', marginBottom: 20 }}>
                                    <Text style={{ color: '#fff' }}>{this.props.user.username}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { emitter.emit('logout') }}
                                    style={{ alignItems: 'center', paddingVertical: 5, paddingHorizontal: 15, borderWidth: 1, borderRadius: 20, borderColor: '#fff', marginBottom: 20 }}>
                                    <Text style={{ color: '#fff' }}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </LinearGradient>
        )
    }
}