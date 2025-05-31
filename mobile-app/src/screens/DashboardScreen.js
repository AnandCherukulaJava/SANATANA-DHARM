import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchChannels } from '../store/channelSlice';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const { channels, joinedChannels, loading } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchChannels());
  };

  const categories = [
    { value: 'general', label: 'General', icon: '🕉️', color: '#8b5cf6' },
    { value: 'scriptures', label: 'Scriptures', icon: '📚', color: '#3b82f6' },
    { value: 'philosophy', label: 'Philosophy', icon: '🧘', color: '#10b981' },
    { value: 'rituals', label: 'Rituals & Practices', icon: '🔥', color: '#ef4444' },
    { value: 'festivals', label: 'Festivals', icon: '🎉', color: '#f59e0b' },
    { value: 'meditation', label: 'Meditation', icon: '🧘‍♂️', color: '#6366f1' },
    { value: 'yoga', label: 'Yoga', icon: '🤸', color: '#ec4899' },
    { value: 'devotion', label: 'Devotion & Bhakti', icon: '🙏', color: '#f97316' },
    { value: 'questions', label: 'Questions & Answers', icon: '❓', color: '#14b8a6' },
    { value: 'community', label: 'Community', icon: '👥', color: '#6b7280' }
  ];

  const recentChannels = joinedChannels.slice(0, 4);
  const popularChannels = channels.slice(0, 6);

  const handleChannelPress = (channel) => {
    navigation.navigate('Channel', { 
      channelId: channel.id,
      channelName: channel.name 
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeIcon}>
          <Text style={styles.welcomeIconText}>🕉️</Text>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome to SANATANA-DHARM</Text>
          <Text style={styles.welcomeSubtitle}>
            Namaste, {user?.username}! Join channels and share your spiritual journey.
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#e0e7ff' }]}>
            <Text style={styles.statIconText}>📚</Text>
          </View>
          <Text style={styles.statNumber}>{joinedChannels.length}</Text>
          <Text style={styles.statLabel}>Joined Channels</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.statIconText}>🌐</Text>
          </View>
          <Text style={styles.statNumber}>{channels.length}</Text>
          <Text style={styles.statLabel}>Total Channels</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.statIconText}>✨</Text>
          </View>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Your Posts</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
            <Text style={styles.statIconText}>🙏</Text>
          </View>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Karma Points</Text>
        </View>
      </View>

      {/* Recent Channels */}
      {recentChannels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Recent Channels</Text>
          <View style={styles.channelsGrid}>
            {recentChannels.map((channel) => {
              const category = categories.find(c => c.value === channel.category);
              return (
                <TouchableOpacity
                  key={channel.id}
                  style={styles.channelCard}
                  onPress={() => handleChannelPress(channel)}
                >
                  <Text style={styles.channelIcon}>{category?.icon || '📝'}</Text>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {channel.name}
                  </Text>
                  <View style={[styles.categoryBadge, { backgroundColor: category?.color + '20' }]}>
                    <Text style={[styles.categoryText, { color: category?.color }]}>
                      {category?.label || 'General'}
                    </Text>
                  </View>
                  <Text style={styles.channelDesc} numberOfLines={2}>
                    {channel.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Explore Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore by Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.value} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Channels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Channels</Text>
        <View style={styles.popularChannels}>
          {popularChannels.map((channel) => {
            const category = categories.find(c => c.value === channel.category);
            const isJoined = joinedChannels.find(jc => jc.id === channel.id);
            
            return (
              <View key={channel.id} style={styles.popularChannelCard}>
                <View style={styles.popularChannelHeader}>
                  <Text style={styles.channelIcon}>{category?.icon || '📝'}</Text>
                  <View style={styles.popularChannelInfo}>
                    <Text style={styles.popularChannelName} numberOfLines={1}>
                      {channel.name}
                    </Text>
                    <View style={[styles.categoryBadge, { backgroundColor: category?.color + '20' }]}>
                      <Text style={[styles.categoryText, { color: category?.color }]}>
                        {category?.label || 'General'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.popularChannelDesc} numberOfLines={2}>
                  {channel.description}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.channelButton,
                    isJoined ? styles.viewButton : styles.joinButton
                  ]}
                  onPress={() => {
                    if (isJoined) {
                      handleChannelPress(channel);
                    } else {
                      // Handle join channel logic
                    }
                  }}
                >
                  <Text style={[
                    styles.channelButtonText,
                    isJoined ? styles.viewButtonText : styles.joinButtonText
                  ]}>
                    {isJoined ? 'View Channel' : 'Join Channel'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Spiritual Quote */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteIcon}>🕉️</Text>
        <Text style={styles.quoteSanskrit}>
          यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।{'\n'}
          अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥
        </Text>
        <Text style={styles.quoteTranslation}>
          "Whenever there is a decline in dharma and rise in adharma, I manifest myself." - Bhagavad Gita 4.7
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  welcomeSection: {
    backgroundColor: '#667eea',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeIconText: {
    fontSize: 24,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: '#e0e7ff',
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  channelCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  channelIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  channelDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  popularChannels: {
    gap: 12,
  },
  popularChannelCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularChannelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularChannelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  popularChannelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  popularChannelDesc: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  channelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#667eea',
  },
  viewButton: {
    backgroundColor: '#dcfce7',
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  joinButtonText: {
    color: 'white',
  },
  viewButtonText: {
    color: '#16a34a',
  },
  quoteSection: {
    backgroundColor: '#f97316',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  quoteSanskrit: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteTranslation: {
    color: '#fed7aa',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DashboardScreen;