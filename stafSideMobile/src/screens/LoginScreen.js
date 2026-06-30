import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lock, ArrowRight } from 'lucide-react-native';

const LoginScreen = ({ onLoginSuccess, getApiUrl }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!employeeId.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/staff/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password: password.trim()
        })
      });

      const result = await response.json();
      if (result.success) {
        // Save auth data to storage
        await AsyncStorage.setItem('staffToken', result.token);
        await AsyncStorage.setItem('staffInfo', JSON.stringify(result.data));
        onLoginSuccess(result.data, result.token);
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid Employee ID or Password');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Background Atmospheric Gradients */}
        <LinearGradient
          colors={['#8b5cf6', '#f472b6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoContainer}
        >
          <Text style={styles.logoText}>RizeWorld</Text>
          <Text style={styles.logoSubtext}>Employee Mobile Portal</Text>
        </LinearGradient>

        <View style={styles.formCard}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your dashboard</Text>

          {/* Employee ID */}
          <Text style={styles.label}>Employee ID</Text>
          <View style={styles.inputContainer}>
            <User size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              value={employeeId}
              onChangeText={setEmployeeId}
              placeholder="e.g. RW-1001"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Portal Password</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={['#8b5cf6', '#f472b6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <ArrowRight size={16} color="#fff" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24
  },
  logoContainer: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  logoSubtext: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4
  },
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    marginLeft: 4
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 52
  },
  inputIcon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  buttonGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5
  }
});

export default LoginScreen;
