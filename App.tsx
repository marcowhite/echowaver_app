
import React from 'react';
import { Router } from './src/routes/Router';
import { AuthProvider } from './src/contexts/Auth';

function App(): React.JSX.Element {
  // let cookies = CookieManager.get('http://10.0.2.2:8000/');
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}


export default App;

