import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService, getApiErrorMessage } from '../../services/auth.service';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Confirm password does not match');
      return;
    }

    setLoading(true);
    try {
      await authService.register(email.trim(), password, 'CUSTOMER');
      await authService.login(email.trim(), password);
      Alert.alert('Success', 'Registration and login successful!');
      navigation.replace('CustomerHome');
    } catch (error: any) {
      Alert.alert('Registration Failed', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.replace('Login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={20} color="#6B7C4F" />
            </View>
            <Text style={styles.logoText}>SnapBook</Text>
          </View>
          <Text style={styles.tagline}>
            "Capturing nature's silent poetry, one frame at a time."
          </Text>
        </View>

        {/* BODY SECTION */}
        <View style={styles.body}>
          <Text style={styles.title}>Join Us</Text>
          <Text style={styles.subtitle}>Create an account to start your journey</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#BBBBBB"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 16 }]}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="nature.lover@example.com"
                placeholderTextColor="#BBBBBB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#BBBBBB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#AAAAAA" 
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={[styles.label, { marginTop: 16 }]}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#BBBBBB"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#AAAAAA"
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleRegister} 
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInText}>Create Account →</Text>
              )}
            </TouchableOpacity>

            {/* Footer Text */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* BOTTOM CARD */}
        <View style={styles.bottomCardWrapper}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
            style={styles.bottomCard}
            imageStyle={styles.bottomCardImage}
          >
            <View style={styles.cardOverlay}>
              <Text style={styles.cardQuote}>
                "Nature does not hurry, yet everything is accomplished."
              </Text>
            </View>
          </ImageBackground>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#6B7C4F',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  body: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  formContainer: {
    marginTop: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#1A1A1A',
  },
  eyeIcon: {
    padding: 6,
  },
  signInBtn: {
    backgroundColor: '#6B7C4F',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  signInBtnDisabled: {
    opacity: 0.7,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
  },
  footerLink: {
    color: '#6B7C4F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomCardWrapper: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  bottomCard: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomCardImage: {
    borderRadius: 16,
  },
  cardOverlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardQuote: {
    color: '#FFFFFF',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
