import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 bg-surface border border-gray-700 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-accent-error">{error}</span>}
    </div>
  );
}
