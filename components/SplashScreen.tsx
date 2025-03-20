import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Sofia_400Regular,
} from '@expo-google-fonts/sofia';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const [fontsLoaded] = useFonts({
    Sofia_400Regular,
  });

 /*  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={['#724C9D', '#8b63b5', '#a47acd']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { fontFamily: 'Sofia_400Regular' }]}>AVERA</Text>
          <View style={styles.decorativeLine} />
          <Text style={[styles.subtitle, { fontFamily: undefined }]}>Style Your Way</Text>
        </View>
      </LinearGradient>
    );
  } */

  return (
    <LinearGradient
      colors={['#724C9D', '#8b63b5', '#a47acd']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Avera</Text>
        <View style={styles.decorativeLine} />
        <Text style={styles.subtitle}>Style Your Way</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: width * 0.15,
    color: '#ffffff',
    letterSpacing: 12,
    // textTransform: 'uppercase' as const,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Sofia_400Regular',
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#ffffff',
    letterSpacing: 4,
    opacity: 0.9,
    fontWeight: '300' as const,
    textTransform: 'uppercase' as const,
    marginBottom: 20,
    //fontFamily: 'Sofia_400Regular',
  },
  decorativeLine: {
    width: width * 0.3,
    height: 2,
    backgroundColor: '#ffffff',
    marginVertical: 10,
    opacity: 0.7,
  },
});
