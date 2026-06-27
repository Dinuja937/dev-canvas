// Form to edit an existing project (owner only)
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProject, updateProject } from '../api/project.api';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    coverImage: '',
    extraImages: '',
  });

  useEffect(() => {
    getProject(id).then((res) => {
      const p = res.data;
      setForm({
        title: p.title || '',
        description: p.description || '',
        coverImage: p.coverImage || '',
        extraImages: (p.extraImages || []).join(', '),
      });
    });
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      extraImages: form.extraImages.split(',').map((s) => s.trim()).filter(Boolean),
    };
    await updateProject(id, payload);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="coverImage"
          placeholder="Cover Image URL"
          value={form.coverImage}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="extraImages"
          placeholder="Extra Image URLs (comma separated)"
          value={form.extraImages}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}