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
import { FiPlus, FiMessageSquare, FiVideo, FiFileText, FiLayers, FiCheckCircle } from 'react-icons/fi';
import ChatBox from './ChatBox';
import MeetingScheduler from './MeetingScheduler';
import ReferencePortal from './ReferencePortal';
import CubeLoader from './ui/CubeLoader';

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

    if (loading) return (
        <div className="p-12 flex justify-center">
            <CubeLoader />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-[var(--color-academia-charcoal)]">Research Lab</h1>
                    <p className="text-stone-500 mt-1 font-serif italic">Collaborative workspace for mentors and students</p>
                </div>
                {user.role === 'mentor' && (
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-5 py-2 rounded-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2 font-medium"
                    >
                        <FiPlus /> Start New Project
                    </button>
                )}
            </div>

            {/* Project Selector */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                {projects.length === 0 ? (
                    <div className="text-stone-500 italic px-4">No active projects. {user.role === 'mentor' ? 'Start one above.' : 'Wait for a mentor to initiate.'}</div>
                ) : projects.map(project => (
                    <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-sm border transition-all duration-300 ${
                            selectedProject?.id === project.id 
                            ? 'bg-[var(--color-academia-charcoal)] border-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] shadow-md transform -translate-y-0.5' 
                            : 'bg-white border-stone-200 text-stone-600 hover:border-[var(--color-academia-gold)] hover:text-[var(--color-academia-charcoal)]'
                        }`}
                    >
                        <span className="font-serif font-bold">{project.title}</span> 
                        <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-sm ${selectedProject?.id === project.id ? 'bg-[var(--color-academia-gold)] text-black' : 'bg-stone-100 text-stone-500'}`}>
                            {project.status}
                        </span>
                    </button>
                ))}
            </div>

            {selectedProject ? (
                <div className="bg-white shadow-lg rounded-sm overflow-hidden border border-stone-100">
                    <div className="border-b border-stone-200 bg-[var(--color-academia-cream)]">
                        <nav className="flex -mb-px overflow-x-auto">
                            {[
                                { id: 'pipeline', label: 'Pipeline', icon: FiLayers },
                                { id: 'assignments', label: 'Assignments', icon: FiFileText },
                                { id: 'chat', label: 'Chat', icon: FiMessageSquare },
                                { id: 'meetings', label: 'Meetings', icon: FiVideo },
                                { id: 'references', label: 'References', icon: FiCheckCircle, condition: user.role === 'mentor' }
                            ].map(tab => (
                                (!tab.condition && tab.condition !== undefined) ? null : (
                                    <button
                                        key={tab.id}
                                        onClick={() => setView(tab.id)}
                                        className={`flex-1 min-w-[120px] py-4 px-4 text-center border-b-2 font-serif font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                                            view === tab.id
                                            ? 'border-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] bg-white'
                                            : 'border-transparent text-stone-500 hover:text-[var(--color-academia-charcoal)] hover:bg-stone-50'
                                        }`}
                                    >
                                        <tab.icon className={view === tab.id ? 'text-[var(--color-academia-gold)]' : ''} />
                                        {tab.label}
                                    </button>
                                )
                            ))}
                        </nav>
                    </div>

                    <div className="p-6 min-h-[400px]">
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
                <div className="text-center py-20 bg-white rounded-sm shadow-sm border border-stone-200">
                    <div className="w-16 h-16 bg-[var(--color-academia-cream)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-academia-gold)]">
                        <FiLayers className="text-2xl text-[var(--color-academia-gold)]" />
                    </div>
                    <p className="text-[var(--color-academia-charcoal)] text-lg font-serif">Select a project to view details or start a new one.</p>
                </div>
            )}

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-sm max-w-md w-full p-8 shadow-2xl border-t-4 border-[var(--color-academia-gold)] animate-scale-up">
                        <h3 className="text-xl font-bold font-serif text-[var(--color-academia-charcoal)] mb-6">Start New Research Project</h3>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[var(--color-academia-charcoal)] mb-2 font-serif">Project Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)]"
                                    value={newProjectData.title}
                                    onChange={e => setNewProjectData({...newProjectData, title: e.target.value})}
                                    placeholder="e.g., Analysis of..."
                                />
                            </div>
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-[var(--color-academia-charcoal)] mb-2 font-serif">Student (Accepted)</label>
                                <select 
                                    required
                                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)] bg-white"
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
                                    className="px-5 py-2 border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] rounded-sm hover:opacity-90 font-medium shadow-md transition-all"
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
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
            {stages.map((stage, idx) => (
                <div key={stage} className={`flex-shrink-0 w-64 p-4 rounded-sm transition-all duration-300 ${
                    project.status === stage 
                    ? 'bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] shadow-md transform -translate-y-1' 
                    : 'bg-stone-50 border border-stone-100 opacity-80 hover:opacity-100'
                }`}>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-serif font-bold ${project.status === stage ? 'text-[var(--color-academia-charcoal)]' : 'text-stone-500'}`}>
                            {idx + 1}. {stage}
                        </h4>
                        {project.status === stage && <div className="w-2 h-2 rounded-full bg-[var(--color-academia-gold)] animate-pulse"></div>}
                    </div>
                    
                    {project.status === stage ? (
                        <div className="bg-white p-4 rounded-sm shadow-sm border-l-2 border-[var(--color-academia-gold)]">
                            <p className="font-medium text-[var(--color-academia-charcoal)]">{project.title}</p>
                            <p className="text-xs text-[var(--color-academia-gold-hover)] mt-2 font-bold uppercase tracking-wider">Current Stage</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onStatusUpdate(project.id, stage)}
                            className="w-full py-3 text-sm text-stone-400 hover:text-[var(--color-academia-charcoal)] hover:bg-white hover:border-[var(--color-academia-charcoal)] rounded-sm border border-dashed border-stone-300 transition-all"
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
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)]">Assignments</h3>
                {user.role === 'mentor' && (
                    <button 
                        onClick={() => setShowAssignModal(true)}
                        className="text-sm bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-charcoal)] px-4 py-2 rounded-sm hover:bg-[var(--color-academia-charcoal)] hover:text-white transition-colors"
                    >
                        + Create Assignment
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {assignments.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-stone-300 rounded-sm">
                        <p className="text-stone-500 italic">No assignments yet.</p>
                    </div>
                )}
                {assignments.map(assign => (
                    <div key={assign.id} className="border border-stone-200 p-5 rounded-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start gap-4 bg-white">
                        <div>
                            <h4 className="font-bold text-lg font-serif text-[var(--color-academia-charcoal)]">{assign.title}</h4>
                            <p className="text-stone-600 mt-2 leading-relaxed">{assign.description}</p>
                            <div className="flex gap-3 mt-3 text-xs font-semibold uppercase tracking-wide">
                                <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-sm border border-stone-200">Type: {assign.type}</span>
                                {assign.due_date && <span className="bg-red-50 text-red-800 px-2 py-1 rounded-sm border border-red-100">Due: {new Date(assign.due_date).toLocaleDateString()}</span>}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                           {/* Add Submission Status or Grade here */}
                           {user.role === 'student' && <SubmissionButton assignment={assign} />}
                           {user.role === 'mentor' && <ViewSubmissionsButton assignment={assign} />}
                        </div>
                    </div>
                ))}
            </div>

             {/* Create Assignment Modal */}
             {showAssignModal && (
                <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-sm max-w-md w-full p-8 shadow-2xl border-t-4 border-[var(--color-academia-gold)] animate-scale-up">
                        <h3 className="text-xl font-bold font-serif mb-6 text-[var(--color-academia-charcoal)]">Create Assignment</h3>
                        <form onSubmit={handleCreateAssignment}>
                            <div className="space-y-4">
                                <input className="w-full border border-stone-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)]" placeholder="Title" required value={newAssign.title} onChange={e => setNewAssign({...newAssign, title: e.target.value})} />
                                <textarea className="w-full border border-stone-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)]" placeholder="Description" required value={newAssign.description} onChange={e => setNewAssign({...newAssign, description: e.target.value})} rows={3} />
                                <select className="w-full border border-stone-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)] bg-white" value={newAssign.type} onChange={e => setNewAssign({...newAssign, type: e.target.value})}>
                                    <option value="pdf">PDF Upload</option>
                                    <option value="code">Code Submission</option>
                                    <option value="analysis">Analysis Text</option>
                                </select>
                                <input type="date" className="w-full border border-stone-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)]" value={newAssign.due_date} onChange={e => setNewAssign({...newAssign, due_date: e.target.value})} />
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="px-5 py-2 border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] rounded-sm hover:opacity-90 font-medium shadow-md">Create</button>
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
            <button onClick={() => setShowModal(true)} className="text-sm bg-[var(--color-academia-gold)] text-white px-4 py-2 rounded-sm hover:bg-[var(--color-academia-gold-hover)] font-medium shadow-sm transition-colors">
                Submit Work
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-sm p-8 max-w-md w-full shadow-2xl border-t-4 border-[var(--color-academia-gold)] animate-scale-up">
                        <h3 className="text-xl font-bold font-serif mb-6 text-[var(--color-academia-charcoal)]">Submit: {assignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
