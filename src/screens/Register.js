import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import api from '../api';

import EvilIcons from "react-native-vector-icons/EvilIcons";
import FoundationIcons from "react-native-vector-icons/Foundation";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

export const Register = (props) => {
    const [username, setUsername] = React.useState('test12');
    const [parola, setParola] = React.useState('1234');
    const [nume, setNume] = React.useState('test1');
    const [email, setEmail] = React.useState('test1@test.com');
    const [cnp, setCnp] = React.useState('1234567891234');
    const [adresa, setAdresa] = React.useState('test1');
    const [telefon, setTelefon] = React.useState('0737092953');

    const [progress, setProgress] = React.useState(0);
    const [warning, setWarning] = React.useState(null);
    const refScrollView = React.createRef();

    const register = () => {
        api.post('register', { nume, username, parola, email, cnp, adresa, telefon })
            .then(result => {
                if (result.data == true) {
                    setProgress('succes');
                }
                else
                    if (result.data == false)
                        alert('Inregistrare esuata!');
            })
            .catch(error => {
                alert('Eroare inregistrare: ', JSON.stringify(error));
            })
    }

    const DoneRegistering = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <AntDesignIcons name={'check'} size={80} color={'green'} />
                <Text style={{}}>Inregistrare cu succes!</Text>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={
                        ['#3CDE87', '#C49C0F']
                    }
                    style={{ marginTop: 30, marginBottom: 15, borderRadius: 20 }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 }}
                        onPress={() => { props.navigation.navigate('Profil') }}>
                        <Text style={{ fontSize: 13, fontFamily: 'OpenSans-Regular', color: '#fff', marginRight: 15 }}>Login</Text>
                        <AntDesignIcons name={'arrowright'} style={{ top: 2 }} color='#fff' />
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }

    const WarningMessage = () => {
        return (
            warning != null &&
            <Animatable.View useNativeDriver={true} animation={warning != null ? 'bounceInLeft' : 'bounceOutRight'} style={{ marginTop: 30, marginHorizontal: 10 }}>
                <View style={{ padding: 20 }}>
                    <TouchableOpacity onPress={() => setWarning(null)}>
                        <EvilIcons name="close" color="white" size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans-Regular', marginLeft: 30, color: "white" }}>{warning}</Text>
                </View>
            </Animatable.View>
        )
    }

    const checkRegisterFields = () => {
        if (username != null && parola != null && nume != null && email != null && cnp != null && adresa != null && telefon != null) {
            if (cnp.length != 13) {
                setWarning('CNP invalid');
                return false;
            }
            if (!email.includes('@')) {
                setWarning('Email invalid');
                return false;
            }
            if (telefon.toString().substring(0, 2) != "07" || telefon.toString().length < 10) {
                setWarning('Numar de telefon invalid');
                return false;
            }
            return true;
        }
        else {
            setWarning('Completati toate campurile!');
            return false;
        }
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            colors={['#3b5998', '#192f6a']}
            style={{ flex: 1 }}>

            <ScrollView ref={refScrollView} contentContainerStyle={{ alignItems: 'center', padding: 10 }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 15, left: 15 }}
                    onPress={() => {
                        if (progress > 0 && progress != 'done')
                            setProgress(progress - 1);
                        else
                            props.navigation.goBack()
                    }}>
                    <EntypoIcons name={'chevron-left'} color='#fff' size={30} />
                    <Text style={{ fontSize: 15, color: '#fff' }}>Inregistrare</Text>
                </TouchableOpacity>

                {progress != 'done' ?
                    <>
                        {progress == 0 &&
                            <Animatable.View useNativeDriver={true} animation={progress == 0 ? 'fadeInLeft' : 'fadeOutRight'} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                <View style={{ width: '100%' }}>
                                    <TextInput
                                        placeholder={'Nume'}
                                        placeholderTextColor={'#fff'}
                                        autoCompleteType={'username'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        value={username}
                                        onChangeText={text => setUsername(text)}
                                    />
                                    <EvilIcons style={{ position: 'absolute', top: 8, left: 8 }} name="user" color="white" size={40} />
                                </View>

                                <View style={{ width: '100%', marginTop: 30 }}>
                                    <TextInput
                                        placeholder={'Parola'}
                                        placeholderTextColor={'#fff'}
                                        autoCompleteType={'password'}
                                        secureTextEntry={true}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        onChangeText={text => setParola(text)}
                                        value={parola}
                                    />
                                    <FoundationIcons style={{ position: 'absolute', top: 8, left: 15 }} name="key" color="white" size={30} />
                                </View>
                            </Animatable.View>
                        }

                        {progress == 1 &&
                            <Animatable.View useNativeDriver={true} animation={progress == 1 ? 'fadeInLeft' : 'fadeOutRight'} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                <View style={{ width: '100%' }}>
                                    <TextInput
                                        placeholder={'Nume'}
                                        placeholderTextColor={'#fff'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        value={nume}
                                        onChangeText={text => setNume(text)}
                                    />
                                    <EvilIcons style={{ position: 'absolute', left: 8, top: 12 }} name="user" color="white" size={30} />
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <TextInput
                                        placeholder={'Email'}
                                        placeholderTextColor={'#fff'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        value={email}
                                        onChangeText={text => setEmail(text)}
                                    />
                                    <EntypoIcons style={{ position: 'absolute', left: 10, top: 14 }} name="email" color="white" size={20} />
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <TextInput
                                        placeholder={'cnp'}
                                        placeholderTextColor={'#fff'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        value={cnp}
                                        onChangeText={text => setCnp(text)}
                                        keyboardType={'number-pad'}
                                    />
                                    <FontAwesomeIcons style={{ position: 'absolute', left: 10, top: 14 }} name="id-card" color="white" size={20} />
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <TextInput
                                        placeholder={'Adresa'}
                                        placeholderTextColor={'#fff'}
                                        multiline={true}
                                        autoCompleteType={'street-address'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        onChangeText={text => setAdresa(text)}
                                        value={adresa}
                                    />
                                    <EntypoIcons style={{ position: 'absolute', left: 12, top: 14 }} name="address" color="white" size={20} />
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    <TextInput
                                        placeholder={'Telefon'}
                                        placeholderTextColor={'#fff'}
                                        autoCompleteType={'tel'}
                                        style={{ width: '100%', paddingLeft: 50, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#fff', borderRadius: 20, color: '#fff' }}
                                        onChangeText={text => setTelefon(text)}
                                        value={telefon}
                                        keyboardType={'phone-pad'}
                                    />
                                    <EntypoIcons style={{ position: 'absolute', left: 12, top: 14 }} name="old-phone" color="white" size={20} />
                                </View>
                            </Animatable.View>
                        }
                    </>
                    :
                    progress == 'succes' ?
                        null
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator style={{ color: '#ffd101', width: 50 }} />
                        </View>}

                {warning != null ?
                    <WarningMessage />
                    :
                    null
                }

                {progress != 'succes' ?
                    progress != 'done' ?
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={
                                ['#3CDE87', '#C49C0F']
                            }
                            style={{ marginTop: 30, marginBottom: 15, borderRadius: 20 }}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 }}
                                onPress={() => {
                                    if (progress == 1) {
                                        if (checkRegisterFields()) {
                                            register()
                                            setWarning(null)
                                        }
                                    }
                                    else
                                        setProgress(progress + 1)
                                }}>
                                <Text style={{ color: '#fff', marginRight: 15 }}>{progress == 1 ? 'Finalizeaza' : 'Mai departe'}</Text>
                                <AntDesignIcons name={'arrowright'} style={{ top: 2 }} color='#fff' />
                            </TouchableOpacity>
                        </LinearGradient>
                        :
                        null
                    :
                    <DoneRegistering />
                }
            </ScrollView>
        </LinearGradient >
    )
}