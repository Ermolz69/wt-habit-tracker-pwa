import { useState, useEffect } from 'react';
import localforage from 'localforage';


const getFormattedDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getFormattedDate(d));
  }
  return days;
};

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const today = getFormattedDate(new Date());
  const last7Days = getLast7Days();

  // 1. ПЕРЕХОПЛЕННЯ ПОДІЇ ВСТАНОВЛЕННЯ PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // 2. ЗАВАНТАЖЕННЯ ДАНИХ
  useEffect(() => {
    async function loadHabits() {
      const savedHabits = await localforage.getItem('my-habits-v2'); 
      if (savedHabits) {
        setHabits(savedHabits);
      } else {
        const yesterday = getFormattedDate(new Date(Date.now() - 86400000));
        const twoDaysAgo = getFormattedDate(new Date(Date.now() - 86400000 * 2));
        
        setHabits([
          { id: 1, title: 'Тренування (бокс/зал)', completedDates: [twoDaysAgo, yesterday] },
          { id: 2, title: 'Догляд за рослинами (обробка самшиту)', completedDates: [today] },
          { id: 3, title: 'Замішати нову порцію квасу', completedDates: [] },
        ]);
      }
      setIsLoaded(true);
    }
    loadHabits();
  }, []);

  // 3. ЗБЕРЕЖЕННЯ ДАНИХ
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('my-habits-v2', habits);
    }
  }, [habits, isLoaded]);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompletedToday = habit.completedDates.includes(today);
        const newDates = isCompletedToday
          ? habit.completedDates.filter(date => date !== today) 
          : [...habit.completedDates, today]; 
        
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      title: newHabitTitle,
      completedDates: []
    };
    setHabits([newHabit, ...habits]);
    setNewHabitTitle('');
  };

  const deleteHabit = (id) => {
    if(window.confirm('Точно видалити цю звичку?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  if (!isLoaded) return null; 

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '24px' }}>Мій трекер звичок</h2>
      
      {deferredPrompt && (
        <button 
          onClick={handleInstallClick}
          style={{ width: '100%', padding: '12px', marginBottom: '24px', cursor: 'pointer', borderRadius: '12px', border: 'none', backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          📱 Встановити застосунок
        </button>
      )}

      <form onSubmit={addHabit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={newHabitTitle}
          onChange={(e) => setNewHabitTitle(e.target.value)}
          placeholder="Нова звичка..."
          style={{ flexGrow: 1, padding: '12px', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 20px', cursor: 'pointer', borderRadius: '12px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
          +
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today);
          
          return (
            <div key={habit.id} style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
              
              <button 
                onClick={() => deleteHabit(habit.id)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}
                title="Видалити"
              >
                ✕
              </button>

              <h3 style={{ margin: '0 0 16px 0', paddingRight: '24px', fontSize: '18px', color: '#1f2937' }}>
                {habit.title}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Останні 7 днів:</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {last7Days.map(date => {
                      const isDone = habit.completedDates.includes(date);
                      return (
                        <div 
                          key={date} 
                          title={date}
                          style={{ 
                            width: '16px', height: '16px', borderRadius: '50%', 
                            backgroundColor: isDone ? '#22c55e' : '#e5e7eb',
                            border: isDone ? 'none' : '1px solid #d1d5db'
                          }} 
                        />
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => toggleHabit(habit.id)}
                  style={{ 
                    padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', border: 'none', fontWeight: 'bold',
                    backgroundColor: isCompletedToday ? '#f3f4f6' : '#22c55e',
                    color: isCompletedToday ? '#6b7280' : 'white',
                    transition: 'all 0.2s',
                    boxShadow: isCompletedToday ? 'none' : '0 2px 4px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {isCompletedToday ? '✓ Виконано' : 'Відмітити'}
                </button>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center' }}>Немає звичок. Додайте першу!</p>}
      </div>
    </div>
  );
}