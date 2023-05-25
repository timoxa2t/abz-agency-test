import React, { useRef, useState } from 'react';
import { Header } from './components/Header';
import { HomeBanner } from './components/HomeBanner';
import { UsersSection } from './components/UsersSection';
import { FormSection } from './components/FormSection';
import { SuccessSection } from './components/SuccessSection';

function App() {
  const [isUserCreated, setIsUserCreated] = useState(false);
  const usersRef = useRef<null | HTMLDivElement>(null)
  const formRef = useRef<null | HTMLDivElement>(null)

  return (
    <div className="App">
      <h1>Main page</h1>

      <Header usersRef={usersRef} formRef={formRef} />

      <main className="App-header">
        <HomeBanner formRef={formRef} />

        <div ref={usersRef}>
          <UsersSection />
        </div>
        
        <div ref={formRef}>
          {isUserCreated
            ? <SuccessSection />
            : <FormSection setIsUserCreated={setIsUserCreated} />
          }
        </div>
      </main>
    </div>
  );
}

export default App;
