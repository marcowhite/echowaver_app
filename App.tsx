
import React, { useEffect } from 'react';
import { Router } from './src/routes/Router';
import { AuthProvider } from './src/contexts/AuthContext';
import { init } from '@amplitude/analytics-react-native';
import { initializeAmplitude } from './src/utils/amplitude';

function App(): React.JSX.Element {


  useEffect(() => {
    initializeAmplitude();
  }, []);

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}


export default App;

