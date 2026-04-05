import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Settings } from 'lucide-react-native';
import Radar from '../components/Radar';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { InteractionSelector } from '../components/InteractionSelector';
import { useProximity } from '../hooks/useProximity';

const HomeScreen = ({ onToggle, isActive, onMatchFound }) => {
  const { theme } = useTheme();
  const [noList, setNoList] = useState('');
  const [interactionType, setInteractionType] = useState('conversation');
  const [showSettings, setShowSettings] = useState(false);

  const { signalBars, distance } = useProximity(isActive, onMatchFound);

  const toggleActive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onToggle(!isActive);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      paddingTop: 60,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontFamily: theme.fontFamily,
      color: theme.text,
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 15,
      borderWidth: theme.lcd ? 2 : 0,
      borderColor: theme.secondary,
      marginBottom: 20,
    },
    label: {
      fontSize: 18,
      fontFamily: theme.fontFamily,
      color: theme.text,
      marginBottom: 10,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    input: {
      height: 60,
      borderWidth: 1,
      borderColor: theme.secondary,
      borderRadius: 8,
      padding: 10,
      color: theme.text,
      fontFamily: theme.fontFamily,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    charCount: {
      textAlign: 'right',
      fontSize: 12,
      color: theme.text,
      opacity: 0.6,
      marginTop: 4,
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>PERMISSION</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Settings color={theme.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showSettings && <ThemeSwitcher />}

        <View style={styles.card}>
          <View style={styles.toggleContainer}>
            <Text style={[styles.label, { marginBottom: 0, fontSize: 24 }]}>
              {isActive ? 'OPEN TO TALK' : 'SILENT'}
            </Text>
            <Switch
              trackColor={{ false: theme.secondary, true: theme.accent }}
              thumbColor={theme.text}
              onValueChange={toggleActive}
              value={isActive}
            />
          </View>
        </View>

        {isActive ? (
          <Radar isActive={isActive} signalBars={signalBars} distance={distance} />
        ) : (
          <>
            <InteractionSelector
              selected={interactionType}
              onSelect={setInteractionType}
            />

            <View style={styles.card}>
              <Text style={styles.label}>Boundaries (No List)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. No romance, no groups"
                placeholderTextColor={theme.text + '80'}
                maxLength={50}
                multiline
                value={noList}
                onChangeText={setNoList}
              />
              <Text style={styles.charCount}>{noList.length}/50</Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
