import { useState, useEffect } from "react";
import { updateStudentProfile, uploadResume, parseResume } from "../api";
import { FiBook, FiGithub, FiGlobe, FiVideo, FiUpload, FiCheck, FiFileText, FiX, FiPlus, FiTrash2, FiLinkedin, FiTwitter, FiEdit2, FiType, FiCalendar, FiLink, FiChevronDown, FiChevronUp, FiUser, FiArrowRight, FiBriefcase, FiCpu } from "react-icons/fi";

const INTEREST_OPTIONS = [
  "Web Development", "Data Science", "Machine Learning", "Mobile App Dev", 
  "UI/UX Design", "Graphic Design", "Digital Marketing", "Content Writing",
  "Finance", "Blockchain", "Cybersecurity", "Cloud Computing", "Robotics", "IoT"
];

const USER_TYPES = [
  "College Student", "Fresher", "Working Professional", "School Student", "Woman returning to work"
];

const GENDER_OPTIONS = ["Female", "Male", "Others"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Bengali", "Gujarati"];

const getResumeUrl = (url) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  return `http://localhost:8000/${url}`;
};

const StudentProfileView = ({ data, onEdit }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      {!data.is_phd_seeker && (
        <div 
          onClick={onEdit}
          className="relative group rounded-sm mb-10 cursor-pointer w-full border border-[var(--color-academia-gold)] bg-[var(--color-academia-cream)] p-6 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-6">
               <div className="mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <FiBook className="text-3xl text-[var(--color-academia-charcoal)]" />
               </div>
               <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Pursuing a PhD?</h3>
                  <p className="text-[var(--color-academia-charcoal)] text-base font-light leading-relaxed max-w-2xl">
                    Connect with leading professors and research labs. Update your profile with research interests and publications to get discovered.
                  </p>
               </div>
            </div>
            <div className="flex-shrink-0 pl-8">
                <span className="inline-flex items-center gap-2 text-[var(--color-academia-charcoal)] font-serif font-bold text-base border-b border-[var(--color-academia-charcoal)] pb-0.5 group-hover:text-[var(--color-academia-gold)] group-hover:border-[var(--color-academia-gold)] transition-all">
                    Start Research Track <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-200 w-full space-y-8">
      <div className="flex justify-between items-center border-b border-stone-200 pb-5">
        <div>
            <h2 className="text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">{data.name}</h2>
            <p className="text-stone-600 text-lg font-light mt-2">{data.headline}</p>
        </div>
        <button onClick={onEdit} className="bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-6 py-2 rounded-sm hover:opacity-90 flex items-center gap-2 transition font-medium shadow-sm">
            <FiEdit2 /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="space-y-8">
            <div className="bg-[var(--color-academia-cream)] rounded-sm border border-stone-200 overflow-hidden transition-all duration-300">
                <button 
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="w-full p-5 flex justify-between items-center text-[var(--color-academia-charcoal)] hover:bg-stone-100 transition-colors"
                >
                    <h3 className="font-serif font-bold flex items-center gap-2 text-lg"><FiUser className="text-[var(--color-academia-gold)]" /> Personal Details</h3>
                    {isDetailsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <div className={`px-5 overflow-hidden transition-all duration-500 ease-in-out ${isDetailsOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-4 text-sm pt-4 border-t border-stone-300">
                        <li className="flex justify-between"><span className="font-bold text-stone-500 font-serif">Status:</span> <span className="text-[var(--color-academia-charcoal)]">{data.current_status}</span></li>
                        <li className="flex justify-between"><span className="font-bold text-stone-500 font-serif">Location:</span> <span className="text-[var(--color-academia-charcoal)]">{data.city}, {data.country}</span></li>
                        <li className="flex justify-between"><span className="font-bold text-stone-500 font-serif">Phone:</span> <span className="text-[var(--color-academia-charcoal)]">{data.phone_number}</span></li>
                        <li className="flex justify-between"><span className="font-bold text-stone-500 font-serif">Gender:</span> <span className="text-[var(--color-academia-charcoal)]">{data.gender}</span></li>
                        <li className="flex justify-between"><span className="font-bold text-stone-500 font-serif">Languages:</span> <span className="text-[var(--color-academia-charcoal)]">{data.languages}</span></li>
                    </ul>
                </div>
            </div>
            
            <div className="bg-[var(--color-academia-cream)] p-6 rounded-sm border border-stone-200">
                <h3 className="font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-2 text-lg"><FiGlobe className="text-[var(--color-academia-gold)]" /> Socials</h3>
                <div className="flex flex-col gap-4">
                    {data.github_url && <a href={data.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-700 hover:text-[var(--color-academia-gold)] transition-colors"><FiGithub /> GitHub</a>}
                    {data.linkedin_url && <a href={data.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-700 hover:text-[var(--color-academia-gold)] transition-colors"><FiLinkedin /> LinkedIn</a>}
                    {data.twitter_url && <a href={data.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-700 hover:text-[var(--color-academia-gold)] transition-colors"><FiTwitter /> Twitter</a>}
                    {data.website_url && <a href={data.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-700 hover:text-[var(--color-academia-gold)] transition-colors"><FiGlobe /> Website</a>}
                </div>
            </div>

             <div className="bg-[var(--color-academia-cream)] p-6 rounded-sm border border-stone-200">
                <h3 className="font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-2 text-lg"><FiCheck className="text-[var(--color-academia-gold)]" /> Skills</h3>
                <div className="mb-6">
                    <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-3">Primary</p>
                    <div className="flex flex-wrap gap-2">
                        {data.primary_skills?.split(',').map((s, i) => (
                            <span key={i} className="bg-white text-[var(--color-academia-charcoal)] border border-stone-300 px-3 py-1 rounded-sm text-xs font-medium shadow-sm">{s.trim()}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-3">Tools</p>
                    <div className="flex flex-wrap gap-2">
                        {data.tools_libraries?.split(',').map((s, i) => (
                            <span key={i} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-sm text-xs font-medium border border-transparent">{s.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Experience, Education, Projects */}
        <div className="md:col-span-2 space-y-10">
            <section>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-3 border-b border-stone-200 pb-2"><FiBriefcase className="text-[var(--color-academia-gold)]" /> Work Experience</h3>
                {data.work_experiences?.length > 0 ? (
                    <div className="space-y-8">
                        {data.work_experiences.map((exp, i) => (
                            <div key={i} className="border-l-4 border-[var(--color-academia-gold)] pl-6 py-1 ml-2">
                                <h4 className="font-serif font-bold text-xl text-[var(--color-academia-charcoal)]">{exp.title}</h4>
                                <p className="text-[var(--color-academia-gold)] font-medium text-lg mt-1">{exp.company} <span className="text-stone-400 text-base font-normal ml-2">| {exp.start_date} - {exp.end_date}</span></p>
                                <p className="text-stone-600 mt-3 text-base leading-relaxed whitespace-pre-line font-light">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-stone-400 italic font-light">No work experience added.</p>}
            </section>

            <section>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-3 border-b border-stone-200 pb-2"><FiCpu className="text-[var(--color-academia-gold)]" /> Projects</h3>
                {data.projects?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {data.projects.map((proj, i) => (
                            <div key={i} className="border border-stone-200 p-6 rounded-sm hover:border-[var(--color-academia-gold)] hover:shadow-md transition-all duration-300 bg-white group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-serif font-bold text-lg text-[var(--color-academia-charcoal)] group-hover:text-[var(--color-academia-gold)] transition-colors">{proj.title}</h4>
                                    {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-[var(--color-academia-gold)] text-sm flex items-center gap-1 transition-colors"><FiLink /> View</a>}
                                </div>
                                <p className="text-xs text-stone-500 mb-3 font-mono bg-stone-50 inline-block px-2 py-1 rounded-sm border border-stone-100">{proj.tech_stack}</p>
                                <p className="text-stone-600 text-sm leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-stone-400 italic font-light">No projects added.</p>}
            </section>

            <section>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-3 border-b border-stone-200 pb-2"><FiBook className="text-[var(--color-academia-gold)]" /> Education</h3>
                {data.educations?.length > 0 ? (
                    <div className="space-y-6">
                        {data.educations.map((edu, i) => (
                            <div key={i} className="flex justify-between items-start border-b border-stone-100 pb-6 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-serif font-bold text-lg text-[var(--color-academia-charcoal)]">{edu.institution}</h4>
                                    <p className="text-stone-600 text-base mt-1">{edu.degree}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-stone-500 text-sm font-medium">{edu.start_year} - {edu.end_year}</p>
                                    <p className="text-[var(--color-academia-gold)] text-xs font-bold mt-1 uppercase tracking-wide">Grade: {edu.grade}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-stone-400 italic font-light">No education details added.</p>}
            </section>

            {data.is_phd_seeker && (
             <section className="mt-12 pt-8 border-t border-stone-200">
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-3"><FiBook className="text-[var(--color-academia-gold)]" /> Research Profile (PhD)</h3>
                
                <div className="bg-[var(--color-academia-cream)] p-8 rounded-sm mb-8 border border-stone-200 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-academia-gold)] rounded-l-sm"></div>
                    <h4 className="font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 text-lg">Research Interests</h4>
                    <p className="text-stone-700 whitespace-pre-line leading-relaxed">{data.research_interests || "No research interests specified."}</p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 text-center hover:border-[var(--color-academia-gold)] transition-colors">
                        <span className="block text-stone-400 text-xs uppercase tracking-widest font-bold mb-2">GPA</span>
                        <span className="font-serif font-bold text-3xl text-[var(--color-academia-charcoal)]">{data.gpa || "-"}</span>
                    </div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 text-center hover:border-[var(--color-academia-gold)] transition-colors">
                        <span className="block text-stone-400 text-xs uppercase tracking-widest font-bold mb-2">GRE</span>
                        <span className="font-serif font-bold text-3xl text-[var(--color-academia-charcoal)]">{data.gre_score || "-"}</span>
                    </div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 text-center hover:border-[var(--color-academia-gold)] transition-colors">
                        <span className="block text-stone-400 text-xs uppercase tracking-widest font-bold mb-2">TOEFL</span>
                        <span className="font-serif font-bold text-3xl text-[var(--color-academia-charcoal)]">{data.toefl_score || "-"}</span>
                    </div>
                </div>

                <h4 className="font-serif font-bold text-xl mb-6 text-[var(--color-academia-charcoal)] border-b border-stone-200 pb-2">Publications</h4>
                {data.publications?.length > 0 ? (
                    <div className="space-y-6">
                        {data.publications.map((pub, i) => (
                            <div key={i} className="bg-white p-6 rounded-sm border border-stone-200 hover:shadow-md hover:border-[var(--color-academia-gold)] transition-all duration-300">
                                <h4 className="font-serif font-bold text-xl text-[var(--color-academia-charcoal)] mb-2">{pub.title}</h4>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[var(--color-academia-gold)] font-medium text-sm">{pub.journal_conference}</p>
                                    <span className="text-stone-400 text-xs font-mono">{pub.publication_date}</span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed mb-4">{pub.description}</p>
                                {pub.url && <a href={pub.url} target="_blank" rel="noreferrer" className="text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] text-sm font-medium inline-flex items-center gap-1 border-b border-[var(--color-academia-charcoal)] hover:border-[var(--color-academia-gold)] transition-colors pb-0.5">Read Paper <FiArrowRight /></a>}
                            </div>
                        ))}
                    </div>
                ) : <p className="text-stone-400 italic font-light">No publications listed.</p>}
             </section>
            )}
             
             {data.resume_url && (
                <div className="mt-12 pt-8 border-t border-stone-200">
                    <h3 className="text-xl font-serif font-bold mb-4 text-[var(--color-academia-charcoal)]">Resume</h3>
                    <a href={getResumeUrl(data.resume_url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--color-academia-charcoal)] border border-[var(--color-academia-charcoal)] px-6 py-3 rounded-sm hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all duration-300 font-medium">
                        <FiFileText /> View Uploaded CV
                    </a>
                </div>
             )}
        </div>
      </div>
      </div>
    </>
  );
};

const StudentProfileForm = ({ user, onUpdate }) => {
  // Core Profile Data
  const [formData, setFormData] = useState({
    name: "",
    university: "", degree: "", major: "", graduation_year: "", start_year: "",
    current_status: "College Student", bio: "",
    github_url: "", scholar_url: "", website_url: "", intro_video_url: "",
    linkedin_url: "", twitter_url: "", headline: "",
    resume_url: "", phone_number: "", city: "", country: "", gender: "",
    interests: "", languages: "",
    // PhD Fields
    is_phd_seeker: false, research_interests: "", gpa: "", gre_score: "", toefl_score: ""
  });

  // Dynamic Lists
  const [workExperiences, setWorkExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  
  // Skills
  const [primarySkills, setPrimarySkills] = useState("");
  const [tools, setTools] = useState("");

  // UI State
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleOpenEdit = () => {
      setIsEditing(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('open-profile-edit', handleOpenEdit);
    return () => window.removeEventListener('open-profile-edit', handleOpenEdit);
  }, []);

  useEffect(() => {
    if (user?.student_profile) {
      const p = user.student_profile;
      setFormData({
        name: user?.name || "",
        university: p.university || "", degree: p.degree || "", major: p.major || "",
        graduation_year: p.graduation_year || "", start_year: p.start_year || "",
        current_status: p.current_status || "College Student", bio: p.bio || "",
        github_url: p.github_url || "", scholar_url: p.scholar_url || "",
        website_url: p.website_url || "", intro_video_url: p.intro_video_url || "",
        linkedin_url: p.linkedin_url || "",
        twitter_url: p.twitter_url || "", headline: p.headline || "",
        resume_url: p.resume_url || "", phone_number: p.phone_number || "",
        city: p.city || "", country: p.country || "", gender: p.gender || "",
        interests: p.interests || "", languages: p.languages || "",
        is_phd_seeker: p.is_phd_seeker || false,
        research_interests: p.research_interests || "",
        gpa: p.gpa || "", gre_score: p.gre_score || "", toefl_score: p.toefl_score || ""
      });
      
      if (p.interests) setSelectedInterests(p.interests.split(",").map(i => i.trim()));
      if (p.languages) setSelectedLanguages(p.languages.split(",").map(i => i.trim()));
      
      if (p.work_experiences) setWorkExperiences(p.work_experiences);
      if (p.educations) setEducations(p.educations);
      if (p.projects) setProjects(p.projects);
      if (p.publications) setPublications(p.publications);
      
      setPrimarySkills(p.primary_skills || "");
      setTools(p.tools_libraries || "");

      // If profile exists (has an ID), default to View mode
      if (p.id) setIsEditing(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) setList(prev => prev.filter(i => i !== item));
    else setList(prev => [...prev, item]);
  };

  // Dynamic List Handlers
  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { title: "", company: "", start_date: "", end_date: "", description: "" }]);
  };
  const updateWorkExperience = (index, field, value) => {
    const newExp = [...workExperiences];
    newExp[index][field] = value;
    setWorkExperiences(newExp);
  };
  const removeWorkExperience = (index) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([...educations, { institution: "", degree: "", start_year: "", end_year: "", grade: "" }]);
  };
  const updateEducation = (index, field, value) => {
    const newEdu = [...educations];
    newEdu[index][field] = value;
    setEducations(newEdu);
  };
  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, { title: "", tech_stack: "", url: "", description: "" }]);
  };
  const updateProject = (index, field, value) => {
    const newProj = [...projects];
    newProj[index][field] = value;
    setProjects(newProj);
  };
  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addPublication = () => {
    setPublications([...publications, { title: "", journal_conference: "", publication_date: "", url: "", description: "" }]);
  };
  const updatePublication = (index, field, value) => {
    const newPub = [...publications];
    newPub[index][field] = value;
    setPublications(newPub);
  };
  const removePublication = (index) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const handleResumeAutofill = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsParsing(true);
    setMessage({ type: "info", text: "Parsing resume..." });
    
    try {
      const result = await parseResume(file);
      const data = result.extracted_data;
      
      // Update basic fields
      setFormData(prev => ({
        ...prev,
        phone_number: data.phone_number || prev.phone_number,
        headline: data.headline || prev.headline,
        email: data.email || prev.email,
        github_url: data.github_url || prev.github_url,
        linkedin_url: data.linkedin_url || prev.linkedin_url,
        behance_url: data.behance_url || prev.behance_url,
        twitter_url: data.twitter_url || prev.twitter_url,
        university: data.educations?.[0]?.institution || prev.university,
        degree: data.educations?.[0]?.degree || prev.degree
      }));
      
      // Update Lists (Merge or Replace? Let's append for now)
      if (data.work_experiences?.length) setWorkExperiences(prev => [...prev, ...data.work_experiences]);
      if (data.educations?.length) setEducations(prev => [...prev, ...data.educations]);
      if (data.projects?.length) setProjects(prev => [...prev, ...data.projects]);
      
      if (data.primary_skills) setPrimarySkills(data.primary_skills);
      if (data.tools_libraries) setTools(data.tools_libraries);

      const uploadResult = await uploadResume(file);
      if (uploadResult.url) {
        setFormData(prev => ({ ...prev, resume_url: uploadResult.url }));
      }
      
      setMessage({ type: "success", text: "Resume parsed! Please review the details below." });
    } catch (err) {
        console.error(err);
      setMessage({ type: "error", text: "Failed to process resume." });
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare Payload - sanitize integers
      const payload = {
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        start_year: formData.start_year ? parseInt(formData.start_year) : null,
        interests: selectedInterests.join(", "),
        languages: selectedLanguages.join(", "),
        primary_skills: primarySkills,
        tools_libraries: tools,
        // Map arrays to remove extra fields like ID if they exist, to avoid strict schema issues
        // Although Pydantic usually ignores extras, we do this to be clean
        work_experiences: workExperiences.map(({title, company, start_date, end_date, description, skills_used}) => ({
            title, company, start_date, end_date, description, skills_used
        })),
        educations: educations.map(({institution, degree, start_year, end_year, grade}) => ({
            institution, degree, start_year, end_year, grade
        })),
        projects: projects.map(({title, tech_stack, url, description}) => ({
            title, tech_stack, url, description
        })),
        publications: publications.map(({title, journal_conference, publication_date, url, description}) => ({
            title, journal_conference, publication_date, url, description
        }))
      };
      
      await updateStudentProfile(payload);
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false); // Switch to View Mode
      if (onUpdate) onUpdate();
    } catch (err) {
        console.error(err);
      setMessage({ type: "error", text: "Failed to update profile. Please check all fields." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    // Combine state into a single object for the View component
    const viewData = {
        ...formData,
        work_experiences: workExperiences,
        educations: educations,
        projects: projects,
        primary_skills: primarySkills,
        tools_libraries: tools,
        interests: selectedInterests.join(", "),
        languages: selectedLanguages.join(", ")
    };
    return <StudentProfileView data={viewData} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--color-academia-cream)] p-8 rounded-sm border border-stone-200 w-full">
      <div className="flex justify-between items-center border-b border-[var(--color-academia-gold)] pb-4">
        <h2 className="text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">Complete Your Profile</h2>
        {formData.resume_url && <span className="text-green-700 font-serif flex items-center gap-2"><FiCheck /> CV Uploaded</span>}
      </div>

      {/* Resume Upload Section - Front & Center */}
      <div className="bg-white p-8 rounded-sm border border-[var(--color-academia-gold)] text-center shadow-sm">
        <FiUpload className="mx-auto text-4xl text-[var(--color-academia-charcoal)] mb-3" />
        <h3 className="font-serif font-bold text-xl text-[var(--color-academia-charcoal)] mb-1">Auto-fill with Resume</h3>
        <p className="text-sm text-stone-600 mb-6 font-light">Upload your CV to automatically extract details</p>
        <div className="flex justify-center items-center gap-4">
            <label className="cursor-pointer bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-8 py-3 rounded-sm hover:opacity-90 transition font-serif font-medium">
            {isParsing ? "Parsing..." : "Upload Resume / CV"}
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeAutofill} disabled={isParsing} />
            </label>
            {formData.resume_url && (
                <a href={getResumeUrl(formData.resume_url)} target="_blank" rel="noopener noreferrer" className="text-[var(--color-academia-charcoal)] border-b border-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] hover:border-[var(--color-academia-gold)] transition-colors text-sm font-medium pb-0.5">View Uploaded CV</a>
            )}
        </div>
        {message.text && <p className={`mt-4 text-sm font-medium ${message.type === 'error' ? 'text-red-700' : 'text-green-700'}`}>{message.text}</p>}
      </div>

      {/* 1. Core Profile & Identity */}
      <section>
        <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-2 border-b border-stone-200 pb-2"><FiFileText className="text-[var(--color-academia-gold)]" /> Core Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">I am a</label>
                <select name="current_status" value={formData.current_status} onChange={handleChange} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors">
                    {USER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Headline</label>
                <input type="text" name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g. Full Stack Developer | React Expert" className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Phone Number</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Gender</label>
                <div className="flex gap-3 mt-1">
                    {GENDER_OPTIONS.map(g => (
                        <button key={g} type="button" onClick={() => setFormData(p => ({...p, gender: g}))}
                            className={`px-5 py-2 rounded-sm text-sm font-medium transition-colors border ${formData.gender === g ? 'bg-[var(--color-academia-charcoal)] border-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)]' : 'bg-white border-stone-300 text-stone-600 hover:border-[var(--color-academia-gold)]'}`}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* PhD Matcher Section */}
      <section className="bg-white p-4 rounded-sm border border-[var(--color-academia-gold)] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <input 
                type="checkbox" 
                name="is_phd_seeker" 
                id="is_phd_seeker"
                checked={formData.is_phd_seeker} 
                onChange={handleChange} 
                className="w-5 h-5 text-[var(--color-academia-charcoal)] rounded focus:ring-[var(--color-academia-gold)] border-stone-300 cursor-pointer"
            />
            <label htmlFor="is_phd_seeker" className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] cursor-pointer">
                I am looking for a PhD Supervisor
            </label>
        </div>
        
        {formData.is_phd_seeker && (
            <div className="space-y-4 animate-fade-in pl-1">
                <div>
                    <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Research Interests & Goals (Detailed)</label>
                    <textarea 
                        name="research_interests" 
                        value={formData.research_interests} 
                        onChange={handleChange} 
                        rows={3}
                        placeholder="Describe your research interests, potential topics, and career goals..."
                        className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400 resize-none"
                    />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Overall GPA</label>
                        <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="e.g. 3.8/4.0" className="w-full p-2 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">GRE Score</label>
                        <input type="text" name="gre_score" value={formData.gre_score} onChange={handleChange} placeholder="e.g. 320" className="w-full p-2 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">TOEFL/IELTS</label>
                        <input type="text" name="toefl_score" value={formData.toefl_score} onChange={handleChange} placeholder="e.g. 110" className="w-full p-2 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                </div>

                {/* Publications List */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)]">Publications / Papers</label>
                        <button type="button" onClick={addPublication} className="text-sm text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center gap-1 font-medium transition-colors">
                            <FiPlus /> Add Paper
                        </button>
                    </div>
                    <div className="space-y-4">
                        {publications.map((pub, index) => (
                            <div key={index} className="bg-[var(--color-academia-cream)] p-5 rounded-sm border border-stone-200 relative group hover:border-[var(--color-academia-gold)] transition-colors">
                                <button type="button" onClick={() => removePublication(index)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600 transition p-1">
                                    <FiTrash2 />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="relative">
                                        <FiType className="absolute top-3.5 left-3 text-stone-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Paper Title" 
                                            value={pub.title} 
                                            onChange={(e) => updatePublication(index, 'title', e.target.value)} 
                                            className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FiBook className="absolute top-3.5 left-3 text-stone-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Journal / Conference Name" 
                                            value={pub.journal_conference} 
                                            onChange={(e) => updatePublication(index, 'journal_conference', e.target.value)} 
                                            className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                     <div className="relative">
                                        <FiCalendar className="absolute top-3.5 left-3 text-stone-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Publication Date (YYYY-MM)" 
                                            value={pub.publication_date} 
                                            onChange={(e) => updatePublication(index, 'publication_date', e.target.value)} 
                                            className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400"
                                        />
                                    </div>
                                     <div className="relative">
                                        <FiLink className="absolute top-3.5 left-3 text-stone-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Link to Paper (URL)" 
                                            value={pub.url} 
                                            onChange={(e) => updatePublication(index, 'url', e.target.value)} 
                                            className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400"
                                        />
                                    </div>
                                </div>
                                
                                <textarea 
                                    placeholder="Abstract / Short Description..." 
                                    value={pub.description} 
                                    onChange={(e) => updatePublication(index, 'description', e.target.value)} 
                                    className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors h-24 resize-none placeholder-stone-400"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </section>

      {/* 2. Socials */}
      <section>
        <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-2 border-b border-stone-200 pb-2"><FiGlobe className="text-[var(--color-academia-gold)]" /> Socials & Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <FiGithub className="absolute top-3.5 left-3 text-stone-400" />
                <input type="text" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="GitHub URL" className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400" />
            </div>
            <div className="relative">
                <FiLinkedin className="absolute top-3.5 left-3 text-stone-400" />
                <input type="text" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="LinkedIn URL" className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400" />
            </div>
            <div className="relative">
                <FiTwitter className="absolute top-3.5 left-3 text-stone-400" />
                <input type="text" name="twitter_url" value={formData.twitter_url} onChange={handleChange} placeholder="Twitter URL" className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400" />
            </div>
            <div className="relative">
                <FiGlobe className="absolute top-3.5 left-3 text-stone-400" />
                <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="Personal Website" className="w-full pl-10 p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors placeholder-stone-400" />
            </div>
        </div>
      </section>

      {/* 3. Work Experience */}
      <section>
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
            <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2"><FiBook className="text-[var(--color-academia-gold)]" /> Work Experience</h3>
            <button type="button" onClick={addWorkExperience} className="text-sm text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center gap-1 font-medium transition-colors"><FiPlus /> Add</button>
        </div>
        <div className="space-y-6">
            {workExperiences.map((exp, index) => (
                <div key={index} className="p-6 border border-stone-200 rounded-sm bg-[var(--color-academia-cream)] relative group hover:border-[var(--color-academia-gold)] transition-colors">
                    <button type="button" onClick={() => removeWorkExperience(index)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600 transition p-1"><FiTrash2 /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                        <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateWorkExperience(index, 'title', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateWorkExperience(index, 'company', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Start Date (e.g. 2020)" value={exp.start_date} onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="End Date (e.g. Present)" value={exp.end_date} onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                    <textarea placeholder="Description (Bullet points)" value={exp.description} onChange={(e) => updateWorkExperience(index, 'description', e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors h-24 resize-none" />
                </div>
            ))}
        </div>
      </section>

      {/* 4. Education */}
      <section>
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
            <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2"><FiBook className="text-[var(--color-academia-gold)]" /> Education</h3>
            <button type="button" onClick={addEducation} className="text-sm text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center gap-1 font-medium transition-colors"><FiPlus /> Add</button>
        </div>
        <div className="space-y-6">
            {educations.map((edu, index) => (
                <div key={index} className="p-6 border border-stone-200 rounded-sm bg-[var(--color-academia-cream)] relative group hover:border-[var(--color-academia-gold)] transition-colors">
                    <button type="button" onClick={() => removeEducation(index)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600 transition p-1"><FiTrash2 /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Start Year" value={edu.start_year} onChange={(e) => updateEducation(index, 'start_year', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="End Year" value={edu.end_year} onChange={(e) => updateEducation(index, 'end_year', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Grade/CGPA" value={edu.grade} onChange={(e) => updateEducation(index, 'grade', e.target.value)} className="p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 5. Projects */}
      <section>
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
            <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2"><FiCpu className="text-[var(--color-academia-gold)]" /> Projects</h3>
            <button type="button" onClick={addProject} className="text-sm text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center gap-1 font-medium transition-colors"><FiPlus /> Add</button>
        </div>
        <div className="space-y-6">
            {projects.map((proj, index) => (
                <div key={index} className="p-6 border border-stone-200 rounded-sm bg-[var(--color-academia-cream)] relative group hover:border-[var(--color-academia-gold)] transition-colors">
                    <button type="button" onClick={() => removeProject(index)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600 transition p-1"><FiTrash2 /></button>
                    <div className="grid grid-cols-1 gap-5 mb-4">
                        <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updateProject(index, 'title', e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Project URL" value={proj.url} onChange={(e) => updateProject(index, 'url', e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                        <input type="text" placeholder="Tech Stack (comma separated)" value={proj.tech_stack} onChange={(e) => updateProject(index, 'tech_stack', e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
                    </div>
                    <textarea placeholder="Description" value={proj.description} onChange={(e) => updateProject(index, 'description', e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors h-24 resize-none" />
                </div>
            ))}
        </div>
      </section>

      {/* 6. Skills */}
      <section>
        <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center gap-2 border-b border-stone-200 pb-2"><FiCheck className="text-[var(--color-academia-gold)]" /> Skills</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Primary Skills (Top 5)</label>
                <input type="text" value={primarySkills} onChange={(e) => setPrimarySkills(e.target.value)} placeholder="e.g. Python, React, Node.js (Comma separated)" className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">Tools & Libraries</label>
                <input type="text" value={tools} onChange={(e) => setTools(e.target.value)} placeholder="e.g. Pandas, Docker, Git (Comma separated)" className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors" />
            </div>
        </div>
      </section>

      {/* 7. Additional Info */}
      <section>
        <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 border-b border-stone-200 pb-2">Interests & Languages</h3>
        <div className="mb-6">
            <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-3">Interests</label>
            <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                    <button key={interest} type="button" onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                        className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${selectedInterests.includes(interest) ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] border-[var(--color-academia-charcoal)]' : 'bg-white text-stone-600 border-stone-300 hover:border-[var(--color-academia-gold)]'}`}>
                        {interest}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label className="block text-sm font-serif font-bold text-[var(--color-academia-charcoal)] mb-3">Languages</label>
            <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map(lang => (
                    <button key={lang} type="button" onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                        className={`px-4 py-1.5 rounded-sm text-sm border transition-colors ${selectedLanguages.includes(lang) ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] border-[var(--color-academia-charcoal)]' : 'bg-white text-stone-600 border-stone-300 hover:border-[var(--color-academia-gold)]'}`}>
                        {lang}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <div className="pt-8 border-t border-[var(--color-academia-gold)]">
        <button
          type="submit"
          disabled={isLoading || !formData.resume_url}
          className={`w-full py-4 rounded-sm font-serif font-bold text-lg text-[var(--color-academia-cream)] shadow-sm hover:shadow-md transition-all duration-300 ${
            isLoading || !formData.resume_url ? 'bg-stone-400 cursor-not-allowed' : 'bg-[var(--color-academia-charcoal)] hover:bg-black'
          }`}
        >
          {isLoading ? 'Saving Profile...' : 'Save & Complete Profile'}
        </button>
        {!formData.resume_url && <p className="text-center text-red-700 mt-3 text-sm font-medium">Please upload your CV/Resume to continue</p>}
      </div>
    </form>
  );
};

export default StudentProfileForm;
