import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { User, MessageCircle, ArrowRight } from 'lucide-react-native';

const Bridge = ({ myAnchor, theirAnchor, handshake, onDismiss }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.card,
      padding: 30,
      borderRadius: 20,
      borderWidth: theme.lcd ? 2 : 0,
      borderColor: theme.secondary,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    instruction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
      width: '100%',
    },
    iconBox: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    label: {
      fontSize: 14,
      fontFamily: theme.fontFamily,
      color: theme.text,
      opacity: 0.7,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 22,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontWeight: 'bold',
    },
    scriptContainer: {
      backgroundColor: theme.background,
      padding: 20,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.accent,
      width: '100%',
      marginBottom: 40,
    },
    scriptText: {
      fontSize: 18,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontStyle: 'italic',
      lineHeight: 24,
    },
    button: {
      borderWidth: 1,
      borderColor: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    buttonText: {
      color: theme.text,
      fontFamily: theme.fontFamily,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>PERMISSION GRANTED</Text>

        <View style={styles.instruction}>
          <View style={styles.iconBox}>
            <User color={theme.id === 'pager' ? theme.background : theme.text} size={24} />
          </View>
          <View>
            <Text style={styles.label}>FIND THE PERSON WITH</Text>
            <Text style={styles.value}>{theirAnchor}</Text>
          </View>
        </View>

        <View style={styles.instruction}>
          <View style={styles.iconBox}>
            <MessageCircle color={theme.id === 'pager' ? theme.background : theme.text} size={24} />
          </View>
          <View>
            <Text style={styles.label}>SAY THE SCRIPT</Text>
          </View>
        </View>

        <View style={styles.scriptContainer}>
          <Text style={styles.label}>YOU SAY:</Text>
          <Text style={styles.scriptText}>"{handshake?.call}"</Text>
          <View style={{ height: 10 }} />
          <Text style={styles.label}>THEY RESPOND:</Text>
          <Text style={styles.scriptText}>"{handshake?.response}"</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDismiss();
          }}
        >
          <Text style={styles.buttonText}>DISMISS & GO SILENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Bridge;
