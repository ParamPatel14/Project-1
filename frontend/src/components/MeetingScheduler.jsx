import React, { useState, useEffect } from 'react';
import { scheduleMeeting, getMyMeetings } from '../api';
import { useAuth } from '../context/AuthContext';

const MeetingScheduler = ({ otherUser }) => { // otherUser optional if just viewing
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        start_time: '',
        end_time: '',
        link: '',
        attendee_id: otherUser ? otherUser.id : ''
    });

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const data = await getMyMeetings();
            setMeetings(data);
        } catch (err) {
            console.error("Failed to fetch meetings", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await scheduleMeeting(formData);
            setShowForm(false);
            fetchMeetings();
            setFormData({ title: '', start_time: '', end_time: '', link: '', attendee_id: otherUser ? otherUser.id : '' });
            alert("Meeting Scheduled!");
        } catch (err) {
            alert("Failed to schedule meeting");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Calendar & Meetings</h3>
                {otherUser && (
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700"
                    >
                        + Schedule Meeting
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3">New Meeting with {otherUser?.name}</h4>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input 
                                type="text" required 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input 
                                    type="datetime-local" required 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                    value={formData.start_time}
                                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <input 
                                    type="datetime-local" required 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                    value={formData.end_time}
                                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Video Link (Zoom/Meet)</label>
                            <input 
                                type="url" 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={e => setFormData({...formData, link: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 border rounded bg-white">Cancel</button>
                            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Schedule</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming Meetings</h4>
                {meetings.length === 0 && <p className="text-gray-400 text-sm">No meetings scheduled.</p>}
                {meetings.map(meeting => (
                    <div key={meeting.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 text-center min-w-[60px]">
                            <span className="block text-indigo-700 font-bold text-lg">
                                {new Date(meeting.start_time).getDate()}
                            </span>
                            <span className="block text-indigo-600 text-xs uppercase">
                                {new Date(meeting.start_time).toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                        <div className="ml-4 flex-1">
                            <h5 className="text-lg font-medium text-gray-900">{meeting.title}</h5>
                            <p className="text-sm text-gray-500">
                                {new Date(meeting.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(meeting.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            {meeting.link && (
                                <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                                    Join Meeting →
                                </a>
                            )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {meeting.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingScheduler;
