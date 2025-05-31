import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannelPosts, createPost, setCurrentChannel } from '../store/channelSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const Channel = () => {
  const { channelId } = useParams();
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

  const posts = channelPosts[channelId] || [];
  const channel = joinedChannels.find(c => c.id === parseInt(channelId));

  useEffect(() => {
    if (channelId && channel) {
      dispatch(setCurrentChannel(channel));
      dispatch(fetchChannelPosts(channelId));
    }
  }, [channelId, channel, dispatch]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      setCreatePostLoading(true);
      try {
        await dispatch(createPost({ 
          channelId: parseInt(channelId), 
          postData: newPost 
        }));
        setNewPost({ title: '', content: '', type: 'question' });
        setShowCreatePost(false);
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setCreatePostLoading(false);
      }
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
      question: 'bg-blue-100 text-blue-800',
      discussion: 'bg-green-100 text-green-800',
      sharing: 'bg-purple-100 text-purple-800',
      prayer: 'bg-yellow-100 text-yellow-800',
      experience: 'bg-pink-100 text-pink-800',
      guidance: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Channel Not Found</h2>
          <p className="text-gray-500">You may need to join this channel first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Channel Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {currentChannel?.category === 'scriptures' && '📚'}
              {currentChannel?.category === 'philosophy' && '🧘'}
              {currentChannel?.category === 'rituals' && '🔥'}
              {currentChannel?.category === 'festivals' && '🎉'}
              {currentChannel?.category === 'meditation' && '🧘‍♂️'}
              {currentChannel?.category === 'yoga' && '🤸'}
              {currentChannel?.category === 'devotion' && '🙏'}
              {currentChannel?.category === 'questions' && '❓'}
              {currentChannel?.category === 'community' && '👥'}
              {!currentChannel?.category && '🕉️'}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{currentChannel?.name}</h1>
              <p className="text-sm text-gray-600">{currentChannel?.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Post</span>
          </button>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleCreatePost}>
              <div className="mb-3">
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="question">❓ Question</option>
                  <option value="discussion">💬 Discussion</option>
                  <option value="sharing">📖 Scripture Sharing</option>
                  <option value="prayer">🙏 Prayer Request</option>
                  <option value="experience">✨ Spiritual Experience</option>
                  <option value="guidance">🧭 Seeking Guidance</option>
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="Share your thoughts, questions, or experiences about Sanatana Dharma..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={createPostLoading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {createPostLoading ? 'Posting...' : 'Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Posts Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕉️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share something in this channel!</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{post.author?.username || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                    {getPostTypeIcon(post.type)} {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                <div className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-purple-600">
                    <span>👍</span>
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-purple-600">
                    <span>💬</span>
                    <span>{post.comments?.length || 0} replies</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-purple-600">
                    <span>🔗</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;