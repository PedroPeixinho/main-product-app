import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import GetBase from '@/services/base/GetBase';
import { useEffect, useState } from 'react';

export default function Home() {
  const [base, setBase] = useState<string>('');
  
  const colorScheme = useColorScheme() ?? 'light';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetBase();
        if (!response) {
          return;
        }
        setBase(response.data.message ?? 'Erro');  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.text, { color: Colors[colorScheme].text }]}>{base}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
