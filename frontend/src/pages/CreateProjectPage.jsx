import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/project.api';

const animatedBgStyles = `
  @import url('https://fonts.googleapis.com/css?family=Exo:400,700');

  .area {
    background: #4e54c8;
    background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;
  }

  .circles li:nth-child(1)  { left: 25%; width: 80px;  height: 80px;  animation-delay: 0s; }
  .circles li:nth-child(2)  { left: 10%; width: 20px;  height: 20px;  animation-delay: 2s;  animation-duration: 12s; }
  .circles li:nth-child(3)  { left: 70%; width: 20px;  height: 20px;  animation-delay: 4s; }
  .circles li:nth-child(4)  { left: 40%; width: 60px;  height: 60px;  animation-delay: 0s;  animation-duration: 18s; }
  .circles li:nth-child(5)  { left: 65%; width: 20px;  height: 20px;  animation-delay: 0s; }
  .circles li:nth-child(6)  { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
  .circles li:nth-child(7)  { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
  .circles li:nth-child(8)  { left: 50%; width: 25px;  height: 25px;  animation-delay: 15s; animation-duration: 45s; }
  .circles li:nth-child(9)  { left: 20%; width: 15px;  height: 15px;  animation-delay: 2s;  animation-duration: 35s; }
  .circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s;  animation-duration: 11s; }

  @keyframes animate {
    0%   { transform: translateY(0) rotate(0deg);        opacity: 1; border-radius: 0; }
    100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
  }
`;

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [extraPreviews, setExtraPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!coverImage) e.coverImage = 'Cover image is required';
    return e;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files);
    setExtraImages(files);
    setExtraPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);

    // Use FormData to send files to backend
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('coverImage', coverImage);
    extraImages.forEach((file) => formData.append('extraImages', file));

    await createProject(formData);
    navigate('/');
  };

  return (
    <>
      <style>{animatedBgStyles}</style>

      <div className="area">
        <ul className="circles">
          {[...Array(10)].map((_, i) => <li key={i} />)}
        </ul>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Upload Project</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Title */}
            <div>
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {errors.title && <p className="text-red-200 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
              {errors.description && <p className="text-red-200 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Cover Image</label>
              <label className="flex items-center justify-center w-full border-2 border-dashed border-white/40 rounded-lg px-4 py-4 cursor-pointer hover:border-white/70 transition">
                <span className="text-white/70 text-sm">
                  {coverImage ? coverImage.name : 'Click to upload cover image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImage}
                  className="hidden"
                />
              </label>
              {/* Cover preview */}
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg border border-white/30"
                />
              )}
              {errors.coverImage && <p className="text-red-200 text-sm mt-1">{errors.coverImage}</p>}
            </div>

            {/* Extra Images Upload */}
            <div>
              <label className="block text-white/80 text-sm mb-1">Extra Images (optional)</label>
              <label className="flex items-center justify-center w-full border-2 border-dashed border-white/40 rounded-lg px-4 py-4 cursor-pointer hover:border-white/70 transition">
                <span className="text-white/70 text-sm">
                  {extraImages.length > 0 ? `${extraImages.length} file(s) selected` : 'Click to upload extra images'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImages}
                  className="hidden"
                />
              </label>
              {/* Extra image previews */}
              {extraPreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {extraPreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Extra ${i + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-white/30"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg px-4 py-3 transition-colors duration-200 mt-2 border border-white/40"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </>
  );
}