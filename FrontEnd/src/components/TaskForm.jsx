/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Use navigate and useParams for routing
import axiosInstance from '../utils/axiosInstance';

const TaskForm = ({ task }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [priority, setPriority] = useState(task?.priority || 'low');
  const [status, setStatus] = useState(task?.status || 'pending'); // Added status state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // For redirection after the task is updated/created
  const { id } = useParams(); // Get the task ID from the URL

  // If the task is being edited, fetch the task by its ID
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axiosInstance.get(`/api/tasks/${id}`);
          const taskData = response.data;
          setTitle(taskData.title);
          setDescription(taskData.description);
          setDueDate(taskData.dueDate);
          setPriority(taskData.priority);
          setStatus(taskData.status); // Set the status when editing
        } catch (error) {
          setError('Error fetching task for editing', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, dueDate, priority, status }; // Include status in the payload

    setLoading(true);
    setError(null);

    try {
      let response;
      if (id) {
        // Update existing task
        response = await axiosInstance.put(`/api/tasks/${id}`, newTask);
      } else {
        // Create new task
        response = await axiosInstance.post('/api/tasks', newTask);
      }

      if (response.status === 200) {
        setLoading(false);
        navigate('/tasks'); // Navigate back to task list after success
      } else {
        setError('Unexpected response from the server.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred while submitting the form. Please try again.');
      console.error('Error:', error.response || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <label className="block text-gray-700 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Submitting...' : id ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
