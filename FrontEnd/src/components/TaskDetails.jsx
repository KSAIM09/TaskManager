import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const { data } = await axiosInstance.get(`/api/tasks/${id}`);
      setTask(data);
    };
    fetchTask();
  }, [id]);

  if (!task) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">{task.title}</h1>
      <p className="text-gray-600 mb-2">{task.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-green-600' : task.status === 'in-progress' ? 'text-yellow-600' : 'text-red-600'}`}>
        <strong>Status:</strong> {task.status}
      </p>
    </div>
  );
};

export default TaskDetails;
