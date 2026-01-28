import React, { useState, useEffect } from 'react';
import { createReference, getStudentReferences } from '../api';
import { useAuth } from '../context/AuthContext';

const ReferencePortal = ({ studentId, studentName }) => {
    const { user } = useAuth();
    const [references, setReferences] = useState([]);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (studentId) {
            fetchReferences();
        }
    }, [studentId]);

    const fetchReferences = async () => {
        try {
            const data = await getStudentReferences(studentId);
            setReferences(data);
        } catch (err) {
            console.error("Failed to fetch references", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm("Submit this reference? It will be silent (private) and boost the student's profile.")) return;
        
        setIsSubmitting(true);
        try {
            await createReference({ student_id: studentId, content });
            setContent('');
            fetchReferences();
            alert("Reference submitted successfully!");
        } catch (err) {
            alert("Failed to submit reference");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user.role === 'student') {
        return null; // Students see nothing here
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mentor Reference Portal</h3>
            <p className="text-sm text-gray-600 mb-4">
                Silent references are private endorsements visible only to other mentors and admins. 
                They significantly boost a student's ranking and credibility.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Write a Reference for {studentName}
                </label>
                <textarea
                    rows={4}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Describe the student's strengths, work ethic, and research potential..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <div className="mt-2 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Silent Reference'}
                    </button>
                </div>
            </form>

            {references.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Existing References</h4>
                    <div className="space-y-3">
                        {references.map(ref => (
                            <div key={ref.id} className="bg-yellow-50 p-3 rounded border border-yellow-100">
                                <p className="text-gray-800 text-sm">{ref.content}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Submitted on {new Date(ref.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferencePortal;
