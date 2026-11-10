import { useState, useEffect } from 'react';
import SurveyPage from './pages/SurveyPage';
import DashboardPage from './pages/DashboardPage';

type ViewMode = 'dashboard' | 'survey';

function getInitialView(): ViewMode {
  if (typeof window === 'undefined') return 'dashboard';
  const params = new URLSearchParams(window.location.search);
  return params.get('view') === 'survey' ? 'survey' : 'dashboard';
}

export default function App() {
  const [view, setView] = useState<ViewMode>(getInitialView);

  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (nextView: ViewMode) => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === 'survey') {
      url.searchParams.set('view', 'survey');
    } else {
      url.searchParams.delete('view');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (view === 'survey') {
    return <SurveyPage onSwitchToDashboard={() => navigateTo('dashboard')} />;
  }

  return <DashboardPage onSwitchToSurvey={() => navigateTo('survey')} />;
}
