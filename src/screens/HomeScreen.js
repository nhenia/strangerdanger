import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Settings, Info, Radio } from 'lucide-react-native';
import Radar from '../components/Radar';
import { loadNoList, saveNoList, loadInteractionTypes, saveInteractionTypes } from '../utils/storage';

const interactionOptions = [
  { id: 'conversation', label: 'Conversation' },
  { id: 'silent', label: 'Silent Coexistence' },
  { id: 'activity', label: 'Shared Activity' },
  { id: 'humor', label: 'Humorous' },
  { id: 'mysterious', label: 'Mysterious' },
];

const HomeScreen = ({ onToggle, isActive, matchingState, mood, onMoodChange }) => {
  const { theme, setThemeId, themes } = useTheme();
  const [noList, setNoList] = useState('');
  const [interactionTypes, setInteractionTypesSelected] = useState(['conversation']);

  useEffect(() => {
    loadNoList().then(setNoList);
    loadInteractionTypes().then(setInteractionTypesSelected);
  }, []);

  const handleNoListChange = async (text) => {
    setNoList(text);
    await saveNoList(text);
  };

  const handleInteractionToggle = async (id) => {
    Haptics.selectionAsync();
    let newTypes;
    if (interactionTypes.includes(id)) {
      if (interactionTypes.length > 1) {
        newTypes = interactionTypes.filter(t => t !== id);
      } else {
        return; // Must have at least one
      }
    } else {
      if (interactionTypes.length < 3) {
        newTypes = [...interactionTypes, id];
      } else {
        // If already 3, replace the first one with the new one
        newTypes = [...interactionTypes.slice(1), id];
      }
    }
    setInteractionTypesSelected(newTypes);
    await saveInteractionTypes(newTypes);
  };
  const [showSettings, setShowSettings] = useState(false);

  const toggleActive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onToggle(!isActive);
  };

  const handleMoodSelect = (m) => {
    Haptics.selectionAsync();
    onMoodChange(m);
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
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
    interactionButton: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.secondary,
      marginBottom: 10,
      backgroundColor: 'transparent',
    },
    interactionButtonActive: {
      backgroundColor: theme.secondary,
    },
    interactionText: {
      color: theme.text,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
    },
    charCount: {
      textAlign: 'right',
      fontSize: 12,
      color: theme.text,
      opacity: 0.6,
      marginTop: 4,
    },
    themePicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 20,
    },
    themeBtn: {
      padding: 8,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.text,
    },
    moodPicker: {
      marginTop: 20,
    },
    moodBtn: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.secondary,
      marginBottom: 10,
      backgroundColor: 'transparent',
    },
    moodBtnActive: {
      backgroundColor: theme.secondary,
    },
    moodText: {
      color: theme.text,
      fontFamily: theme.fontFamily,
      textAlign: 'center',
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
        {showSettings && (
          <View style={styles.card}>
            <Text style={styles.label}>Visual Style</Text>
            <View style={styles.themePicker}>
              {Object.values(themes).map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.themeBtn, theme.id === t.id && { backgroundColor: theme.text }]}
                  onPress={() => setThemeId(t.id)}
                >
                  <Text style={{ color: theme.id === t.id ? theme.background : theme.text, fontSize: 12 }}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.moodPicker}>
              <Text style={styles.label}>Mood Signal</Text>
              {[
                { id: 'none', label: 'Off' },
                { id: 'red', label: 'Do not talk to me (Red)' },
                { id: 'yellow', label: 'Approach lightly (Yellow)' },
                { id: 'green', label: 'Talk to me! (Green)' }
              ].map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.moodBtn,
                    mood === m.id && styles.moodBtnActive
                  ]}
                  onPress={() => handleMoodSelect(m.id)}
                >
                  <Text style={styles.moodText}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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

        {isActive && <Radar isActive={isActive} matchingState={matchingState} />}

        {!isActive && (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Interaction Type (Up to 3)</Text>
              {interactionOptions.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.interactionButton,
                    interactionTypes.includes(type.id) && styles.interactionButtonActive
                  ]}
                  onPress={() => handleInteractionToggle(type.id)}
                >
                  <Text style={styles.interactionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Boundaries (No List)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. No romance, no groups"
                placeholderTextColor={theme.text + '80'}
                maxLength={50}
                multiline
                value={noList}
                onChangeText={handleNoListChange}
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
