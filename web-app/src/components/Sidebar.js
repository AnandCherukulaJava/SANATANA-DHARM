import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchChannels, createChannel, joinChannel, leaveChannel } from '../store/channelSlice';
import { logout } from '../store/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { channels = [], joinedChannels = [], loading, error } = useSelector(state => state.channels);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    category: 'general'
  });

  // Enhanced spiritual categories with better organization
  const categories = [
    { value: 'general', label: '🕉️ General Discussion', icon: '🕉️', description: 'General spiritual discussions' },
    { value: 'scriptures', label: '📚 Sacred Scriptures', icon: '📚', description: 'Vedas, Upanishads, Puranas' },
    { value: 'philosophy', label: '🧘 Philosophy', icon: '🧘', description: 'Spiritual philosophy and wisdom' },
    { value: 'rituals', label: '🔥 Rituals & Practices', icon: '🔥', description: 'Traditional rituals and ceremonies' },
    { value: 'festivals', label: '🎉 Festivals & Celebrations', icon: '🎉', description: 'Hindu festivals and celebrations' },
    { value: 'meditation', label: '🧘‍♂️ Meditation & Yoga', icon: '🧘‍♂️', description: 'Meditation techniques and yoga' },
    { value: 'devotion', label: '🙏 Devotion & Bhakti', icon: '🙏', description: 'Devotional practices and bhakti' },
    { value: 'questions', label: '❓ Questions & Answers', icon: '❓', description: 'Ask and answer spiritual questions' },
    { value: 'community', label: '👥 Community', icon: '👥', description: 'Community discussions and events' },
    { value: 'teachings', label: '📖 Teachings & Wisdom', icon: '📖', description: 'Spiritual teachings and guidance' }
  ];

  // Navigation items for quick access
  const navigationItems = [
    { path: '/dashboard', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/profile', label: '👤 Profile', icon: '👤' },
    { path: '/settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    if (user) {
      dispatch(fetchChannels()).catch(err => {
        console.warn('Failed to fetch channels:', err);
      });
    }
  }, [dispatch, user]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannel.name.trim()) {
      alert('Please enter a channel name');
      return;
    }
    
    setCreateLoading(true);
    try {
      await dispatch(createChannel(newChannel)).unwrap();
      setNewChannel({ name: '', description: '', category: 'general' });
      setShowCreateModal(false);
      // Refresh channels list
      dispatch(fetchChannels());
      alert('Channel created successfully!');
    } catch (error) {
      console.error('Failed to create channel:', error);
      alert('Failed to create channel. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      await dispatch(joinChannel(channelId)).unwrap();
      dispatch(fetchChannels());
    } catch (error) {
      console.error('Failed to join channel:', error);
      alert('Failed to join channel. Please try again.');
    }
  };

  const handleLeaveChannel = async (channelId) => {
    if (!window.confirm('Are you sure you want to leave this channel?')) {
      return;
    }
    
    try {
      await dispatch(leaveChannel(channelId)).unwrap();
      dispatch(fetchChannels());
    } catch (error) {
      console.error('Failed to leave channel:', error);
      alert('Failed to leave channel. Please try again.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navigateToChannel = (channelId) => {
    navigate(`/channel/${channelId}`);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const navigateToPage = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                <span className="mr-2">🕉️</span>
                SANATANA-DHARM
              </h2>
              <p className="text-orange-100 text-sm mt-1">Eternal Spiritual Path</p>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-white hover:text-orange-200 transition-colors p-1 rounded"
              title="Close Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user?.username || user?.firstName || 'Devotee'}
              </p>
              <p className="text-sm text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateToPage(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActivePage(item.path)
                    ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label.replace(/^[^\s]+ /, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Create Channel Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">Create Channel</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 border-b border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">Failed to load channels</p>
                </div>
              </div>
            </div>
          )}

          {/* Joined Channels */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <span className="mr-2">📋</span>
              My Channels ({joinedChannels.length})
            </h3>
            {joinedChannels.length > 0 ? (
              <div className="space-y-2">
                {joinedChannels.map(channel => (
                  <div
                    key={channel.id}
                    onClick={() => navigateToChannel(channel.id)}
                    className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">
                        {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate group-hover:text-orange-700">
                          {channel.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {channel.memberCount || 0} members
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveChannel(channel.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Leave Channel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 text-4xl mb-2">🏛️</div>
                <p className="text-gray-500 text-sm">No channels joined yet</p>
                <p className="text-gray-400 text-xs mt-1">Discover channels below to get started</p>
              </div>
            )}
          </div>

          {/* Discover Channels */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <span className="mr-2">🔍</span>
              Discover Channels
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading channels...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {channels
                  .filter(channel => !joinedChannels.some(joined => joined.id === channel.id))
                  .slice(0, 15)
                  .map(channel => (
                    <div
                      key={channel.id}
                      className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-all duration-200 border border-transparent hover:border-purple-200"
                    >
                      <div 
                        onClick={() => navigateToChannel(channel.id)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer min-w-0"
                      >
                        <span className="text-lg flex-shrink-0">
                          {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate group-hover:text-purple-700">
                            {channel.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {channel.memberCount || 0} members • {categories.find(cat => cat.value === channel.category)?.label.replace(/^[^\s]+ /, '') || 'General'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinChannel(channel.id)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex-shrink-0"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                {channels.filter(channel => !joinedChannels.some(joined => joined.id === channel.id)).length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-gray-400 text-4xl mb-2">🌟</div>
                    <p className="text-gray-500 text-sm">All available channels joined!</p>
                    <p className="text-gray-400 text-xs mt-1">Create a new channel to start discussions</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-purple-50 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">
              "सत्यमेव जयते"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Truth Alone Triumphs
            </p>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🏛️</span>
                Create New Channel
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Channel Name *
                </label>
                <input
                  type="text"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter channel name..."
                  required
                  disabled={createLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Describe your channel's purpose..."
                  disabled={createLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newChannel.category}
                  onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                  disabled={createLoading}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {categories.find(cat => cat.value === newChannel.category)?.description}
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Channel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;