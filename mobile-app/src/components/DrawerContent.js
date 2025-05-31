import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  fetchChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  setCurrentChannel,
  clearChannelError
} from '../store/channelSlice';
import { logout } from '../store/authSlice';

const DrawerContent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const { 
    channels, 
    joinedChannels, 
    currentChannel, 
    loading, 
    createChannelLoading,
    error 
  } = useSelector((state) => state.channels);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    category: 'general'
  });

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const categories = [
    { value: 'general', label: '🕉️ General', icon: '🕉️' },
    { value: 'scriptures', label: '📚 Scriptures', icon: '📚' },
    { value: 'philosophy', label: '🧘 Philosophy', icon: '🧘' },
    { value: 'rituals', label: '🔥 Rituals & Practices', icon: '🔥' },
    { value: 'festivals', label: '🎉 Festivals', icon: '🎉' },
    { value: 'meditation', label: '🧘‍♂️ Meditation', icon: '🧘‍♂️' },
    { value: 'yoga', label: '🤸 Yoga', icon: '🤸' },
    { value: 'devotion', label: '🙏 Devotion & Bhakti', icon: '🙏' },
    { value: 'questions', label: '❓ Questions & Answers', icon: '❓' },
    { value: 'community', label: '👥 Community', icon: '👥' }
  ];

  const handleCreateChannel = async () => {
    if (newChannel.name.trim()) {
      const result = await dispatch(createChannel(newChannel));
      if (createChannel.fulfilled.match(result)) {
        setNewChannel({ name: '', description: '', category: 'general' });
        setShowCreateModal(false);
        Alert.alert('Success', 'Channel created successfully!');
      }
    }
  };

  const handleJoinChannel = (channel) => {
    dispatch(joinChannel(channel.id));
  };

  const handleLeaveChannel = (channelId) => {
    Alert.alert(
      'Leave Channel',
      'Are you sure you want to leave this channel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => dispatch(leaveChannel(channelId)) }
      ]
    );
  };

  const handleChannelSelect = (channel) => {
    dispatch(setCurrentChannel(channel));
    navigation.navigate('Channel', { channelId: channel.id });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕉️ SANATANA-DHARM</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user?.username}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Main Navigation */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          
          {user?.role === 'ADMIN' && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Admin')}
            >
              <Text style={styles.navIcon}>⚙️</Text>
              <Text style={styles.navText}>Admin Panel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Joined Channels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Channels</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {joinedChannels.map((channel) => {
            const category = categories.find(c => c.value === channel.category);
            return (
              <TouchableOpacity
                key={channel.id}
                style={[
                  styles.channelItem,
                  currentChannel?.id === channel.id && styles.activeChannel
                ]}
                onPress={() => handleChannelSelect(channel)}
              >
                <View style={styles.channelInfo}>
                  <Text style={styles.channelIcon}>
                    {category?.icon || '📝'}
                  </Text>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {channel.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleLeaveChannel(channel.id)}
                  style={styles.leaveButton}
                >
                  <Text style={styles.leaveButtonText}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
          
          {joinedChannels.length === 0 && (
            <Text style={styles.emptyText}>No channels joined yet</Text>
          )}
        </View>

        {/* Discover Channels */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowAllChannels(!showAllChannels)}
          >
            <Text style={styles.sectionTitle}>Discover Channels</Text>
            <Text style={styles.toggleText}>
              {showAllChannels ? 'Hide' : 'Show All'}
            </Text>
          </TouchableOpacity>

          {showAllChannels && (
            <View style={styles.discoverChannels}>
              {channels
                .filter(channel => !joinedChannels.find(jc => jc.id === channel.id))
                .slice(0, 10)
                .map((channel) => {
                  const category = categories.find(c => c.value === channel.category);
                  return (
                    <View key={channel.id} style={styles.discoverItem}>
                      <View style={styles.discoverInfo}>
                        <Text style={styles.channelIcon}>
                          {category?.icon || '📝'}
                        </Text>
                        <View style={styles.discoverText}>
                          <Text style={styles.discoverName} numberOfLines={1}>
                            {channel.name}
                          </Text>
                          <Text style={styles.discoverDesc} numberOfLines={1}>
                            {channel.description}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleJoinChannel(channel)}
                        style={styles.joinButton}
                      >
                        <Text style={styles.joinButtonText}>Join</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Create Channel Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Channel</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Channel name"
              value={newChannel.name}
              onChangeText={(text) => setNewChannel({ ...newChannel, name: text })}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newChannel.description}
              onChangeText={(text) => setNewChannel({ ...newChannel, description: text })}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.label}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryItem,
                    newChannel.category === cat.value && styles.selectedCategory
                  ]}
                  onPress={() => setNewChannel({ ...newChannel, category: cat.value })}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryText} numberOfLines={1}>
                    {cat.label.replace(/^[^\s]+ /, '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateChannel}
                disabled={createChannelLoading}
              >
                <Text style={styles.createButtonText}>
                  {createChannelLoading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => dispatch(clearChannelError())}
            style={styles.errorClose}
          >
            <Text style={styles.errorCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#667eea',
    fontSize: 14,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeChannel: {
    backgroundColor: '#e0e7ff',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  leaveButton: {
    padding: 4,
  },
  leaveButtonText: {
    color: '#ef4444',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  discoverChannels: {
    marginTop: 8,
  },
  discoverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  discoverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  discoverText: {
    flex: 1,
    marginLeft: 8,
  },
  discoverName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  discoverDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  joinButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    minWidth: 60,
  },
  selectedCategory: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  createButton: {
    backgroundColor: '#667eea',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  createButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  errorCloseText: {
    color: '#dc2626',
    fontSize: 16,
  },
});

export default DrawerContent;