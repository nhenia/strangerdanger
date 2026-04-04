import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

const MatchFound = ({ onAccept }) => {
  const { theme } = useTheme();
  const [anchor, setAnchor] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: theme.card,
      padding: 30,
      borderRadius: 15,
      borderWidth: theme.lcd ? 2 : 0,
      borderColor: theme.secondary,
      width: '100%',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.fontFamily,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 30,
      opacity: 0.8,
    },
    input: {
      width: '100%',
      height: 50,
      borderBottomWidth: 2,
      borderBottomColor: theme.secondary,
      color: theme.text,
      fontFamily: theme.fontFamily,
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 30,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 10,
    },
    buttonText: {
      color: theme.id === 'pager' ? theme.background : theme.text,
      fontFamily: theme.fontFamily,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  const handleAccept = () => {
    if (anchor.trim().length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onAccept(anchor);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>MATCH FOUND</Text>
        <Text style={styles.subtitle}>
          Someone nearby is open to talk.
          {'\n'}Provide a visual anchor for the handshake:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Red cap, Green scarf"
          placeholderTextColor={theme.text + '60'}
          maxLength={30}
          value={anchor}
          onChangeText={setAnchor}
          autoFocus
        />

        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>ESTABLISH BRIDGE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MatchFound;
