import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

/**
 * Interaction Type selector for the "Permission" app.
 * Provides mutual intent: Conversation, Silent Coexistence, or Shared Activity.
 */
export const InteractionSelector = ({ selected, onSelect }) => {
  const { theme } = useTheme();

  const types = [
    { id: 'conversation', label: 'Conversation' },
    { id: 'silent', label: 'Silent Coexistence' },
    { id: 'activity', label: 'Shared Activity' },
  ];

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      borderRadius: 12,
      backgroundColor: theme.card,
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontFamily: theme.fontFamily,
      color: theme.text,
      marginBottom: 12,
    },
    btn: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.secondary,
      marginBottom: 10,
    },
    btnActive: {
      backgroundColor: theme.secondary,
    },
    btnText: {
      color: theme.text,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
    },
    btnTextActive: {
      fontWeight: 'bold',
      color: theme.isDark ? '#fff' : theme.background,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Interaction Type</Text>
      {types.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.btn,
            selected === type.id && styles.btnActive
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            onSelect(type.id);
          }}
        >
          <Text style={[styles.btnText, selected === type.id && styles.btnTextActive]}>
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
