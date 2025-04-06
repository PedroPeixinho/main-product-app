import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { PropsWithChildren } from 'react';
import Mouth from '@/assets/images/mouth.svg'; // ou ajuste o caminho do ícone

type ExerciseTagProps = {
  label?: string; // Ex: "BAIXO"
  exerciseName?: string; // Ex: "Protruir e retrair"
  labelColor?: string; // Ex: "#FDA400"
};

export function ExerciseTag({
  label = 'BAIXO',
  exerciseName = 'Protruir e retrair',
  labelColor = '#FDA400',
}: PropsWithChildren<ExerciseTagProps>) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Mouth width={35} height={35} />
        <Text style={styles.exerciseName}>{exerciseName}</Text>
      </View>
      <View style={[styles.labelContainer, { backgroundColor: labelColor }]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  leftContent: ViewStyle;
  exerciseName: TextStyle;
  labelContainer: ViewStyle;
  labelText: TextStyle;
}>({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9096',
    padding: 10,
    borderRadius: 45,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exerciseName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  labelContainer: {
    borderRadius: 45,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  labelText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
});
