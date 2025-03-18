import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function TermsAndConditions() {
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
          <Text style={styles.title}>Terms & Conditions</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.section}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using Avera, a solo-developed fashion sharing application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services. You must have the legal capacity to enter into these terms.
          </Text>

          <Text style={styles.section}>2. User Content</Text>
          <Text style={styles.text}>
            - You retain ownership of the images you share on Avera{'\n'}
            - All content you share is publicly visible to all users and may be indexed by search engines{'\n'}
            - By posting content, you grant Avera a worldwide, non-exclusive, royalty-free, transferable license to host, store, use, display, reproduce, modify, adapt, edit, publish, and distribute your content{'\n'}
            - Your content may appear in public feeds, discovery sections, and promotional materials{'\n'}
            - Content may persist after account deletion if shared or saved by other users{'\n'}
            - You represent and warrant that:{'\n'}
              • You own or have the necessary rights to share your content{'\n'}
              • Your content does not violate any third party's intellectual property rights{'\n'}
              • Your content does not violate any applicable laws or regulations{'\n'}
            - We reserve the right to remove any content at our sole discretion
          </Text>

          <Text style={styles.section}>3. User Conduct</Text>
          <Text style={styles.text}>
            You agree not to:{'\n'}
            - Post harmful, malicious, or illegal content{'\n'}
            - Post content that promotes discrimination or hate speech{'\n'}
            - Share explicit, adult, or inappropriate content{'\n'}
            - Impersonate others or provide false information{'\n'}
            - Use the service for unauthorized commercial purposes{'\n'}
            - Attempt to circumvent any security features{'\n'}
            - Engage in automated data collection without permission{'\n'}
            - Upload malware or malicious code{'\n'}
            - Violate third party intellectual property rights{'\n'}
            - Use the app in any way that could disable or overburden our systems
          </Text>

          <Text style={styles.section}>4. Account Security</Text>
          <Text style={styles.text}>
            - You are responsible for maintaining the confidentiality of your account{'\n'}
            - You are responsible for all activities under your account{'\n'}
            - You must immediately notify us of any unauthorized use{'\n'}
            - We reserve the right to terminate accounts that violate our terms{'\n'}
            - We may suspend or terminate your account for any reason without notice{'\n'}
            - You agree to use secure and unique passwords{'\n'}
            - You will not share your account credentials
          </Text>

          <Text style={styles.section}>5. DMCA & Copyright</Text>
          <Text style={styles.text}>
            - We respect intellectual property rights{'\n'}
            - We will respond to legitimate DMCA takedown notices{'\n'}
            - We may remove content alleged to be infringing without prior notice{'\n'}
            - Repeat infringers will have their accounts terminated{'\n'}
            - False claims may lead to account termination{'\n'}
            - Contact support for DMCA notices{'\n'}
            - Include all required DMCA notice elements
          </Text>

          <Text style={styles.section}>6. App Store Compliance</Text>
          <Text style={styles.text}>
            - This app is distributed through official app stores{'\n'}
            - You agree to comply with all applicable store policies{'\n'}
            - Purchases and subscriptions may be subject to store terms{'\n'}
            - App store providers are third-party beneficiaries{'\n'}
            - Store-specific terms may apply to your use
          </Text>

          <Text style={styles.section}>7. Disclaimers & Limitations</Text>
          <Text style={styles.text}>
            - THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES{'\n'}
            - AS A SOLO-DEVELOPED APPLICATION, WE MAKE NO GUARANTEES ABOUT SERVICE RELIABILITY OR AVAILABILITY{'\n'}
            - WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE SERVICE{'\n'}
            - WE ARE NOT RESPONSIBLE FOR USER-GENERATED CONTENT{'\n'}
            - WE DO NOT ENDORSE OR VERIFY USER CONTENT{'\n'}
            - TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY:{'\n'}
              • INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES{'\n'}
              • LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES{'\n'}
              • UNAUTHORIZED ACCESS TO OR ALTERATION OF CONTENT{'\n'}
              • STATEMENTS OR CONDUCT OF ANY THIRD PARTY{'\n'}
            - OUR TOTAL LIABILITY SHALL NOT EXCEED $100
          </Text>

          <Text style={styles.section}>8. Indemnification</Text>
          <Text style={styles.text}>
            You agree to defend, indemnify, and hold harmless Avera and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:{'\n'}
            - Your use of the service{'\n'}
            - Your content{'\n'}
            - Your violation of these terms{'\n'}
            - Your violation of any third party rights
          </Text>

          <Text style={styles.section}>9. Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. We will notify you of material changes through the app. Continued use after changes constitutes acceptance of modified terms.
          </Text>

          <Text style={styles.section}>10. Contact & Governing Law</Text>
          <Text style={styles.text}>
            - Contact support through the app for any questions about these terms{'\n'}
            - As a solo-developed application, response times may vary{'\n'}
            - These terms shall be governed by and construed in accordance with the laws of the United States{'\n'}
            - Any disputes shall be subject to the exclusive jurisdiction of the courts in the United States
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
