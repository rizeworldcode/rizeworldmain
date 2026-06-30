import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const getApiUrl = (endpoint) => {
  return `https://rizeworldmain.onrender.com/api${endpoint}`;
};

export default function App() {
  const [token, setToken] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('staffToken');
        const storedInfo = await AsyncStorage.getItem('staffInfo');
        if (storedToken && storedInfo) {
          setToken(storedToken);
          setStaffInfo(JSON.parse(storedInfo));
        }
      } catch (e) {
        console.error('Restoring state failed', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const handleLoginSuccess = (info, userToken) => {
    setToken(userToken);
    setStaffInfo(info);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('staffToken');
      await AsyncStorage.removeItem('staffInfo');
      setToken(null);
      setStaffInfo(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={token ? "light-content" : "dark-content"} />
      {token && staffInfo ? (
        <DashboardScreen 
          staffInfo={staffInfo} 
          token={token} 
          onLogout={handleLogout} 
          getApiUrl={getApiUrl}
        />
      ) : (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess} 
          getApiUrl={getApiUrl}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
});
