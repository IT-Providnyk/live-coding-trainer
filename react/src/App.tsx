// Trainer shell: picks a task from the sidebar and shows your Task.tsx, the reference
// Solution.tsx or the README. Tasks are discovered automatically from src/tasks/*.
// You do not need to edit this file.
import { Component, Suspense, lazy, useEffect, useState, type ComponentType, type ReactNode } from 'react';

type Module = { default: ComponentType };

const taskModules = import.meta.glob<Module>('./tasks/*/Task.tsx');
const solutionModules = import.meta.glob<Module>('./tasks/*/Solution.tsx');
const readmes = import.meta.glob<string>('./tasks/*/README.md', { query: '?raw', import: 'default', eager: true });

const tasks = Object.keys(readmes)
  .sort()
  .map((path) => {
    const folder = path.split('/')[2];
    const readme = readmes[path];
    return {
      id: folder.slice(0, 2),
      folder,
      title: readme.match(/^#\s+(.+)$/m)?.[1] ?? folder,
      readme,
      Task: lazy(taskModules[`./tasks/${folder}/Task.tsx`]),
      Solution: lazy(solutionModules[`./tasks/${folder}/Solution.tsx`]),
    };
  });

type View = 'task' | 'solution' | 'readme';

function parseHash(): { id: string; view: View } {
  const [, id = tasks[0]?.id ?? '', view = 'task'] = window.location.hash.split('/');
  return { id, view: (['task', 'solution', 'readme'].includes(view) ? view : 'task') as View };
}

function useHashRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <div className="error">Компонент упав: {this.state.error.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { id, view } = useHashRoute();
  const [restartKey, setRestartKey] = useState(0);
  const task = tasks.find((t) => t.id === id) ?? tasks[0];

  useEffect(() => {
    document.title = task ? `${task.id} ${view === 'solution' ? '(еталон)' : ''} | React trainer` : 'React trainer';
  }, [task, view]);

  if (!task) return <p className="page">Задач не знайдено в src/tasks.</p>;

  const Current = view === 'solution' ? task.Solution : task.Task;

  return (
    <div className="shell">
      <nav className="shell__nav">
        <h2>React-тренажер</h2>
        {tasks.map((t) => (
          <a
            key={t.id}
            href={`#/${t.id}/${view}`}
            className={`shell__link ${t.id === task.id ? 'shell__link--active' : ''}`}
          >
            {t.title}
          </a>
        ))}
      </nav>

      <div className="shell__main">
        <div className="shell__bar">
          <span className="shell__title">
            {task.title} <span className="muted">src/tasks/{task.folder}</span>
          </span>
          <a className={`button ${view === 'readme' ? 'button--active' : ''}`} href={`#/${task.id}/readme`}>Умова</a>
          <a className={`button ${view === 'task' ? 'button--active' : ''}`} href={`#/${task.id}/task`}>Моє рішення</a>
          <a className={`button ${view === 'solution' ? 'button--active' : ''}`} href={`#/${task.id}/solution`}>Еталон</a>
          <button className="button" onClick={() => setRestartKey((k) => k + 1)}>Перемонтувати</button>
        </div>

        {view === 'readme' ? (
          <div className="readme">{task.readme}</div>
        ) : (
          <ErrorBoundary key={`${task.id}-${view}-${restartKey}`}>
            <Suspense fallback={<p className="page muted">Завантаження модуля…</p>}>
              <Current />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
