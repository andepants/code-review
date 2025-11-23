import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { SettingsModal } from './SettingsModal';
import { APP_NAME } from '../../config/constants';

export function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header data-testid="app-header" className="h-14 bg-surface border-b border-gray-700 flex items-center px-6">
        <h1 className="text-lg font-bold text-text-primary">{APP_NAME}</h1>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          title="Settings"
          aria-label="Settings"
        >
          ⚙️
        </Button>
      </header>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
