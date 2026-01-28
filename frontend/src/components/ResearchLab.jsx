import React, { useState, useEffect } from 'react';
import { 
    getMyResearchProjects, 
    createResearchProject, 
    updateResearchProjectStatus, 
    getMentorApplications,
    getOpportunityAssignments,
    createAssignment,
    submitAssignment,
    getSubmissions,
    gradeSubmission
} from '../api';
import { useAuth } from '../context/AuthContext';

import ChatBox from './ChatBox';
import MeetingScheduler from './MeetingScheduler';
import ReferencePortal from './ReferencePortal';

const ResearchLab = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [view, setView] = useState('pipeline'); // pipeline, assignments, chat, meetings, references
    const [loading, setLoading] = useState(true);
    
    // Mentor specific state
    const [acceptedStudents, setAcceptedStudents] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ title: '', student_id: '', opportunity_id: '' });

    useEffect(() => {
        fetchProjects();
        if (user.role === 'mentor') {
            fetchAcceptedStudents();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            const data = await getMyResearchProjects();
            setProjects(data);
            if (data.length > 0 && !selectedProject) {
                setSelectedProject(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcceptedStudents = async () => {
        try {
            const apps = await getMentorApplications();
            // Filter for accepted only
            const accepted = apps.filter(app => app.status === 'accepted');
            setAcceptedStudents(accepted);
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await createResearchProject(newProjectData);
            setShowCreateModal(false);
            fetchProjects();
            setNewProjectData({ title: '', student_id: '', opportunity_id: '' });
        } catch (err) {
            alert("Failed to create project");
        }
    };

    const handleStatusUpdate = async (projectId, newStatus) => {
        try {
            const updated = await updateResearchProjectStatus(projectId, { status: newStatus });
            setProjects(projects.map(p => p.id === projectId ? updated : p));
            if (selectedProject?.id === projectId) {
                setSelectedProject(updated);
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    if (loading) return <div className="p-8">Loading Research Lab...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Research Lab</h1>
                {user.role === 'mentor' && (
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Start New Project
                    </button>
                )}
            </div>

            {/* Project Selector */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {projects.map(project => (
                    <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full border ${
                            selectedProject?.id === project.id 
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {project.title} <span className="text-xs ml-2 opacity-75">({project.status})</span>
                    </button>
                ))}
            </div>

            {selectedProject ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setView('pipeline')}
                                className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                    view === 'pipeline'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Pipeline
                            </button>
                            <button
                                onClick={() => setView('assignments')}
                                className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                    view === 'assignments'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Assignments
                            </button>
                            <button
                                onClick={() => setView('chat')}
                                className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                    view === 'chat'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => setView('meetings')}
                                className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                    view === 'meetings'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Meetings
                            </button>
                            {user.role === 'mentor' && (
                                <button
                                    onClick={() => setView('references')}
                                    className={`w-1/5 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        view === 'references'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Reference
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="p-6">
                        {view === 'pipeline' && (
                            <PipelineBoard project={selectedProject} onStatusUpdate={handleStatusUpdate} />
                        )}
                        {view === 'assignments' && (
                            <AssignmentsManager project={selectedProject} user={user} />
                        )}
                        {view === 'chat' && (
                            <ChatBox otherUser={user.role === 'mentor' ? selectedProject.student : selectedProject.mentor} />
                        )}
                        {view === 'meetings' && (
                            <MeetingScheduler otherUser={user.role === 'mentor' ? selectedProject.student : selectedProject.mentor} />
                        )}
                        {view === 'references' && user.role === 'mentor' && (
                            <ReferencePortal studentId={selectedProject.student_id} studentName={selectedProject.student?.name} />
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">Select a project to view details or start a new one.</p>
                </div>
            )}

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Start New Research Project</h3>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                    value={newProjectData.title}
                                    onChange={e => setNewProjectData({...newProjectData, title: e.target.value})}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Student (Accepted)</label>
                                <select 
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                    value={newProjectData.student_id}
                                    onChange={e => {
                                        const studentId = e.target.value;
                                        // Find opportunity ID associated with this student application
                                        const app = acceptedStudents.find(a => a.student_id === parseInt(studentId));
                                        setNewProjectData({
                                            ...newProjectData, 
                                            student_id: studentId,
                                            opportunity_id: app ? app.opportunity_id : ''
                                        });
                                    }}
                                >
                                    <option value="">Select Student</option>
                                    {acceptedStudents.map(app => (
                                        <option key={app.id} value={app.student_id}>
                                            {app.student.name} - {app.opportunity.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components
const PipelineBoard = ({ project, onStatusUpdate }) => {
    const stages = ["Ideation", "Literature Review", "Experimentation", "Drafting", "Submission", "Published"];
    
    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => (
                <div key={stage} className={`flex-shrink-0 w-64 p-4 rounded-lg ${project.status === stage ? 'bg-indigo-50 border-2 border-indigo-500' : 'bg-gray-50'}`}>
                    <h4 className="font-semibold text-gray-700 mb-2">{stage}</h4>
                    {project.status === stage ? (
                        <div className="bg-white p-3 rounded shadow border-l-4 border-indigo-500">
                            <p className="font-medium">{project.title}</p>
                            <p className="text-xs text-gray-500 mt-1">Current Stage</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onStatusUpdate(project.id, stage)}
                            className="w-full py-2 text-sm text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded border border-dashed border-gray-300"
                        >
                            Move Here
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

const AssignmentsManager = ({ project, user }) => {
    const [assignments, setAssignments] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [newAssign, setNewAssign] = useState({ title: '', description: '', type: 'pdf', due_date: '' });

    useEffect(() => {
        if (project.opportunity_id) {
            loadAssignments();
        }
    }, [project]);

    const loadAssignments = async () => {
        try {
            const data = await getOpportunityAssignments(project.opportunity_id);
            setAssignments(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await createAssignment({ ...newAssign, opportunity_id: project.opportunity_id });
            setShowAssignModal(false);
            loadAssignments();
        } catch (e) {
            alert("Error creating assignment");
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Assignments</h3>
                {user.role === 'mentor' && (
                    <button 
                        onClick={() => setShowAssignModal(true)}
                        className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                    >
                        + Create Assignment
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {assignments.length === 0 && <p className="text-gray-500">No assignments yet.</p>}
                {assignments.map(assign => (
                    <div key={assign.id} className="border p-4 rounded-lg flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{assign.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{assign.description}</p>
                            <div className="flex gap-2 mt-2 text-xs">
                                <span className="bg-gray-100 px-2 py-1 rounded">Type: {assign.type}</span>
                                {assign.due_date && <span className="bg-red-50 text-red-700 px-2 py-1 rounded">Due: {new Date(assign.due_date).toLocaleDateString()}</span>}
                            </div>
                        </div>
                        <div>
                           {/* Add Submission Status or Grade here */}
                           {user.role === 'student' && <SubmissionButton assignment={assign} />}
                           {user.role === 'mentor' && <ViewSubmissionsButton assignment={assign} />}
                        </div>
                    </div>
                ))}
            </div>

             {/* Create Assignment Modal */}
             {showAssignModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium mb-4">Create Assignment</h3>
                        <form onSubmit={handleCreateAssignment}>
                            <div className="space-y-4">
                                <input className="w-full border p-2 rounded" placeholder="Title" required value={newAssign.title} onChange={e => setNewAssign({...newAssign, title: e.target.value})} />
                                <textarea className="w-full border p-2 rounded" placeholder="Description" required value={newAssign.description} onChange={e => setNewAssign({...newAssign, description: e.target.value})} />
                                <select className="w-full border p-2 rounded" value={newAssign.type} onChange={e => setNewAssign({...newAssign, type: e.target.value})}>
                                    <option value="pdf">PDF Upload</option>
                                    <option value="code">Code Submission</option>
                                    <option value="analysis">Analysis Text</option>
                                </select>
                                <input type="date" className="w-full border p-2 rounded" value={newAssign.due_date} onChange={e => setNewAssign({...newAssign, due_date: e.target.value})} />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="px-3 py-1 border rounded">Cancel</button>
                                <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SubmissionButton = ({ assignment }) => {
    const [status, setStatus] = useState('pending'); // pending, submitted
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitAssignment(assignment.id, { content, file_url: link });
            setShowModal(false);
            alert("Submitted!");
        } catch (e) {
            alert("Error submitting");
        }
    };

    return (
        <>
            <button onClick={() => setShowModal(true)} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded">
                Submit Work
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                     <div className="bg-white rounded p-6 max-w-md w-full">
                        <h3 className="font-bold mb-4">Submit: {assignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <textarea className="w-full border p-2 rounded" placeholder="Notes/Analysis" value={content} onChange={e => setContent(e.target.value)} />
                            <input className="w-full border p-2 rounded" placeholder="File/Link URL" value={link} onChange={e => setLink(e.target.value)} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="border px-3 py-1 rounded">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Submit</button>
                            </div>
                        </form>
                     </div>
                </div>
            )}
        </>
    )
}

const ViewSubmissionsButton = ({ assignment }) => {
    const [submissions, setSubmissions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [grading, setGrading] = useState(null); // submission being graded

    const loadSubmissions = async () => {
        setShowModal(true);
        const data = await getSubmissions(assignment.id);
        setSubmissions(data);
    };

    const handleGrade = async (submissionId, gradeData) => {
        try {
            await gradeSubmission(submissionId, gradeData);
            setGrading(null);
            loadSubmissions(); // refresh
        } catch (e) {
            alert("Error grading");
        }
    };

    return (
        <>
            <button onClick={loadSubmissions} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
                View Submissions
            </button>
            {showModal && (
                 <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold">Submissions for {assignment.title}</h3>
                            <button onClick={() => setShowModal(false)}>Close</button>
                        </div>
                        {submissions.length === 0 && <p>No submissions.</p>}
                        {submissions.map(sub => (
                            <div key={sub.id} className="border-b py-3">
                                <p className="font-medium">Student ID: {sub.student_id}</p>
                                <p className="text-sm text-gray-600">Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>
                                <div className="bg-gray-50 p-2 rounded mt-2 text-sm">
                                    <p><strong>Content:</strong> {sub.content}</p>
                                    {sub.file_url && <a href={sub.file_url} target="_blank" className="text-blue-600 underline">View File</a>}
                                </div>
                                
                                {sub.grade ? (
                                    <div className="mt-2 text-green-700 text-sm">
                                        Grade: {sub.grade} | Feedback: {sub.feedback}
                                    </div>
                                ) : (
                                    <button onClick={() => setGrading(sub)} className="mt-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">Grade</button>
                                )}

                                {grading?.id === sub.id && (
                                    <GradingForm submission={sub} onSave={(data) => handleGrade(sub.id, data)} onCancel={() => setGrading(null)} />
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </>
    );
};

const GradingForm = ({ submission, onSave, onCancel }) => {
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    return (
        <div className="mt-3 border p-3 rounded bg-indigo-50">
            <h4 className="font-bold text-sm mb-2">Grade Submission</h4>
            <input type="number" placeholder="Score (0-100)" className="w-full border p-1 rounded mb-2" value={grade} onChange={e => setGrade(e.target.value)} />
            <textarea placeholder="Feedback" className="w-full border p-1 rounded mb-2" value={feedback} onChange={e => setFeedback(e.target.value)} />
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="text-xs border px-2 py-1 rounded bg-white">Cancel</button>
                <button onClick={() => onSave({ grade: parseFloat(grade), feedback })} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Save</button>
            </div>
        </div>
    );
};

export default ResearchLab;
