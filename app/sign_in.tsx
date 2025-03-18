import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import LoginButton from "../utils/Auth";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const router = useRouter();

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
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <LoginButton />
          <View style={styles.policyContainer}>
            <Text style={styles.policyText}>By continuing, you agree to our</Text>
            <View style={styles.policyLinks}>
              <TouchableOpacity onPress={() => router.push('/terms')}>
                <Text style={styles.link}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.policyText}> and </Text>
              <TouchableOpacity onPress={() => router.push('/privacy')}>
                <Text style={styles.link}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  title: {
    fontSize: width * 0.15,
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
    fontSize: width * 0.045,
    color: '#ffffff',
    letterSpacing: 4,
    opacity: 0.9,
    fontWeight: '300',
    textTransform: 'uppercase',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 30,
    opacity: 0.9,
  },
  policyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  policyLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  policyText: {
    color: '#ffffff',
    opacity: 0.9,
    fontSize: 14,
  },
  link: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
