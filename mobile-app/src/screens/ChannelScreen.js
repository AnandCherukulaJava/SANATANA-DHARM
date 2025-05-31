import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { fetchChannelPosts, createPost, setCurrentChannel } from '../store/channelSlice';

const ChannelScreen = () => {
  const route = useRoute();
  const { channelId } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    currentChannel, 
    channelPosts, 
    joinedChannels,
    loading 
  } = useSelector((state) => state.channels);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'question'
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const posts = channelPosts[channelId] || [];
  const channel = joinedChannels.find(c => c.id === parseInt(channelId));

  useEffect(() => {
    if (channelId && channel) {
      dispatch(setCurrentChannel(channel));
      dispatch(fetchChannelPosts(channelId));
    }
  }, [channelId, channel, dispatch]);

  const handleCreatePost = async () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      setCreatePostLoading(true);
      try {
        await dispatch(createPost({ 
          channelId: parseInt(channelId), 
          postData: newPost 
        }));
        setNewPost({ title: '', content: '', type: 'question' });
        setShowCreatePost(false);
        Alert.alert('Success', 'Post created successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to create post');
      } finally {
        setCreatePostLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchChannelPosts(channelId));
    setRefreshing(false);
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

  const getPostTypeIcon = (type) => {
    const icons = {
      question: '❓',
      discussion: '💬',
      sharing: '📖',
      prayer: '🙏',
      experience: '✨',
      guidance: '🧭'
    };
    return icons[type] || '📝';
  };

  const getPostTypeColor = (type) => {
    const colors = {
      question: '#3b82f6',
      discussion: '#10b981',
      sharing: '#8b5cf6',
      prayer: '#f59e0b',
      experience: '#ec4899',
      guidance: '#6366f1'
    };
    return colors[type] || '#6b7280';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      scriptures: '📚',
      philosophy: '🧘',
      rituals: '🔥',
      festivals: '🎉',
      meditation: '🧘‍♂️',
      yoga: '🤸',
      devotion: '🙏',
      questions: '❓',
      community: '👥',
      general: '🕉️'
    };
    return icons[category] || '🕉️';
  };

  if (!channel) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Channel Not Found</Text>
          <Text style={styles.errorText}>You may need to join this channel first.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Channel Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>
            {getCategoryIcon(currentChannel?.category)}
          </Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{currentChannel?.name}</Text>
            <Text style={styles.headerSubtitle}>{currentChannel?.description}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreatePost(true)}
        >
          <Text style={styles.createButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🕉️</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Be the first to share something in this channel!</Text>
            <TouchableOpacity
              style={styles.firstPostButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Text style={styles.firstPostButtonText}>Create First Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.postsContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View style={styles.authorDetails}>
                      <Text style={styles.authorName}>
                        {post.author?.username || 'Anonymous'}
                      </Text>
                      <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                    </View>
                  </View>
                  <View style={[styles.postType, { backgroundColor: getPostTypeColor(post.type) + '20' }]}>
                    <Text style={[styles.postTypeText, { color: getPostTypeColor(post.type) }]}>
                      {getPostTypeIcon(post.type)} {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content}</Text>
                
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>👍</Text>
                    <Text style={styles.actionText}>{post.likes || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{post.comments?.length || 0} replies</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🔗</Text>
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
            
            <Text style={styles.label}>Post Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {[
                { value: 'question', label: '❓ Question' },
                { value: 'discussion', label: '💬 Discussion' },
                { value: 'sharing', label: '📖 Scripture Sharing' },
                { value: 'prayer', label: '🙏 Prayer Request' },
                { value: 'experience', label: '✨ Spiritual Experience' },
                { value: 'guidance', label: '🧭 Seeking Guidance' }
              ].map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeItem,
                    newPost.type === type.value && styles.selectedType
                  ]}
                  onPress={() => setNewPost({ ...newPost, type: type.value })}
                >
                  <Text style={styles.typeText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TextInput
              style={styles.input}
              placeholder="Post title..."
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your thoughts, questions, or experiences about Sanatana Dharma..."
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
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
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleCreatePost}
                disabled={createPostLoading}
              >
                <Text style={styles.submitButtonText}>
                  {createPostLoading ? 'Posting...' : 'Post'}
                </Text>
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
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  firstPostButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  firstPostButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  postDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  postType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  typeScroll: {
    marginBottom: 16,
  },
  typeItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedType: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  typeText: {
    fontSize: 14,
    color: '#374151',
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
    height: 120,
    textAlignVertical: 'top',
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
  submitButton: {
    backgroundColor: '#667eea',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
});

export default ChannelScreen;