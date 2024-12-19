import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Download } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Custom Alert Component
const Alert = ({ variant = 'info', title, children, onClose }) => {
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} mb-4 relative`}>
      {title && <h3 className="font-semibold mb-1">{title}</h3>}
      <div className="text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          x
        </button>
      )}
    </div>
  );
};

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    title: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resources`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResources(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch resources');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUploadStatus(null);
    
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formPayload = new FormData();
    formPayload.append('file', selectedFile);
    Object.keys(formData).forEach(key => {
      formPayload.append(key, formData[key]);
    });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resources/upload`, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUploadStatus('success');
        setFormData({ topic: '', title: '', description: '' });
        setSelectedFile(null);
        fetchResources();
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        fetchResources();
      } else {
        throw new Error(data.message || 'Failed to delete resource');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete resource');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resource Management</h1>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Resource</h2>
        
        {error && (
          <Alert variant="error" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {uploadStatus === 'success' && (
          <Alert variant="success" title="Success" onClose={() => setUploadStatus(null)}>
            Resource uploaded successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              accept=".zip,.docx,.pptx"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: ZIP, DOCX, PPTX (Max 10MB)
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>

      {/* Resources List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Resources List</h2>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No resources found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Topic</th>
                  <th className="px-4 py-2 text-left">File Type</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Uploaded</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" />
                        {resource.title}
                      </div>
                    </td>
                    <td className="px-4 py-2">{resource.topic}</td>
                    <td className="px-4 py-2">
                      {resource.fileType.split('/')[1].toUpperCase()}
                    </td>
                    <td className="px-4 py-2">
                      {formatFileSize(resource.size)}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(resource.uploadedAt)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-500 hover:text-blue-600"
                          title="Download"
                        >
                          <Download size={20} />
                        </a>
                        <button
                          onClick={() => handleDelete(resource._id)}
                          className="p-1 text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManagement;