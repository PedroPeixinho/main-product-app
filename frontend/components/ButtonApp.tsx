import { PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type ButtonAppProps = {
  onPress: () => void;
  loading?: boolean;
  title?: string;
  disabled?: boolean;
  color?: 'blue' | 'pink';
};

export function ButtonApp({
  onPress,
  loading = false,
  title = 'Login',
  disabled = false,
  color = 'blue',
}: PropsWithChildren<ButtonAppProps>) {
  const theme = useColorScheme() ?? 'light';
  const isDisabled = loading || disabled;

  const backgroundColor =
    color === 'pink' ? '#FF9096' : Colors[theme].tint;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <ThemedText style={styles.text} type="defaultSemiBold">
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  button: ViewStyle;
  text: TextStyle;
  disabled: ViewStyle;
}>({
  button: {
    marginVertical: 8,
    width: '85%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});
