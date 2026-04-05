import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { User, MessageCircle, XCircle } from 'lucide-react-native';

const Bridge = ({ myAnchor, theirAnchor, onDismiss }) => {
  const { theme } = useTheme();

  const handleDissolve = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDismiss();
  };

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
      textAlign: 'center',
    },
    instruction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
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
      marginBottom: 30,
    },
    scriptText: {
      fontSize: 18,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontStyle: 'italic',
      lineHeight: 24,
    },
    dissolveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      padding: 10,
    },
    dissolveText: {
      color: theme.id === 'pager' ? theme.text : (theme.alert || '#ff4b2b'),
      fontFamily: theme.fontFamily,
      marginLeft: 8,
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    dismissButton: {
      borderWidth: 1,
      borderColor: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 10,
    },
    dismissText: {
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
          <Text style={styles.scriptText}>
            "I like your {myAnchor}."
          </Text>
        </View>

        <TouchableOpacity style={styles.dismissButton} onPress={handleDissolve}>
          <Text style={styles.dismissText}>COMPLETE & GO SILENT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dissolveButton} onPress={handleDissolve}>
          <XCircle color={theme.id === 'pager' ? theme.text : (theme.alert || '#ff4b2b')} size={20} />
          <Text style={styles.dissolveText}>DISSOLVE PERMISSION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Bridge;
