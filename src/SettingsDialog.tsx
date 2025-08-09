import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export function SettingsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const settings = useQuery(api.settings.get) ?? {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
  };
  
  const updateSettings = useMutation(api.settings.update);
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const toggleSetting = (key: keyof typeof settings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('showStreaks')}
          >
            <span>Show Streaks</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.showStreaks 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('showConsistency')}
          >
            <span>Show Consistency</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.showConsistency 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('showMotivationalMessages')}
          >
            <span>Show Motivational Messages</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.showMotivationalMessages 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('showEmojis')}
          >
            <span>Show Emojis</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.showEmojis 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('showCalendarView')}
          >
            <span>Enable Calendar View</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.showCalendarView 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => toggleSetting('catTheme')}
          >
            <span>Cat Theme</span>
            <div className={`w-6 h-6 rounded-full border-2 ${
              localSettings.catTheme 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
