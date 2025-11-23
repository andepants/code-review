import React, { useState } from 'react';
import { useConfigStore, getDecodedApiKey } from '../../store/configStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DEFAULT_CONTEXT_LINES, DEFAULT_FONT_SIZE } from '../../config/constants';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const config = useConfigStore((state) => state.config);
  const setApiKey = useConfigStore((state) => state.setApiKey);
  const updateConfig = useConfigStore((state) => state.updateConfig);

  const [apiKey, setApiKeyInput] = useState(getDecodedApiKey(config.apiKey));
  const [fontSize, setFontSize] = useState(config.fontSize);
  const [contextLines, setContextLines] = useState(config.maxContextLines);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    if (apiKey !== getDecodedApiKey(config.apiKey)) {
      setApiKey(apiKey);
    }
    updateConfig({
      fontSize,
      maxContextLines: contextLines,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div data-testid="settings-modal" className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-text-primary mb-4">Settings</h2>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-2">
              Anthropic API Key
            </label>
            <div className="flex gap-2">
              <input
                data-testid="api-key-input"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 px-3 py-2 bg-background border border-gray-700 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? '🙈' : '👁️'}
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-2">
              Editor Font Size: {fontSize}px
            </label>
            <input
              data-testid="font-size-input"
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Context Lines */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-2">
              Context Lines: {contextLines}
            </label>
            <input
              data-testid="context-lines-input"
              type="range"
              min="5"
              max="50"
              value={contextLines}
              onChange={(e) => setContextLines(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-text-muted mt-1">
              More context helps AI but uses more tokens
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="ghost" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
