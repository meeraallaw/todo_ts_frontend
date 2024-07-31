import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/style.css'; // Make sure to include your CSS styles in a separate file
import Navbar from '../components/Navbar'; // Import Navbar component
import Input from '../components/Input'; // Import Input component

interface Task {
  _id: string;
  text: string;
  completed: boolean;
}

const ToDoApp: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(''); // Assuming userId is stored in state after login
  const [isMobileMode, setIsMobileMode] = useState(false); // State to track mobile mode
  const [tasks, setTasks] = useState<Task[]>([
    { _id: '1', text: 'Complete presentation for team meeting on Friday', completed: false },
    { _id: '2', text: 'Schedule dentist appointment for next month', completed: false },
    { _id: '3', text: 'Buy groceries for the week', completed: false },
    { _id: '4', text: 'Call utility company to resolve billing issue', completed: false },
    { _id: '5', text: 'Finish reading chapter 3 of "The Great Gatsby"', completed: false },
    { _id: '6', text: 'Go for a 30-minute run in the park', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const setError = (errorMessage: string) => {
    console.error('Error:', errorMessage);
    // Handle error logic here
  };

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    // Retrieve user image from local storage
    const image = localStorage.getItem('userImage');
    setUserImage(image);

    // Fetch tasks from server
    fetchTasks();
  }, [lightMode]);

  useEffect(() => {
    // Function to handle resize and determine mobile mode
    const handleResize = () => {
      const lightModeImage = document.getElementById('lightModeImage');
      if (window.innerWidth <= 640) {
        if (lightModeImage) {
          lightModeImage.style.display = 'none';
        }
        setIsMobileMode(true);
      } else {
        if (lightModeImage) {
          lightModeImage.style.display = 'block';
        }
        setIsMobileMode(false);
      }
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Initial check on component mount
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5036/tasks/668e2595066f80aee71834c4')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const toggleCompletion = (index: number) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const addNewTask = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { _id: Date.now().toString(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted);
  };

  return (
    <div className="container">
      <Navbar toggleLightMode={toggleLightMode} lightMode={lightMode} /> {/* Pass toggleLightMode and lightMode as props */}
      <hr className="hr-line" />
      <div className="tasks-container">
        <div className="hide-completed">
          <button
            onClick={toggleHideCompleted}
            className="hide-button bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {hideCompleted ? (
              <>
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                <span>Unhide Completed</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                <span>Hide Completed</span>
              </>
            )}
          </button>
        </div>

        <div className="completion-message text-gray-500">
          {tasks.filter((task) => task.completed).length} Completed
        </div>
        {tasks.map((task, index) =>
          (!hideCompleted || !task.completed) && (
            <div className="task-content">
            <div className="task-item flex items-center mb-4" key={task._id}>
              <div
                className={`task-icon w-8 h-8 border border-gray-800 rounded-full cursor-pointer ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleCompletion(index)}
              ></div>
              <h5 className={`ml-4 flex-1 ${task.completed ? 'completed-text' : ''}`}>
                {task.text}
              </h5>
              {!isMobileMode && (
              <div className="trashcan-container">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="delete-icon text-gray-500 cursor-pointer"
                  onClick={() => deleteTask(index)}
                />
              </div>
              )}
              </div>
            </div>
          )
        )}
      </div>
      {!isMobileMode && ( // Render the "Add New Note" input field only if not in mobile mode
        <div className="add-note flex items-center mt-4">
          <input
            type="text"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            placeholder="New Note"
            className="w-full max-w-md h-10 px-2 rounded-lg bg-gray-800 text-white mr-2"
          />
          <button
            type="button"
            onClick={addNewTask}
            className="w-40 h-10 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-300 cursor-pointer"
          >
            Add New Note
          </button>
        </div>
      )}
    </div>
  );
};

export default ToDoApp;
