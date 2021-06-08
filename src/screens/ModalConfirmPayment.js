import React, { Component } from "react";
import { Modal, Text, View, Pressable } from "react-native";

export default class ModalInfo extends Component {
    constructor(props) {
        super();
        this.state = {
            modalVisible: false,
            text: null,
            nonce: props.nonce,
        }
        console.log('MODAL PAYMENT PROPS: ', props);
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setText = (text) => {
        this.setState({ text: text, modalVisible: !this.state.modalVisible });
    }

    toggleModal() {
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModalVisible(!modalVisible);
                }}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10 }}>
                    <View style={{ width: '100%', height: '30%', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,1)', borderRadius: 20 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{}}>{this.state.text}</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Pressable
                                    onPress={() => { this.setState({ modalVisible: false }); this.onConfirm() }}
                                    style={{ width: '50%', marginBottom: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ borderWidth: 1, borderColor: 'gray', paddingVertical: 5, paddingHorizontal: 50, borderRadius: 15 }}>OK</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => { this.setState({ modalVisible: false }) }}
                                    style={{ width: '50%', marginBottom: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ borderWidth: 1, borderColor: 'gray', paddingVertical: 5, paddingHorizontal: 50, borderRadius: 15 }}>Canel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}