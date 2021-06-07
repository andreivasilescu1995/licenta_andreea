import React from 'react'
import { View, Text, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import emitter from 'tiny-emitter/instance';

import api from '../api';

export default class Rezervari extends React.Component {
    constructor(props) {
        super();
        this.state = {
            reservations: null,
            loading: false,
        }

        console.log('PROPS REZERVARI: ', props);
    }

    componentDidMount() {
        this.getMyReservations();
        emitter.on('refreshReservations', () => { this.getMyReservations() })
    }

    componentWillUnmount() {
        emitter.off('refreshReservations');
    }

    getMyReservations() {
        if (this.props?.user)
            api.post('/getUserReservations', { user_id: this.props.user.user_id })
                .then(response => {
                    console.log('RESPONSE USER RESERVATIONS: ', response);
                    this.setState({ reservations: response.data });
                })
        else {
            this.props.navigation.navigate('TabNav', { screen: 'Profil', shouldRedirect: 'Rezervari' });
        }
    }

    renderReservations() {
        return (
            <FlatList
                data={this.state.reservations}
                style={{ flex: 1 }}
                onRefresh={() => this.getMyReservations()}
                refreshing={this.state.loading}
                ListHeaderComponent={<Text style={{ fontSize: 20, color: '#fff', margin: 20 }}>Rezervari</Text>}
                keyExtractor={(reservation, index) => index.toString()}
                renderItem={reservation => {
                    return (
                        <View style={{ flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 10, marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', color: '#fff', flexWrap: 'wrap', textTransform: 'uppercase' }}>Data: {reservation.item.data_inceput} - {reservation.item.data_sfarsit}</Text>
                            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: 'bold' }}>Locatie: </Text>{reservation.item.locatie}</Text>
                            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: 'bold' }}>Masa: </Text> {reservation.item.masa}</Text>
                            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: 'bold' }}>Joc: </Text> {reservation.item.joc}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Status:</Text>
                                {reservation.item.status == 0 ?
                                    <View style={{ backgroundColor: 'green', paddingVertical: 3, paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                                        <Text style={{ color: '#fff' }}>Creeata</Text>
                                    </View>
                                    :
                                    reservation.item.status == 1 ?
                                        <View style={{ backgroundColor: 'green', paddingVertical: 3, paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                                            <Text style={{ color: '#fff' }}>Platita</Text>
                                        </View>
                                        :
                                        <View style={{ backgroundColor: 'red', paddingVertical: 3, paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                                            <Text style={{ color: '#fff' }}>Anulata</Text>
                                        </View>
                                }
                            </View>
                        </View>
                    )
                }}
            />
        )
    }

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                colors={['#3b5998', '#192f6a']}
                style={{ flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                {this.renderReservations()}
            </LinearGradient>
        )
    }
}