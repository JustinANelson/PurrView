import { useState } from 'react';
import { Cat } from 'lucide-react';
import { FeedPlayer } from './components/FeedPlayer';

type FilterMode = 'all' | 'videos' | 'gifs';

function App() {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  return (
    <>
      <header className="app-header">
        <div className="logo-section">
          <h1>
            <Cat size={24} className="logo-icon" />
            <span>PurrReels</span>
          </h1>
        </div>

        <nav className="nav-tabs">
          <button
            className={`tab-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            For You
          </button>
          <button
            className={`tab-btn ${filterMode === 'videos' ? 'active' : ''}`}
            onClick={() => setFilterMode('videos')}
          >
            Videos
          </button>
          <button
            className={`tab-btn ${filterMode === 'gifs' ? 'active' : ''}`}
            onClick={() => setFilterMode('gifs')}
          >
            GIFs
          </button>
        </nav>

        {/* Empty placeholder to balance out logo/tabs flexbox layout */}
        <div style={{ width: '48px' }} />
      </header>

      <main>
        <FeedPlayer filterMode={filterMode} />
      </main>
    </>
  );
}

export default App;
