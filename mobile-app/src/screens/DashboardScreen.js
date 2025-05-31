import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const ProfileCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Profile Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user?.username || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user?.phoneNumber || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Roles:</Text>
        <Text style={styles.value}>
          {user?.roles ? user.roles.join(', ') : 'USER'}
        </Text>
      </View>
    </View>
  );

  const QuickActionsCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Quick Actions</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>View Activity Log</Text>
      </TouchableOpacity>
      {user?.roles?.includes('ADMIN') && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.adminButton]}
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Text style={styles.actionButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome, {user?.firstName || user?.username || 'User'}!
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.logo}>🕉️</Text>
          <Text style={styles.welcomeTitle}>SANATANA-DHARM</Text>
          <Text style={styles.welcomeText}>
            Welcome to your personal dashboard. Here you can manage your profile and access various features.
          </Text>
        </View>

        <ProfileCard />
        <QuickActionsCard />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    fontSize: 40,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;