import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  IS_ACTIVE: 'permission_is_active',
  NO_LIST: 'permission_no_list',
  INTERACTION_TYPES: 'permission_interaction_types',
  THEME_ID: 'permission_theme_id',
};

export const saveIsActive = async (isActive) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_ACTIVE, JSON.stringify(isActive));
  } catch (e) {
    console.error('Failed to save isActive', e);
  }
};

export const loadIsActive = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_ACTIVE);
    return value !== null ? JSON.parse(value) : false;
  } catch (e) {
    console.error('Failed to load isActive', e);
    return false;
  }
};

export const saveNoList = async (noList) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NO_LIST, noList);
  } catch (e) {
    console.error('Failed to save noList', e);
  }
};

export const loadNoList = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.NO_LIST);
    return value !== null ? value : '';
  } catch (e) {
    console.error('Failed to load noList', e);
    return '';
  }
};

export const saveInteractionTypes = async (types) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.INTERACTION_TYPES, JSON.stringify(types));
  } catch (e) {
    console.error('Failed to save interaction types', e);
  }
};

export const loadInteractionTypes = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.INTERACTION_TYPES);
    return value !== null ? JSON.parse(value) : ['conversation'];
  } catch (e) {
    console.error('Failed to load interaction types', e);
    return ['conversation'];
  }
};

export const saveThemeId = async (themeId) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_ID, themeId);
  } catch (e) {
    console.error('Failed to save themeId', e);
  }
};

export const loadThemeId = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.THEME_ID);
    return value !== null ? value : 'glassmorphism';
  } catch (e) {
    console.error('Failed to load themeId', e);
    return 'glassmorphism';
  }
};
