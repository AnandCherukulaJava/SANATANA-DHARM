import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannelById, fetchChannelPosts, createPost, joinChannel, leaveChannel } from '../store/channelSlice';

const Channel = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPost({ channelId, postData: newPost })).unwrap();
      setNewPost({ title: '', content: '', type: 'discussion' });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleJoinChannel = async () => {
    try {
      await dispatch(joinChannel(channelId)).unwrap();
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const handleLeaveChannel = async () => {
    try {
      await dispatch(leaveChannel(channelId)).unwrap();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Channel Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentChannel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    {categories.find(cat => cat.value === currentChannel.category)?.icon || '🕉️'}
                  </span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentChannel.name}</h1>
                    <p className="text-gray-600">{currentChannel.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {currentChannel.memberCount} members
                      </span>
                      <span className="text-sm text-gray-500">
                        {categories.find(cat => cat.value === currentChannel.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isJoined ? (
                  <>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Create Post</span>
                    </button>
                    <button
                      onClick={handleLeaveChannel}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Leave Channel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleJoinChannel}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Join Channel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isJoined ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join to Participate</h2>
            <p className="text-gray-600 mb-6">
              Join this channel to view posts and participate in discussions about {currentChannel.name}.
            </p>
            <button
              onClick={handleJoinChannel}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Join Channel
            </button>
          </div>
        ) : (
          <>
            {/* Posts */}
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : postsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">{postsError}</p>
              </div>
            ) : currentChannelPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
                <p className="text-gray-600 mb-6">
                  Be the first to start a discussion in this channel!
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentChannelPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author?.username || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {postTypes.find(type => type.value === post.type)?.icon || '💬'}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {postTypes.find(type => type.value === post.type)?.label || 'Discussion'}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <span>👍</span>
                        <span>{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <span>💬</span>
                        <span>{post.comments || 0} comments</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                        <span>🔗</span>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Create New Post</h3>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Type *
                </label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {postTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter post title..."
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="6"
                  placeholder="Share your thoughts, questions, or experiences..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;