import React, { useState} from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');


  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    const newTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id: newTaskId, text: inputValue, completed: false };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };



  const handleCompleteTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleUndoTask = (id) => {
    const task = completedTasks.find((task) => task.id === id);
    setCompletedTasks((prevCompletedTasks) => prevCompletedTasks.filter((task) => task.id !== id));
    setTasks((prevTasks) => {
      const insertIndex = task.completed ? prevTasks.length : 0;
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(insertIndex, 0, task);
      return updatedTasks;
    });
  };

  const handleMoveUp = (id) => {
    const currentIndex = tasks.findIndex((task) => task.id === id);
    if (currentIndex > 0) {
      const updatedTasks = [...tasks];
      const taskToMove = updatedTasks.splice(currentIndex, 1)[0];
      updatedTasks.splice(currentIndex - 1, 0, taskToMove);
      setTasks(updatedTasks);
      // Dodaj klasę do elementu, który przesuwamy w górę
      document.getElementById(id).classList.add('move-up');
      setTimeout(() => {
        // Usuń klasę po zakończeniu animacji
        document.getElementById(id).classList.remove('move-up');
      }, 100);
    }
  };

  const handleMoveDown = (id) => {
    const currentIndex = tasks.findIndex((task) => task.id === id);
    if (currentIndex < tasks.length - 1) {
      const updatedTasks = [...tasks];
      const taskToMove = updatedTasks.splice(currentIndex, 1)[0];
      updatedTasks.splice(currentIndex + 1, 0, taskToMove);
      setTasks(updatedTasks);

      //add a class to the element which moving down
      document.getElementById(id).classList.add('move-down');
      setTimeout(() => {

        // delete class after finished animation
        document.getElementById(id).classList.remove('move-down');
      }, 100);
    }
  };

  const handleEditTask = (id, text) => {
    setEditTaskId(id);
    setEditedText(text);
  };

  const handleSaveTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editedText } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
  };

  const handleDeleteTask = (id) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć to zadanie?');
    if (confirmed) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleDeleteCompletedTask = (id) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć to zakończone zadanie?');
    if (confirmed) {
      setCompletedTasks(completedTasks.filter((task) => task.id !== id));
    }
  };

  const handleDeleteAllTasks = () => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć wszystkie zadania?');
    if (confirmed) {
      setTasks([]);
      setCompletedTasks([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="App">
    <header className='header'>
      <h1>To Do List</h1>
    <div className='add-task'>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // Add event handler onKeyDown
        placeholder="Add task..."
      />
      <button 
        onClick={handleAddTask}>
        <FontAwesomeIcon icon={faList} />
        </button>
    </div>
    </header>

    <section className='tasks'>
        <h2>Active Tasks:</h2>
      <ul className='task-list'>
        {tasks.map((task) => (
          <li
            key={task.id}
            id={task.id} //  Add unique id to each li element
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={handleKeyDown} //  Add event handler 
                />
                <button className="edit-task-button" onClick={() => handleSaveTask(task.id)}>
            <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              </div>
            ) : (
              <span>{task.text}</span>
            )}
            <div className='buttons'>

            {!task.completed ? (
              <button onClick={() => handleCompleteTask(task.id)}>
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                />
              </button>
            ) : (
              <button onClick={() => handleUndoTask(task.id)}>
                  <FontAwesomeIcon
                    icon={faRotateLeft}
                  />
              </button>
            )}
            <button onClick={() => handleEditTask(task.id, task.text)}>
            <FontAwesomeIcon
              icon={faPenToSquare}
            /></button>
            <button onClick={() => handleDeleteTask(task.id)}>
              <FontAwesomeIcon
                icon={faTrash}
              />
            </button>
            <button onClick={() => handleMoveUp(task.id)}>
              <FontAwesomeIcon
                icon={faArrowUp}
              />
            </button>
            <button onClick={() => handleMoveDown(task.id)}>
              <FontAwesomeIcon
                icon={faArrowDown}
              />
            </button>
            </div>
          </li>
        ))}
      </ul>
    </section>

      <section className='completed-tasks'>


      <h2>Finished Tasks:</h2>
      <ul className='task-list'>
        {completedTasks.map((tasks) => (
          <li
            style={{ color: tasks.completed ? 'black' : 'red', }}
            key={tasks.id}>
            <s>{tasks.text}</s>
            <button onClick={() => handleUndoTask(tasks.id)}>
              <FontAwesomeIcon
                icon={faRotateLeft}
              />
            </button>
            <button onClick={() => handleDeleteCompletedTask(tasks.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
      <button className='clear-all' onClick={handleDeleteAllTasks}>
        <FontAwesomeIcon icon={faTrash}/>
      </button>
</section>
    </div>
  );
};

export default App;