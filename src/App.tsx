import React from 'react';
import { ConfigProvider } from 'antd';
import SchemaBuilder from './components/SchemaBuilder';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <div className="App">
        <SchemaBuilder />
      </div>
    </ConfigProvider>
  );
};

export default App;
