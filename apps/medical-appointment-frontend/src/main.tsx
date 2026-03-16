import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreContext } from './stores/StoreContext.tsx'
import { rootStore } from './stores/RootStore.ts'

rootStore.auth.init().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <StoreContext.Provider value={rootStore}>
                <App />
            </StoreContext.Provider>
        </StrictMode>,
    );
});
