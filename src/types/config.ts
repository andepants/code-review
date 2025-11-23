/**
 * Application configuration
 */
export interface AppConfig {
  apiKey: string;
  theme: 'light' | 'dark';
  editorTheme: string;
  defaultLanguage: string;
  maxContextLines: number;
  autoSave: boolean;
  fontSize: number;
}
