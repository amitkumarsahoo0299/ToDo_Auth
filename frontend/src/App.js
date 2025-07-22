import React, { useState } from 'react';
import Auth from './components/Auth';
import TodoList from './components/TodoList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <div>
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <TodoList setToken={setToken} />
      )}
    </div>
  );
}

export default App;