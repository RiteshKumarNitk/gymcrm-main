import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ChartBarIcon,
  HeartIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const MemberCard = ({ member, onEdit, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 font-semibold text-lg">
          {member.name?.charAt(0) || '?'}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.phone}</p>
        <p className="text-sm text-gray-500">{member.email}</p>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          member.memberInfo?.membershipStatus === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {member.memberInfo?.membershipStatus || 'inactive'}
        </span>
        <p className="text-sm text-gray-500 mt-1">
          Joined: {new Date(member.memberInfo?.joinDate).toLocaleDateString()}
        </p>
      </div>
    </div>
    
    {/* Member stats */}
    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-blue-600">{member.workoutCount || 0}</div>
        <div className="text-xs text-gray-500">Workouts</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-green-600">{member.attendanceRate || 0}%</div>
        <div className="text-xs text-gray-500">Attendance</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-purple-600">{member.streakDays || 0}</div>
        <div className="text-xs text-gray-500">Day Streak</div>
      </div>
    </div>

    {/* AI Recommendations */}
    {member.aiRecommendations && (
      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <div className="flex items-center mb-2">
          <FireIcon className="h-4 w-4 text-yellow-600 mr-1" />
          <span className="text-sm font-medium text-yellow-800">AI Recommendation</span>
        </div>
        <p className="text-sm text-yellow-700">{member.aiRecommendations}</p>
      </div>
    )}

    <div className="mt-4 flex space-x-2">
      <button
        onClick={() => onViewDetails(member)}
        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        View Details
      </button>
      <button
        onClick={() => onEdit(member)}
        className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700"
      >
        Edit
      </button>
    </div>
  </div>
);

const MemberModal = ({ member, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fitnessGoals: [],
    fitnessLevel: 'beginner',
    medicalConditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  useEffect(() => {
    if (member && isOpen) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        fitnessGoals: member.memberInfo?.fitnessGoals || [],
        fitnessLevel: member.memberInfo?.fitnessLevel || 'beginner',
        medicalConditions: member.profile?.medicalInfo?.conditions || [],
        emergencyContact: member.profile?.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        }
      });
    }
  }, [member, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {member ? 'Edit Member' : 'Add New Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fitness Level</label>
              <select
                value={formData.fitnessLevel}
                onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData, 
                  emergencyContact: {...formData.emergencyContact, name: e.target.value}
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function MembersManagement() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    fitnessLevel: 'all',
    joinDate: 'all'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filters]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/members');
      
      // Enhance with AI recommendations and stats
      const enhancedMembers = await Promise.all(
        response.data.map(async (member) => {
          try {
            const [statsRes, aiRes] = await Promise.all([
              axios.get(`/api/members/${member._id}/stats`),
              axios.get(`/api/members/${member._id}/ai-recommendations`)
            ]);
            
            return {
              ...member,
              ...statsRes.data,
              aiRecommendations: aiRes.data.summary
            };
          } catch (error) {
            return member;
          }
        })
      );
      
      setMembers(enhancedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone?.includes(searchTerm) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || 
                          member.memberInfo?.membershipStatus === filters.status;
      
      const matchesFitnessLevel = filters.fitnessLevel === 'all' || 
                                member.memberInfo?.fitnessLevel === filters.fitnessLevel;
      
      return matchesSearch && matchesStatus && matchesFitnessLevel;
    });

    setFilteredMembers(filtered);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (formData) => {
    try {
      if (selectedMember) {
        await axios.put(`/api/users/${selectedMember._id}`, formData);
      } else {
        await axios.post('/api/users/register', formData);
      }
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      throw error;
    }
  };

  const handleViewDetails = async (member) => {
    try {
      // Fetch detailed member data including workout history, nutrition logs, etc.
      const detailsRes = await axios.get(`/api/members/${member._id}/complete-profile`);
      
      // Navigate to member detail page or open detailed modal
      console.log('Member details:', detailsRes.data);
      // You would implement navigation here
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your gym members with AI-powered insights
                </p>
              </div>
              <button
                onClick={handleAddMember}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filters.fitnessLevel}
            onChange={(e) => setFilters({...filters, fitnessLevel: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Members</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {members.filter(m => m.memberInfo?.membershipStatus === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Performers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {members.filter(m => (m.attendanceRate || 0) > 80).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(members.reduce((acc, m) => acc + (m.attendanceRate || 0), 0) / members.length || 0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onEdit={handleEditMember}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.status !== 'all' || filters.fitnessLevel !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first member.'}
            </p>
          </div>
        )}
      </div>

      {/* Member Modal */}
      <MemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
}
