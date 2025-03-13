import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { evaluate } from 'mathjs';

const screenWidth = Dimensions.get('window').width;
const buttonColors = {
    number: '#3498db', // Azul
    operator: '#e74c3c', // Rojo
    equals: '#2ecc71', // Verde
    clear: '#f1c40f' // Amarillo
};

export const Vista = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const handlePress = (value: string) => {
        setInput((prev) => prev + value);
    };

    const clearInput = () => {
        setInput('');
    };

    const calculateResult = () => {
        try {
            const formattedInput = input.replace('//', 'floor(').replace(/([0-9]+)floor\(/g, 'floor($1/');
            const result = evaluate(formattedInput + (input.includes('//') ? ')' : ''));
            setHistory([...history, `${input} = ${result}`]);
            setInput(result.toString());
        } catch (error) {
            setInput('Error');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.history}>
                {history.map((item, index) => (
                    <Text key={index} style={styles.historyText}>{item}</Text>
                ))}
            </ScrollView>
            <Text style={styles.input}>{input}</Text>
            <View style={styles.buttonContainer}>
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', '^', '//', 'C'].map((char) => {
                    const isOperator = ['/', '*', '-', '+', '^', '//'].includes(char);
                    const isEquals = char === '=';
                    const isClear = char === 'C';

                    return (
                        <TouchableOpacity
                            key={char}
                            style={[styles.button, { backgroundColor: isOperator ? buttonColors.operator : isEquals ? buttonColors.equals : isClear ? buttonColors.clear : buttonColors.number }]}
                            onPress={() => (char === '=' ? calculateResult() : char === 'C' ? clearInput() : handlePress(char))}
                        >
                            <Text style={styles.buttonText}>{char}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    history: {
        maxHeight: 100,
        marginBottom: 10,
        width: '100%'
    },
    historyText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'right'
    },
    input: {
        fontSize: 32,
        textAlign: 'right',
        marginBottom: 10,
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '115%'
    },
    button: {
        width: screenWidth * 0.22,
        height: 60, margin: 5,
        backgroundColor: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
});
