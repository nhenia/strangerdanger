import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * Visual Style selector components for the "Permission" app.
 * Part of the "Universal, playful, and absurdly fast" ethos.
 */
export const ThemeSwitcher = () => {
  const { theme, setThemeId, themes } = useTheme();

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
    picker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    btn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.secondary,
    },
    btnActive: {
      backgroundColor: theme.secondary,
    },
    btnText: {
      fontSize: 12,
      fontFamily: theme.fontFamily,
      color: theme.text,
    },
    btnTextActive: {
      color: theme.isDark ? '#fff' : theme.background,
      fontWeight: 'bold',
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Visual Style</Text>
      <View style={styles.picker}>
        {Object.values(themes).map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.btn, theme.id === t.id && styles.btnActive]}
            onPress={() => setThemeId(t.id)}
          >
            <Text style={[styles.btnText, theme.id === t.id && styles.btnTextActive]}>
              {t.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
