import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#724C9D', '#8b63b5', '#a47acd']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>AVERA</Text>
        <Text style={styles.subtitle}>Style Your Story</Text>
        <View style={styles.decorativeLine} />
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    transform: [{ translateY: -30 }], // Slight upward shift for better visual balance
  },
  title: {
    fontSize: width * 0.15, // Responsive font size
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 12,
    textTransform: 'uppercase',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: width * 0.045, // Responsive font size
    color: '#ffffff',
    letterSpacing: 4,
    opacity: 0.9,
    fontWeight: '300',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  decorativeLine: {
    width: width * 0.3,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 20,
  },
});
