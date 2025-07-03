import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { getGymMembers, getCheckins } from '../api/membershipAPI';

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, checkinsRes] = await Promise.all([
          getGymMembers(),
          getCheckins()
        ]);
        setMembers(membersRes.data);
        setCheckins(checkinsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Members</h2>
          {loading ? (
            <p>Loading members...</p>
          ) : (
            <ul>
              {members.map(member => (
                <li key={member._id} className="py-2 border-b">
                  {member.name} - {member.phone}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Check-ins</h2>
          {loading ? (
            <p>Loading checkins...</p>
          ) : (
            <ul>
              {checkins.slice(0, 5).map(checkin => (
                <li key={checkin._id} className="py-2 border-b">
                  {new Date(checkin.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;