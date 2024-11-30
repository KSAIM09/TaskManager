import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1); // To track total pages

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/tasks?page=${page}`);
        console.log(data); // Log to verify data structure
        setTasks(Array.isArray(data.tasks) ? data.tasks : []); // Assuming API returns tasks in `data.tasks`
        setTotalPages(data.totalPages); // Assuming API returns total pages count
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axiosInstance.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter((task) => task._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete task');
      }
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="p-4 border mb-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl text-blue-400">{task.title}</h2>
              <p className="text-gray-300">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className={`text-${task.status === 'completed' ? 'green' : 'red'}-500`}>
                Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </p>
              <div className="flex space-x-2">
                <Link to={`/tasks/${task._id}`} className="text-blue-500 hover:underline">View</Link>
                <Link to={`/tasks/edit/${task._id}`} className="text-green-500 hover:underline">Edit</Link>
                <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-700"
        >
          Prev
        </button>
        <span className="text-white">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
