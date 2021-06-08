import 'react-native-gesture-handler';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import emitter from 'tiny-emitter/instance';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Cautare from './screens/Cautare';
import Profil from './screens/Profil';
import { Register } from './screens/Register';
import Rezervari from './screens/Rezervari';

import Icon from 'react-native-vector-icons/Feather';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const navigationRef = React.createRef();

export default class AppNavigation extends React.Component {
    constructor(props) {
        super();
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        emitter.on('login', (user) => {
            this.setState({ user: { username: user.username, user_id: user.user_id } });
        })

        emitter.on('logout', () => {
            this.setState({ user: null });
        })
    }

    componentWillUnmount() {
        emitter.off('login');
        emitter.off('logout');
    }

    render() {
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator headerMode='none' initialRouteName={'TabNav'}>
                    <Stack.Screen name="TabNav">{props => <TabNav {...props} user={this.state.user} />}</Stack.Screen>
                    <Stack.Screen name="Register">{props => <Register {...props} />}</Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

function TabNav(props) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#f0edf6"
            inactiveColor="#0800ff"
            barStyle={{ backgroundColor: '#3688ff' }}>
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <Icon
                                name={'search'}
                                size={20}
                                color={focused ? '#fff' : '#0800ff'}
                            />
                        );
                    },
                }}
                name="Cautare">
                {() => <Cautare {...props} />}
            </Tab.Screen>
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <Icon
                                name={'user'}
                                size={20}
                                color={focused ? '#fff' : '#0800ff'}
                            />
                        );
                    },
                }}
                name="Profil">
                {() => <Profil {...props} />}
            </Tab.Screen>
            <Tab.Screen
                listeners={{
                    tabPress: e => {
                        e.preventDefault();
                        if (props.user) {
                            props.navigation.navigate('Rezervari');
                        }
                        else {
                            props.navigation.navigate('Profil');
                        }
                    },
                }}
                options={{
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <Icon
                                name={'list'}
                                size={20}
                                color={focused ? '#fff' : '#0800ff'}
                            />
                        );
                    },
                }}
                name="Rezervari">{() => <Rezervari {...props} />}</Tab.Screen>
        </Tab.Navigator>
    )
}