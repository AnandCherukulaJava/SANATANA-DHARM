import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDashboard, getUserProfile } from '../store/userSlice';
import { fetchChannels } from '../store/channelSlice';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboard, profile, loading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { channels, joinedChannels } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(getUserDashboard());
    dispatch(getUserProfile());
    dispatch(fetchChannels());
  }, [dispatch]);

  const categories = [
    { value: 'general', label: 'General', icon: '🕉️', color: 'bg-purple-100 text-purple-800' },
    { value: 'scriptures', label: 'Scriptures', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    { value: 'philosophy', label: 'Philosophy', icon: '🧘', color: 'bg-green-100 text-green-800' },
    { value: 'rituals', label: 'Rituals & Practices', icon: '🔥', color: 'bg-red-100 text-red-800' },
    { value: 'festivals', label: 'Festivals', icon: '🎉', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'meditation', label: 'Meditation', icon: '🧘‍♂️', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'yoga', label: 'Yoga', icon: '🤸', color: 'bg-pink-100 text-pink-800' },
    { value: 'devotion', label: 'Devotion & Bhakti', icon: '🙏', color: 'bg-orange-100 text-orange-800' },
    { value: 'questions', label: 'Questions & Answers', icon: '❓', color: 'bg-teal-100 text-teal-800' },
    { value: 'community', label: 'Community', icon: '👥', color: 'bg-gray-100 text-gray-800' }
  ];

  const recentChannels = joinedChannels.slice(0, 6);
  const popularChannels = channels.slice(0, 8);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
              🕉️
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome to SANATANA-DHARM</h1>
              <p className="text-purple-100">
                Namaste, {user?.username}! Join channels and share your spiritual journey.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joined Channels</p>
                <p className="text-xl font-bold text-gray-800">{joinedChannels.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🌐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Channels</p>
                <p className="text-xl font-bold text-gray-800">{channels.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">✨</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Posts</p>
                <p className="text-xl font-bold text-gray-800">{dashboard?.totalPosts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600">🙏</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Karma Points</p>
                <p className="text-xl font-bold text-gray-800">{dashboard?.karmaPoints || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Channels */}
        {recentChannels.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Recent Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentChannels.map((channel) => {
                const category = categories.find(c => c.value === channel.category);
                return (
                  <div
                    key={channel.id}
                    onClick={() => navigate(`/channels/${channel.id}`)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{category?.icon || '📝'}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 truncate">{channel.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${category?.color || 'bg-gray-100 text-gray-800'}`}>
                          {category?.label || 'General'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{channel.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Explore Categories */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((category) => (
              <div
                key={category.value}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-gray-700">{category.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Channels */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularChannels.map((channel) => {
              const category = categories.find(c => c.value === channel.category);
              const isJoined = joinedChannels.find(jc => jc.id === channel.id);
              
              return (
                <div key={channel.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{category?.icon || '📝'}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 truncate">{channel.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${category?.color || 'bg-gray-100 text-gray-800'}`}>
                        {category?.label || 'General'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{channel.description}</p>
                  <button
                    onClick={() => {
                      if (isJoined) {
                        navigate(`/channels/${channel.id}`);
                      } else {
                        // Handle join channel logic
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isJoined
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isJoined ? 'View Channel' : 'Join Channel'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spiritual Quote */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🕉️</div>
          <blockquote className="text-lg font-medium mb-2">
            "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।<br />
            अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥"
          </blockquote>
          <p className="text-orange-100 text-sm">
            "Whenever there is a decline in dharma and rise in adharma, I manifest myself." - Bhagavad Gita 4.7
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;