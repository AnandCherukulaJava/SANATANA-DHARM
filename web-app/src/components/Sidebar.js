import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChannels, createChannel, joinChannel, leaveChannel } from '../store/channelSlice';
import { logout } from '../store/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createChannel(newChannel)).unwrap();
      setNewChannel({ name: '', description: '', category: 'general' });
      setShowCreateModal(false);
      dispatch(fetchChannels());
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      await dispatch(joinChannel(channelId)).unwrap();
      dispatch(fetchChannels());
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const handleLeaveChannel = async (channelId) => {
    try {
      await dispatch(leaveChannel(channelId)).unwrap();
      dispatch(fetchChannels());
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigateToChannel = (channelId) => {
    navigate(`/channel/${channelId}`);
    if (window.innerWidth < 768) {
      onClose();
    }
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
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🕉️ SANATANA-DHARM</h2>
              <p className="text-purple-100 text-sm">Spiritual Community</p>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-white hover:text-purple-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user?.username || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 text-sm"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Create Channel Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>➕</span>
              <span>Create Channel</span>
            </button>
          </div>

          {/* Joined Channels */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">📋</span>
              My Channels ({joinedChannels.length})
            </h3>
            {joinedChannels.length > 0 ? (
              <div className="space-y-2">
                {joinedChannels.map(channel => (
                  <div
                    key={channel.id}
                    onClick={() => navigateToChannel(channel.id)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{channel.name}</p>
                        <p className="text-xs text-gray-500">{channel.memberCount} members</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveChannel(channel.id);
                      }}
                      className="text-red-400 hover:text-red-600 text-sm"
                      title="Leave Channel"
                    >
                      🚪
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No channels joined yet</p>
            )}
          </div>

          {/* Discover Channels */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🔍</span>
              Discover Channels
            </h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {channels
                  .filter(channel => !joinedChannels.some(joined => joined.id === channel.id))
                  .slice(0, 10)
                  .map(channel => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div 
                        onClick={() => navigateToChannel(channel.id)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <span className="text-lg">
                          {categories.find(cat => cat.value === channel.category)?.icon || '🕉️'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{channel.name}</p>
                          <p className="text-xs text-gray-500">{channel.memberCount} members</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinChannel(channel.id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            "सत्यमेव जयते" - Truth Alone Triumphs
          </p>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Channel</h3>
            <form onSubmit={handleCreateChannel}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name *
                </label>
                <input
                  type="text"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newChannel.category}
                  onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create
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