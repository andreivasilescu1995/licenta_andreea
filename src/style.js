import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    logo: {
        marginVertical: '30%',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    loginButtonContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    viewInput: {
        // width: '80%',
        width: 250,
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 20,
        paddingLeft: 20,
    },
    textInput: {
        width: '100%',
        paddingLeft: 30,
        color: '#fff',
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        height: 40,
    },
    loginButton: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 40,
    },
    drawerLabel: {
        color: '#fff',
    },
    doneRegistering: {
        fontSize: 15,
        fontFamily: 'OpenSans-Regular',
        color: '#fff',
    },
    warningMessage: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#E3051B",
        alignItems: "center",
        borderRadius: 5,
    },
})