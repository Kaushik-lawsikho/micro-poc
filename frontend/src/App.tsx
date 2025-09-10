// Main App component
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import UsersPage from './components/UsersPage';
import OrdersPage from './components/OrdersPage';
import './App.css';

type Page = 'users' | 'orders';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('users');

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UsersPage />;
      case 'orders':
        return <OrdersPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1 className="app-title">Microservices Frontend</h1>
            <nav className="app-nav">
              <button
                className={`nav-btn ${currentPage === 'users' ? 'active' : ''}`}
                onClick={() => setCurrentPage('users')}
              >
                👥 Users
              </button>
              <button
                className={`nav-btn ${currentPage === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentPage('orders')}
              >
                📦 Orders
              </button>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            {renderPage()}
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>Microservices POC - React Frontend with Redux Toolkit</p>
          </div>
        </footer>
      </div>
    </Provider>
  );
};

export default App;