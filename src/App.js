import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify'
import config from './aws-exports'; // Make sure this path is correct
import { generateClient } from 'aws-amplify/api';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

Amplify.configure(config);

const client = generateClient();

function App({ signOut }) {
  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const result = await client.graphql({
        query: listTodos,
      });
      setTodos(result.data.listTodos.items);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  }

  async function handleCreateTodo() {
    try {
      if (!todoName) return;
      const result = await client.graphql({
        query: createTodo,
        variables: {
          input: {
            name: todoName,
            description: '', // Add description if needed, or update your mutation to not require a description
          },
        },
      });
      console.log('Todo created:', result);
      setTodoName('');
      fetchTodos();
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <input
        type="text"
        placeholder="Enter todo name"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
      />
      <button onClick={handleCreateTodo}>Add Todo</button>
      <button onClick={signOut}>Sign Out</button>
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <h3>{todo.name}</h3>
            <p>{todo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
