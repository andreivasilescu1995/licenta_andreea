import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import emitter from 'tiny-emitter/instance';

import api from '../api';

import BraintreeDropIn from 'react-native-braintree-dropin-ui';
import ModalInfo from './ModalInfo';
import ModalConfirmPayment from './ModalConfirmPayment';

export default class Cautare extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selectedDay: null,
            gamesList: [],
            selectedGame: null,
            locationsList: [],
            selectedLocation: null,
            startTime: null,
            endTime: null,
            hours: '1',
            nonce: null,
        }

        this.token = null;
        this.reservationDetails = null;
        this.refModal = React.createRef();
        this.refConfirmPayment = React.createRef();

        // console.log('PROPS CAUTARE: ', props)
    }

    componentDidMount() {
        emitter.on('sendReservation', () => {
            this.sendReservation();
        });
    }

    componentWillUnmount() {
        emitter.off('sendReservation');
    }

    getToken() {
        return new Promise((resolve, reject) => {
            if (this.props.user) {
                api.post('client_token', { id_utilizator: this.props.user.user_id })
                    .then(response => {
                        console.log('RESPONSE TOKEN: ', response.data);
                        this.token = response.data;
                        resolve(response.data);
                    })
            }
            else {
                this.props.navigation.navigate('TabNav', { screen: 'Profil', shouldRedirect: 'Cautare' });
                resolve();
            }
        })
    }

    pay(result) {
        return new Promise((resolve, reject) => {
            api.post('/checkout', { id_utilizator: this.props.user.user_id, id_rezervare: this.reservationDetails[1], ammount: parseInt(this.state.hours), nonce: result.nonce })
                .then(response => {
                    console.log('RESPONSE CHECKOUT: ', response);
                    if (response.data == true) {
                        this.refModal.current.setText('Ati rezervat masa ' + this.reservationDetails[0] + '!');
                        resolve();
                    }
                    else
                        reject(response);
                })
                .catch(error => {
                    alert('EROARE ' + error.message);
                    reject(error);
                })
        })
    }

    showDropIn() {
        return new Promise((resolve, reject) => {
            BraintreeDropIn.show({
                clientToken: this.token, merchantIdentifier: 'g6gppw8kyscrz4yd', googlePayMerchantId: 'googlePayMerchantId', countryCode: 'US', currencyCode: 'USD', merchantName: 'Andreea Steflea', orderTotal: parseInt(this.state.hours),
                googlePay: false,
                applePay: false,
                vaultManager: true,
                cardDisabled: false,
                darkTheme: true,
            })
                .then(result => {
                    console.log('RESULT DROPIN: ', result);
                    // this.setState({ nonce: result.nonce }, () => this.refConfirmPayment.current.toggleModal())
                    this.pay(result).then(result => {
                        resolve();
                    })
                        .catch(error => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    if (error.code === 'USER_CANCELLATION') {
                        this.refModal.current.setText('Operatiunea a fost intrerupta!');
                        api.post('/cancelReservation', { id_rezervare: this.reservationDetails[1] })
                            .then(response => {
                                console.log('RESPONSE CANCEL: ', response.data)
                            })
                    } else {
                        console.log('EROARE AFISARE DROPIN: ', error)
                        if (!this.token)
                            this.getToken();
                        else 
                            alert('EROARE ' + error.message)
                    }
                })
        })
    }

    getLocations() {
        if (this.state.startTime)
            api.post('getLocations', {})
                .then(response => {
                    var locations = [];
                    response.data.map((location, index) => {
                        var label = location[1];
                        var value = location[1].charAt(0) + location[1].charAt(1);
                        var adresa = location[2];
                        var id = location[0];
                        var picker_location = { label: label, value: value, adresa: adresa, id: id };
                        locations.push(picker_location);
                    });
                    this.setState({ locationsList: locations, selectedLocation: locations[0] }, () => {
                        this.getLocationGames();
                    });
                })
        else
            this.refModal.current.setText('Selectati un interval orar!');
    }

    getLocationGames() {
        api.post('getGamesByLocation', { id_locatie: this.state.selectedLocation.id })
            .then(response => {
                // console.log('RESPONSE GET GAMES: ', response);
                var games = [];
                response.data.map((game, index) => {
                    var label = game.nume;
                    var value = index + 1;
                    var id = game.id;
                    var picker_game = { label: label, value: value, id: id };
                    games.push(picker_game);
                });
                this.setState({ gamesList: games });
            })
    }

    onDayPress(day) {
        this.setState({ selectedDay: day.dateString, showTimePicker: true });
    };

    addHours() {
        var date = new Date('01', '01', '2021', this.state.startTime.getHours(), this.state.startTime.getMinutes());
        date.setHours(date.getHours() + parseInt(this.state.hours));
        this.setState({ endTime: date });
    }

    sendReservation() {
        let d_i = new Date(this.state.selectedDay);
        let d_s = new Date(this.state.selectedDay);

        d_s.setHours(this.state.startTime.getHours() + parseInt(this.state.hours));

        d_i = d_i.getFullYear() + '-' + d_i.getUTCMonth() + '-' + d_i.getDate() + ' ' + this.state.startTime.getHours() + ':' + '00';
        d_s = d_s.getFullYear() + '-' + d_s.getUTCMonth() + '-' + d_s.getDate() + ' ' + d_s.getHours() + ':' + '00';

        if (this.props.user)
            api.post('createReservation', {
                id_utilizator: this.props.user.user_id,
                id_locatie: this.state.selectedLocation.id,
                id_joc: this.state.selectedGame.id,
                data_inceput: d_i,
                data_sfarsit: d_s,
            })
                .then(response => {
                    console.log('RESPONSE REZERVARE: ', response)
                    if (response.data == false)
                        this.refModal.current.setText('Nu exista masa disponibila!');
                    else {
                        this.reservationDetails = response.data;
                        if (this.token)
                            this.showDropIn()
                        else
                            this.getToken().then(() => this.showDropIn());
                    }
                })
        else
            this.props.navigation.navigate('TabNav', { screen: 'Profil', shouldRedirect: 'Cautare' });
    }

    endTime() {
        let end = this.state.startTime;
        end.setDate(new Date(this.state.selectedDay).getDate())
        end.getHours() + parseInt(this.state.hours);
        return end;
    }

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                colors={['#3b5998', '#192f6a']}
                style={{ flex: 1, padding: 10 }}>
                <ModalInfo ref={this.refModal} />
                <ModalConfirmPayment
                    ref={this.refConfirmPayment}
                    nonce={this.state.nonce}
                    onConfirm={() => this.pay()}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>Alegeti data si ora rezervarii</Text>

                    <Calendar
                        displayLoadingIndicator
                        horizontal={true}
                        pagingEnabled={true}
                        minDate={Date()}
                        enableSwipeMonths={true}
                        style={{ marginTop: 10 }}
                        theme={{
                            selectedDayBackgroundColor: '#00adf5',
                        }}
                        onDayLongPress={(day) => this.onDayPress(day)}
                        onDayPress={(day) => this.onDayPress(day)}
                        markedDates={{
                            [this.state.selectedDay]: { selected: true, selectedColor: 'orange' }
                        }}
                    />

                    {this.state.selectedDay ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                            <View style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 10 }}>
                                {typeof this.state.startTime == 'object' && this.state.endTime !== null ?
                                    <Text style={{}}>{this.state.startTime.getHours()} - {this.state.endTime.getHours() + parseInt(this.state.hours)}</Text>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ showTimePicker: true })}
                                        style={{}}>
                                        <Text style={{}}>Interval orar</Text>
                                    </TouchableOpacity>
                                }
                                {this.state.showTimePicker ?
                                    <DateTimePicker
                                        value={this.state.startTime ? this.state.startTime : new Date()}
                                        mode={'time'}
                                        is24Hour={true}
                                        minimumDate={new Date()}
                                        display={"default"}
                                        onChange={(time) => {
                                            this.setState({ startTime: time.nativeEvent.timestamp, endTime: time.nativeEvent.timestamp, showTimePicker: false });
                                        }}
                                    />
                                    :
                                    null
                                }
                            </View>
                            <View style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10, backgroundColor: 'white', borderRadius: 10 }}>
                                <TextInput
                                    placeholder={'Numar ore'}
                                    style={{ paddingLeft: 70 }}
                                    value={this.state.hours}
                                    onChangeText={text => this.setState({ hours: text }, () => this.addHours())}
                                    keyboardType={'numeric'}
                                />
                            </View>
                        </View>
                        :
                        null
                    }

                    {this.state.selectedLocation ?
                        <View style={{ height: 40, width: '100%', justifyContent: 'center', backgroundColor: 'white', marginTop: 10, borderRadius: 10 }}>
                            <Picker
                                style={{ width: '100%' }}
                                selectedValue={this.state.selectedLocation}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ selectedLocation: { value: itemValue, id: itemIndex + 1 } }, () => {
                                        this.getLocationGames();
                                    });
                                }}>
                                {this.state.locationsList.map(location => {
                                    return (
                                        <Picker.Item key={location.value} label={location.label} value={location.value} />
                                    )
                                })}
                            </Picker>
                        </View>
                        :
                        null
                    }

                    {this.state.selectedLocation ?
                        <View style={{ height: 40, width: '100%', justifyContent: 'center', backgroundColor: 'white', marginTop: 10, borderRadius: 10 }}>
                            <Picker
                                style={{ width: '100%' }}
                                selectedValue={this.state.selectedGame}
                                onValueChange={(itemValue, itemIndex) => {
                                    // console.log('JOC SELECTAT: ', itemValue, itemIndex);
                                    const index = this.state.gamesList.map(joc => joc.value).indexOf(itemValue);
                                    this.setState({ selectedGame: this.state.gamesList[index] })
                                }}>
                                {this.state.gamesList.map(game => {
                                    return (
                                        <Picker.Item key={game.value} label={game.label} value={game.value} />
                                    )
                                })}
                            </Picker>
                        </View>
                        :
                        null
                    }

                    {this.state.selectedGame ?
                        <TouchableOpacity
                            onPress={() => { this.sendReservation() }}
                            style={{ width: '50%', alignSelf: 'center', backgroundColor: 'green', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                            <Text style={{ fontSize: 15, color: 'white', paddingVertical: 10, paddingHorizontal: 20 }}>Rezerva acum</Text>
                        </TouchableOpacity>
                        :
                        this.state.selectedDay ?
                            <TouchableOpacity
                                onPress={() => { this.getLocations() }}
                                style={{ width: '50%', alignSelf: 'center', backgroundColor: 'green', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                                <Text style={{ fontSize: 15, color: 'white', paddingVertical: 10, paddingHorizontal: 20 }}>Cauta locatii</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
            </LinearGradient >
        )
    }
}