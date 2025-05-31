import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  setCurrentChannel,
  clearChannelError
} from '../store/channelSlice';
import { logout } from '../store/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    channels, 
    joinedChannels, 
    currentChannel, 
    loading, 
    createChannelLoading,
    error 
  } = useSelector((state) => state.channels);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    category: 'general'
  });

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (newChannel.name.trim()) {
      const result = await dispatch(createChannel(newChannel));
      if (createChannel.fulfilled.match(result)) {
        setNewChannel({ name: '', description: '', category: 'general' });
        setShowCreateForm(false);
      }
    }
  };

  const handleJoinChannel = (channel) => {
    dispatch(joinChannel(channel.id));
  };

  const handleLeaveChannel = (channelId) => {
    dispatch(leaveChannel(channelId));
  };

  const handleChannelSelect = (channel) => {
    dispatch(setCurrentChannel(channel));
    navigate(`/channels/${channel.id}`);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🕉️</span>
                <h2 className="text-lg font-bold">SANATANA-DHARM</h2>
              </div>
              <button
                onClick={onClose}
                className="md:hidden text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-purple-100 mt-1">Welcome, {user?.username}</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">🏠</span>
                <span className="font-medium">Dashboard</span>
              </button>
              
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">⚙️</span>
                  <span className="font-medium">Admin Panel</span>
                </button>
              )}
            </div>

            {/* Joined Channels */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">My Channels</h3>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="text-purple-600 hover:text-purple-700 text-xl"
                  title="Create Channel"
                >
                  +
                </button>
              </div>

              {/* Create Channel Form */}
              {showCreateForm && (
                <form onSubmit={handleCreateChannel} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Channel name"
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                    required
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newChannel.description}
                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm h-16 resize-none"
                  />
                  <select
                    value={newChannel.category}
                    onChange={(e) => setNewChannel({ ...newChannel, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={createChannelLoading}
                      className="flex-1 bg-purple-600 text-white p-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    >
                      {createChannelLoading ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Joined Channels List */}
              <div className="space-y-1">
                {joinedChannels.map((channel) => (
                  <div key={channel.id} className="group">
                    <button
                      onClick={() => handleChannelSelect(channel)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        currentChannel?.id === channel.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {categories.find(c => c.value === channel.category)?.icon || '📝'}
                        </span>
                        <span className="text-sm font-medium truncate">{channel.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveChannel(channel.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
                        title="Leave Channel"
                      >
                        ✕
                      </button>
                    </button>
                  </div>
                ))}
                
                {joinedChannels.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No channels joined yet
                  </p>
                )}
              </div>
            </div>

            {/* Discover Channels */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Discover Channels</h3>
                <button
                  onClick={() => setShowAllChannels(!showAllChannels)}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  {showAllChannels ? 'Hide' : 'Show All'}
                </button>
              </div>

              {showAllChannels && (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {channels
                    .filter(channel => !joinedChannels.find(jc => jc.id === channel.id))
                    .map((channel) => (
                      <div key={channel.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-sm">
                            {categories.find(c => c.value === channel.category)?.icon || '📝'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{channel.name}</p>
                            <p className="text-xs text-gray-500 truncate">{channel.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinChannel(channel)}
                          className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
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
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border-t border-red-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => dispatch(clearChannelError())}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;