import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HearingScreen from './src/screens/HearingScreen';
import AdmissionsScreen from './src/screens/AdmissionsScreen';
import SalesScreen from './src/screens/SalesScreen';
import VisitingCardsScreen from './src/screens/VisitingCardsScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import ClientProjectsScreen from './src/screens/ClientProjectsScreen';
import BlogsScreen from './src/screens/BlogsScreen';

const getApiUrl = (endpoint) => {
  return `https://rizeworldmain.onrender.com/api${endpoint}`;
};

export default function App() {
  const [token, setToken] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState('dashboard'); // 'dashboard' | 'hearing' | 'admissions' | 'sales' | 'visitingCards' | 'clients' | 'clientProjects' | 'blogs'
  const [selectedClient, setSelectedClient] = useState(null);

  const updateStaffInfo = async (newStaffInfo) => {
    if (!newStaffInfo) return;
    setStaffInfo(newStaffInfo);
    try {
      await AsyncStorage.setItem('staffInfo', JSON.stringify(newStaffInfo));
    } catch (e) {
      console.error('Failed to update staffInfo in storage', e);
    }
  };

  const fetchFreshStaffInfo = async (staffId, userToken) => {
    const targetToken = userToken || token;
    const targetId = staffId || (staffInfo && (staffInfo.id || staffInfo._id));
    if (!targetId || !targetToken) return;

    try {
      const response = await fetch(getApiUrl(`/staff/${targetId}`), {
        headers: { 'Authorization': `Bearer ${targetToken}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        await updateStaffInfo(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch fresh staff info:', err);
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('staffToken');
        const storedInfoStr = await AsyncStorage.getItem('staffInfo');
        if (storedToken && storedInfoStr) {
          const parsedInfo = JSON.parse(storedInfoStr);
          setToken(storedToken);
          setStaffInfo(parsedInfo);

          // Fetch latest data from server on app launch
          const staffId = parsedInfo.id || parsedInfo._id;
          fetchFreshStaffInfo(staffId, storedToken);
        }
      } catch (e) {
        console.error('Restoring state failed', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Background polling to keep staff data updated automatically
  useEffect(() => {
    if (!token || !staffInfo) return;
    const intervalId = setInterval(() => {
      const staffId = staffInfo.id || staffInfo._id;
      if (staffId && token) {
        fetchFreshStaffInfo(staffId, token);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [token, staffInfo?.id, staffInfo?._id]);

  const handleLoginSuccess = (info, userToken) => {
    setToken(userToken);
    updateStaffInfo(info);
    setActiveScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('staffToken');
      await AsyncStorage.removeItem('staffInfo');
      setToken(null);
      setStaffInfo(null);
      setActiveScreen('dashboard');
      setSelectedClient(null);
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

  const renderScreen = () => {
    if (!token || !staffInfo) {
      return (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess} 
          getApiUrl={getApiUrl}
        />
      );
    }

    switch (activeScreen) {
      case 'hearing':
        return (
          <HearingScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'admissions':
        return (
          <AdmissionsScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'sales':
        return (
          <SalesScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'visitingCards':
        return (
          <VisitingCardsScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'clients':
        return (
          <ClientsScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            onSelectClient={(client) => {
              setSelectedClient(client);
              setActiveScreen('clientProjects');
            }}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'clientProjects':
        return (
          <ClientProjectsScreen
            client={selectedClient}
            onBack={() => setActiveScreen('clients')}
          />
        );
      case 'blogs':
        return (
          <BlogsScreen
            staffInfo={staffInfo}
            token={token}
            onBack={() => setActiveScreen('dashboard')}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardScreen 
            staffInfo={staffInfo} 
            token={token} 
            onLogout={handleLogout} 
            onNavigate={(screen) => setActiveScreen(screen)}
            getApiUrl={getApiUrl}
            onUpdateStaffInfo={updateStaffInfo}
            refreshStaffInfo={() => fetchFreshStaffInfo()}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
});
