import { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import axiosInstance from '../utils/axiosInstance';

const HomePage = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
    status: 'To Do', // Added status field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component loads
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await axiosInstance.post('/api/tasks', newTask, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setShowTaskForm(false); // Close the form
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', assignedTo: '', status: 'To Do' }); // Reset form
      fetchTasks(); // Fetch updated tasks
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.error : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            + New Task
          </button>
        </div>
      </header>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="dueDate">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
};

export default HomePage;
