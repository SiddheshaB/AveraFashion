import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#724C9D', '#8b63b5', '#a47acd']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.text}>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, protect, and share your information when you use Avera, a solo-developed fashion sharing application. As an independent developer, we strive to be transparent about our data practices while maintaining strong privacy protections.
          </Text>

          <Text style={styles.section}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We collect:{'\n'}
            a) Account Information:{'\n'}
            - Name and email through Google Sign-in{'\n'}
            - Profile information you choose to provide{'\n'}
            - Authentication credentials{'\n'}
            
            b) Content:{'\n'}
            - Photos and images you choose to share{'\n'}
            - Captions, comments, and descriptions{'\n'}
            - Interaction data with other users' content{'\n'}
            - All shared content is publicly visible{'\n'}
            
            c) Usage Data:{'\n'}
            - App interaction patterns{'\n'}
            - Features and content you engage with{'\n'}
            - Time spent on different sections{'\n'}
            - Analytics and performance data{'\n'}
            
            d) Device Information:{'\n'}
            - Device type and model{'\n'}
            - Operating system version{'\n'}
            - Unique device identifiers{'\n'}
            - IP address and general location{'\n'}
            - Mobile network information{'\n'}
            - App store information
          </Text>

          <Text style={styles.section}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use your information to:{'\n'}
            - Provide and maintain our services{'\n'}
            - Display your shared content publicly to all users{'\n'}
            - Feature content in public feeds and discovery sections{'\n'}
            - Personalize your experience{'\n'}
            - Analyze usage patterns and improve our service{'\n'}
            - Detect and prevent fraud or abuse{'\n'}
            - Communicate with you about service updates{'\n'}
            - Comply with legal obligations{'\n'}
            - Debug and fix technical issues{'\n'}
            - Respond to your requests and support needs
          </Text>

          <Text style={styles.section}>3. Information Sharing</Text>
          <Text style={styles.text}>
            a) Public Content:{'\n'}
            - All shared photos are publicly visible to all users{'\n'}
            - Content is indexed by search engines{'\n'}
            - Content appears in public feeds and discovery sections{'\n'}
            - Content may be used in promotional materials{'\n'}
            - Content may persist after account deletion{'\n'}
            
            b) Service Providers:{'\n'}
            - As a solo-developed app, we rely on trusted third-party services:{'\n'}
              • Google services for authentication{'\n'}
              • Cloud storage providers{'\n'}
              • Analytics services{'\n'}
            - All providers are bound by confidentiality obligations{'\n'}
            - We limit data sharing to what is necessary{'\n'}
            
            c) App Store Requirements:{'\n'}
            - Required information shared with app stores{'\n'}
            - Analytics and crash reporting{'\n'}
            - Payment processing through official channels{'\n'}
            
            d) Legal Requirements:{'\n'}
            - Information disclosed if required by law{'\n'}
            - To protect rights and safety{'\n'}
            - To prevent fraud or abuse{'\n'}
            - To enforce our Terms of Service
          </Text>

          <Text style={styles.section}>4. Data Security</Text>
          <Text style={styles.text}>
            - We implement reasonable security measures{'\n'}
            - Data is encrypted in transit and at rest{'\n'}
            - Regular security updates{'\n'}
            - Access controls and monitoring{'\n'}
            - As a solo-developed app, we may have limited resources for immediate incident response{'\n'}
            - No method of transmission is 100% secure{'\n'}
            - You are responsible for maintaining your account security
          </Text>

          <Text style={styles.section}>5. Your Rights and Choices</Text>
          <Text style={styles.text}>
            You can:{'\n'}
            - Access and update your account information{'\n'}
            - Delete your shared content{'\n'}
            - Request your data or account deletion{'\n'}
            - Opt-out of promotional communications{'\n'}
            - Control app permissions (camera, storage, etc.){'\n'}
            - Manage third-party integrations{'\n'}
            - Contact us about privacy concerns{'\n'}
            
            Note: Content you have shared publicly may remain visible even after account deletion if it has been shared or saved by other users.
          </Text>

          <Text style={styles.section}>6. Third-Party Services</Text>
          <Text style={styles.text}>
            - We use Google Sign-in for authentication{'\n'}
            - We use cloud storage services{'\n'}
            - Third-party services have their own privacy policies{'\n'}
            - Review third-party privacy policies before use{'\n'}
            - We are not responsible for third-party practices
          </Text>

          <Text style={styles.section}>7. Data Retention</Text>
          <Text style={styles.text}>
            - We retain data as long as your account is active{'\n'}
            - Some information may be retained after deletion{'\n'}
            - Retention periods vary by data type{'\n'}
            - We may retain data for legal compliance{'\n'}
            - Backup copies may exist for limited time
          </Text>

          <Text style={styles.section}>8. International Data Transfers</Text>
          <Text style={styles.text}>
            - Data may be processed in different countries{'\n'}
            - We ensure appropriate safeguards for transfers{'\n'}
            - By using our service, you consent to transfers{'\n'}
            - We comply with applicable data protection laws
          </Text>

          <Text style={styles.section}>9. Changes to Privacy Policy</Text>
          <Text style={styles.text}>
            We may update this policy periodically. We will notify you of material changes through the app or email. Continued use after changes constitutes acceptance.
          </Text>

          <Text style={styles.section}>10. Contact Information</Text>
          <Text style={styles.text}>
            For privacy-related questions or concerns:{'\n'}
            - Contact support through the app{'\n'}
            - As a solo-developed application, response times may vary{'\n'}
            - We aim to address all inquiries within 5 business days{'\n'}
            - For urgent matters related to content removal or security, please mark your request as "URGENT"
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Last updated: March 2025</Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginLeft: 10,
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 30,
  },
  footerText: {
    color: '#999',
    textAlign: 'center',
  },
});
