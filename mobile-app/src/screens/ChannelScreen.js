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
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchChannelById, 
  fetchChannelPosts, 
  createPost, 
  joinChannel, 
  leaveChannel 
} from '../store/channelSlice';

const ChannelScreen = ({ route, navigation }) => {
  const { channelId } = route.params;
  const dispatch = useDispatch();
  
  const { 
    currentChannel, 
    currentChannelPosts, 
    joinedChannels,
    loading, 
    postsLoading, 
    error, 
    postsError 
  } = useSelector(state => state.channels);
  
  const { user } = useSelector(state => state.auth);
  
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion'
  });

  const postTypes = [
    { value: 'question', label: '❓ Question', icon: '❓' },
    { value: 'discussion', label: '💬 Discussion', icon: '💬' },
    { value: 'sharing', label: '📖 Scripture Sharing', icon: '📖' },
    { value: 'prayer', label: '🙏 Prayer Request', icon: '🙏' },
    { value: 'experience', label: '✨ Spiritual Experience', icon: '✨' },
    { value: 'guidance', label: '🧭 Seeking Guidance', icon: '🧭' }
  ];

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
    if (channelId) {
      dispatch(fetchChannelById(channelId));
      dispatch(fetchChannelPosts(channelId));
    }
  }, [dispatch, channelId]);

  const isJoined = joinedChannels.some(channel => channel.id === parseInt(channelId));

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createPost({ channelId, postData: newPost })).unwrap();
      setNewPost({ title: '', content: '', type: 'discussion' });
      setShowCreatePost(false);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to create post');
    }
  };

  const handleJoinChannel = async () => {
    try {
      await dispatch(joinChannel(channelId)).unwrap();
      Alert.alert('Success', 'Joined channel successfully!');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to join channel');
    }
  };

  const handleLeaveChannel = async () => {
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
              Alert.alert('Success', 'Left channel successfully!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error || 'Failed to leave channel');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading channel...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Channel Not Found</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentChannel) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.channelInfo}>
          <View style={styles.channelTitleRow}>
            <Text style={styles.channelIcon}>
              {categories.find(cat => cat.value === currentChannel.category)?.icon || '🕉️'}
            </Text>
            <Text style={styles.channelName}>{currentChannel.name}</Text>
          </View>
          <Text style={styles.channelDescription}>{currentChannel.description}</Text>
          <Text style={styles.channelMeta}>
            {currentChannel.memberCount} members • {categories.find(cat => cat.value === currentChannel.category)?.label}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          {isJoined ? (
            <>
              <TouchableOpacity
                style={styles.createPostButton}
                onPress={() => setShowCreatePost(true)}
              >
                <Text style={styles.createPostButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={handleLeaveChannel}
              >
                <Text style={styles.leaveButtonText}>Leave</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinChannel}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {!isJoined ? (
          <View style={styles.joinPrompt}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.joinPromptTitle}>Join to Participate</Text>
            <Text style={styles.joinPromptMessage}>
              Join this channel to view posts and participate in discussions about {currentChannel.name}.
            </Text>
            <TouchableOpacity
              style={styles.joinPromptButton}
              onPress={handleJoinChannel}
            >
              <Text style={styles.joinPromptButtonText}>Join Channel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {postsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading posts...</Text>
              </View>
            ) : postsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{postsError}</Text>
              </View>
            ) : currentChannelPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No Posts Yet</Text>
                <Text style={styles.emptyMessage}>
                  Be the first to start a discussion in this channel!
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setShowCreatePost(true)}
                >
                  <Text style={styles.emptyButtonText}>Create First Post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.posts}>
                {currentChannelPosts.map(post => (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <View style={styles.postAuthor}>
                        <View style={styles.authorAvatar}>
                          <Text style={styles.authorAvatarText}>
                            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                          </Text>
                        </View>
                        <View style={styles.authorInfo}>
                          <Text style={styles.authorName}>
                            {post.author?.username || 'Anonymous'}
                          </Text>
                          <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                        </View>
                      </View>
                      <View style={styles.postType}>
                        <Text style={styles.postTypeIcon}>
                          {postTypes.find(type => type.value === post.type)?.icon || '💬'}
                        </Text>
                        <Text style={styles.postTypeLabel}>
                          {postTypes.find(type => type.value === post.type)?.label || 'Discussion'}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postContent}>{post.content}</Text>
                    
                    <View style={styles.postActions}>
                      <TouchableOpacity style={styles.postAction}>
                        <Text style={styles.postActionIcon}>👍</Text>
                        <Text style={styles.postActionText}>{post.likes || 0}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.postAction}>
                        <Text style={styles.postActionIcon}>💬</Text>
                        <Text style={styles.postActionText}>{post.comments || 0} comments</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.postAction}>
                        <Text style={styles.postActionIcon}>🔗</Text>
                        <Text style={styles.postActionText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            
            <Text style={styles.inputLabel}>Post Type *</Text>
            <ScrollView style={styles.typeList} horizontal showsHorizontalScrollIndicator={false}>
              {postTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeItem,
                    newPost.type === type.value && styles.typeItemSelected
                  ]}
                  onPress={() => setNewPost({...newPost, type: type.value})}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeLabel,
                    newPost.type === type.value && styles.typeLabelSelected
                  ]}>
                    {type.label.replace(/^[^\s]+ /, '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={newPost.title}
              onChangeText={(text) => setNewPost({...newPost, title: text})}
              placeholder="Enter post title..."
            />
            
            <Text style={styles.inputLabel}>Content *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newPost.content}
              onChangeText={(text) => setNewPost({...newPost, content: text})}
              placeholder="Share your thoughts, questions, or experiences..."
              multiline
              numberOfLines={6}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreatePost(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreatePost}
              >
                <Text style={styles.createModalButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#6366f1',
    fontSize: 16,
  },
  channelInfo: {
    marginBottom: 12,
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  channelIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  channelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  channelDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  channelMeta: {
    fontSize: 14,
    color: '#9ca3af',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  createPostButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createPostButtonText: {
    color: 'white',
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  joinPrompt: {
    alignItems: 'center',
    padding: 40,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  joinPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  joinPromptMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  joinPromptButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinPromptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  posts: {
    padding: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1f2937',
  },
  postDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  postType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  postTypeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  postTypeLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  postActionText: {
    fontSize: 12,
    color: '#6b7280',
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
    maxHeight: '90%',
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
  typeList: {
    maxHeight: 80,
    marginBottom: 8,
  },
  typeItem: {
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    minWidth: 60,
  },
  typeItemSelected: {
    backgroundColor: '#6366f1',
  },
  typeIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: 'white',
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
    height: 120,
    textAlignVertical: 'top',
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

export default ChannelScreen;