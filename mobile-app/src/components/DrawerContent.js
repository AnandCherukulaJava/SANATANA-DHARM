import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchChannels, createChannel, joinChannel, leaveChannel } from '../store/channelSlice';
import { logout } from '../store/authSlice';

const DrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { channels, joinedChannels, loading } = useSelector(state => state.channels);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    category: 'general'
  });

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

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) {
      Alert.alert('Error', 'Please enter a channel name');
      return;
    }

    try {
      await dispatch(createChannel(newChannel)).unwrap();
      setNewChannel({ name: '', description: '', category: 'general' });
      setShowCreateModal(false);
      dispatch(fetchChannels());
      Alert.alert('Success', 'Channel created successfully!');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to create channel');
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      await dispatch(joinChannel(channelId)).unwrap();
      dispatch(fetchChannels());
      Alert.alert('Success', 'Joined channel successfully!');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to join channel');
    }
  };

  const handleLeaveChannel = async (channelId) => {
    Alert.alert(
      'Leave Channel',
      'Are you sure you want to leave this channel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(leaveChannel(channelId)).unwrap();
              dispatch(fetchChannels());
              Alert.alert('Success', 'Left channel successfully!');
            } catch (error) {
              Alert.alert('Error', error || 'Failed to leave channel');
            }
          }
        }
      ]
    );
  };

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
            dispatch(logout());
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const navigateToChannel = (channelId) => {
    navigation.navigate('Channel', { channelId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕉️ SANATANA-DHARM</Text>
        <Text style={styles.headerSubtitle}>Spiritual Community</Text>
      </View>

      {/* User Profile */}
      <View style={styles.userProfile}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Create Channel Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>➕ Create Channel</Text>
        </TouchableOpacity>

        {/* Joined Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 My Channels ({joinedChannels.length})</Text>
          {joinedChannels.length > 0 ? (
            joinedChannels.map(channel => (
              <TouchableOpacity
                key={channel.id}
                style={styles.channelItem}
                onPress={() => navigateToChannel(channel.id)}
              >
                <View style={styles.channelInfo}>
                  <Text style={styles.channelIcon}>
                    {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                  </Text>
                  <View style={styles.channelDetails}>
                    <Text style={styles.channelName}>{channel.name}</Text>
                    <Text style={styles.channelMembers}>{channel.memberCount} members</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleLeaveChannel(channel.id)}
                  style={styles.leaveButton}
                >
                  <Text style={styles.leaveButtonText}>🚪</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No channels joined yet</Text>
          )}
        </View>

        {/* Discover Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Discover Channels</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            channels
              .filter(channel => !joinedChannels.some(joined => joined.id === channel.id))
              .slice(0, 10)
              .map(channel => (
                <View key={channel.id} style={styles.channelItem}>
                  <TouchableOpacity
                    style={styles.channelInfo}
                    onPress={() => navigateToChannel(channel.id)}
                  >
                    <Text style={styles.channelIcon}>
                      {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                    </Text>
                    <View style={styles.channelDetails}>
                      <Text style={styles.channelName}>{channel.name}</Text>
                      <Text style={styles.channelMembers}>{channel.memberCount} members</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => handleJoinChannel(channel.id)}
                  >
                    <Text style={styles.joinButtonText}>Join</Text>
                  </TouchableOpacity>
                </View>
              ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>"सत्यमेव जयते" - Truth Alone Triumphs</Text>
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
            
            <Text style={styles.inputLabel}>Channel Name *</Text>
            <TextInput
              style={styles.textInput}
              value={newChannel.name}
              onChangeText={(text) => setNewChannel({...newChannel, name: text})}
              placeholder="Enter channel name"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newChannel.description}
              onChangeText={(text) => setNewChannel({...newChannel, description: text})}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Category *</Text>
            <ScrollView style={styles.categoryList} horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryItem,
                    newChannel.category === category.value && styles.categoryItemSelected
                  ]}
                  onPress={() => setNewChannel({...newChannel, category: category.value})}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    newChannel.category === category.value && styles.categoryLabelSelected
                  ]}>
                    {category.label.replace(/^[^\s]+ /, '')}
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
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateChannel}
              >
                <Text style={styles.createModalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 14,
    marginTop: 4,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  createButton: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  channelInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  channelMembers: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  leaveButton: {
    padding: 8,
  },
  leaveButtonText: {
    fontSize: 16,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryList: {
    maxHeight: 100,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    minWidth: 80,
  },
  categoryItemSelected: {
    backgroundColor: '#6366f1',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  createModalButton: {
    backgroundColor: '#6366f1',
  },
  createModalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DrawerContent;