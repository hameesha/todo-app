import React, { useState, useEffect } from "react";
import sunIcon from "./assets/images/icon-sun.svg";
import moonIcon from "./assets/images/icon-moon.svg";
import {
  addTodo,
  completeTodo,
  removeTodo,
  removeCompleted,
} from "./features/todo/todoSlice";
import { Todo } from "./interfaces/Todo";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import crossIcon from "./assets/images/icon-cross.svg";

function App() {
  const initialTodos = useAppSelector((state) => state.todoReducer.todos);
  const dispatch = useAppDispatch();

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [text, setText] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>("all");
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleFilter = (action: string): void => {
    let filteredTodos;
    switch (action) {
      case "active":
        setActiveButton("active");
        filteredTodos = initialTodos.filter((todo) => !todo.completed);
        break;
      case "completed":
        setActiveButton("completed");
        filteredTodos = initialTodos.filter((todo) => todo.completed);
        break;
      default:
        setActiveButton("all");
        filteredTodos = initialTodos;
    }
    setTodos(filteredTodos);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (text !== "") {
      dispatch(addTodo({ id: Date.now().toString(), text, completed: false }));
      setText("");
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const hanldeCompleteTask = (taskId: string) => {
    dispatch(completeTodo(taskId));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`content-container ${theme === "dark" ? "dark" : "light"}`}>
      <header className="header"></header>
      <section className="content">
        <div className="title-container">
          <h1 className="title">TODO</h1>
          <button className="btn-toggle" onClick={toggleTheme}>
            <img src={theme === "dark" ? sunIcon : moonIcon} alt="theme icon" />
          </button>
        </div>
        <div className="input-container">
          <div className="round">
            <input type="checkbox" disabled id="checkbox" />
            <label htmlFor="checkbox"></label>
          </div>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Create a new todo..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
        </div>
        <div className="content-list-container mb-4">
          {todos.length > 0 && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="todos">
                {(provided) => (
                  <ul
                    className="content-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="list-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="round">
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                id={`checkbox-${todo.id}`}
                                onChange={() => hanldeCompleteTask(todo.id)}
                              />
                              <label htmlFor={`checkbox-${todo.id}`}></label>
                            </div>
                            <span
                              className={`${todo.completed ? "completed" : ""}`}
                            >
                              {todo.text}
                            </span>
                            <button
                              className="btn-delete"
                              onClick={() => dispatch(removeTodo(todo.id))}
                            >
                              <img src={crossIcon} alt="" />
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
          <div className="list-footer desktop-footer">
            <div className="list-info">
              <span>
                {todos.filter((todo) => !todo.completed).length} items left
              </span>
            </div>
            <div className="list-filters">
              <button
                className={`${activeButton === "all" ? "active" : ""}`}
                onClick={() => handleFilter("all")}
              >
                All
              </button>
              <button
                className={`${activeButton === "active" ? "active" : ""}`}
                onClick={() => handleFilter("active")}
              >
                Active
              </button>
              <button
                className={`${activeButton === "completed" ? "active" : ""}`}
                onClick={() => handleFilter("completed")}
              >
                Completed
              </button>
            </div>
            <div className="list-actions">
              <button onClick={() => dispatch(removeCompleted())}>
                Clear completed
              </button>
            </div>
          </div>
        </div>
        <div className="list-footer mobile-footer">
          <div className="list-filters ">
            <button
              className={`${activeButton === "all" ? "active" : ""}`}
              onClick={() => handleFilter("all")}
            >
              All
            </button>
            <button
              className={`${activeButton === "active" ? "active" : ""}`}
              onClick={() => handleFilter("active")}
            >
              Active
            </button>
            <button
              className={`${activeButton === "completed" ? "active" : ""}`}
              onClick={() => handleFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
        <p className="footer-text">Drag and drop to reorder list</p>
      </section>
    </div>
  );
}

export default App;
