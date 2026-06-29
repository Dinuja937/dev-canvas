import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../api/project.api';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    tags: ''
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject(id);
        const project = response.data;
        
        // Ensure only the author can edit
        const authorId = project.studentId?._id || project.studentId;
        const currentUserId = user?._id || user?.id;
        if (authorId !== currentUserId) {
          toast.error("You are not authorized to edit this project.");
          navigate('/my-portfolio');
          return;
        }

        setForm({
          title: project.title || '',
          description: project.description || '',
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || '',
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '')
        });
        
        if (project.coverImage) {
          setCoverPreview(project.coverImage);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details.");
        navigate('/my-portfolio');
      } finally {
        setLoading(false);
      }
    };
    
    if (id && user) {
      fetchProject();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('githubUrl', form.githubUrl);
    formData.append('demoUrl', form.demoUrl);
    formData.append('tags', form.tags);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      await updateProject(id, formData);
      toast.success("Project updated successfully!");
      navigate('/my-portfolio');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update project.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-sans">
        <p className="text-slate-500 text-sm">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white text-slate-900 py-12 px-4 sm:px-8 lg:px-40 font-sans overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-10 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => navigate('/my-portfolio')}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Go Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Project</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">Update your project details and configuration.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-16">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title..."
              className="w-full text-3xl font-bold bg-transparent border-b border-slate-200 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Description</label>
            <textarea 
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="8"
              placeholder="Describe your project, architecture, and features..."
              className="w-full bg-transparent border border-slate-200 rounded-md p-4 text-slate-700 focus:outline-none focus:border-slate-900 transition-colors resize-y leading-relaxed text-sm"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Cover Image</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {coverPreview && (
                <div className="w-full sm:w-64 h-40 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-md cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-600">Click to upload new cover</span>
                  <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleCoverImage} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Tags (comma separated)</label>
              <input 
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="React, Node, UI/UX"
                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">GitHub URL</label>
              <input 
                type="text"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Live Demo URL</label>
              <input 
                type="text"
                name="demoUrl"
                value={form.demoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 bg-slate-900 text-white text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50 border-2 border-slate-900 hover:text-black rounded-md"
            >
              {isSaving ? "Publishing Updates..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-portfolio')}
              className="px-8 py-2.5 bg-white text-slate-900 text-sm font-semibold border-2 border-slate-200 hover:border-slate-400 transition-colors rounded-md"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProjectPage;
