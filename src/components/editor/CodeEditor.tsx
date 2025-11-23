import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEditorStore } from '../../store/editorStore';
import { useThreadStore } from '../../store/threadStore';
import { useConfigStore } from '../../store/configStore';
import { MONACO_OPTIONS } from '../../config/monaco';
import { THREAD_COLORS } from '../../config/constants';
import { detectLanguage } from '../../utils/languageDetection';
import { EditorToolbar } from './EditorToolbar';

export function CodeEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const document = useEditorStore((state) => state.document);
  const updateContent = useEditorStore((state) => state.updateContent);
  const setLanguage = useEditorStore((state) => state.setLanguage);
  const setDocument = useEditorStore((state) => state.setDocument);
  const setSelection = useEditorStore((state) => state.setSelection);
  const threads = useThreadStore((state) => state.threads);
  const fontSize = useConfigStore((state) => state.config.fontSize);

  // Initialize document if it doesn't exist
  useEffect(() => {
    if (!document) {
      setDocument({
        id: crypto.randomUUID(),
        content: '',
        language: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [document, setDocument]);

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    // Set up auto language detection
    const model = editorInstance.getModel();
    if (model) {
      model.onDidChangeContent(() => {
        const content = model.getValue();
        updateContent(content);

        // Auto-detect language
        if (content.length > 10) {
          const detectedLang = detectLanguage(content);
          if (detectedLang !== document?.language) {
            setLanguage(detectedLang);
            monaco.editor.setModelLanguage(model, detectedLang);
          }
        }
      });
    }

    // Track selection changes
    editorInstance.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      const model = editorInstance.getModel();

      if (!model) return;

      // Check if there's an actual selection (not just a cursor position)
      const hasSelection =
        selection.startLineNumber !== selection.endLineNumber ||
        selection.startColumn !== selection.endColumn;

      if (hasSelection) {
        const selectedText = model.getValueInRange(selection);
        const lines = model.getLinesContent();

        // Get context before (previous 3 lines)
        const contextBeforeLines = lines.slice(
          Math.max(0, selection.startLineNumber - 4),
          selection.startLineNumber - 1
        );
        const contextBefore = contextBeforeLines.join('\n');

        // Get context after (next 3 lines)
        const contextAfterLines = lines.slice(
          selection.endLineNumber,
          Math.min(lines.length, selection.endLineNumber + 3)
        );
        const contextAfter = contextAfterLines.join('\n');

        setSelection({
          startLine: selection.startLineNumber,
          startColumn: selection.startColumn,
          endLine: selection.endLineNumber,
          endColumn: selection.endColumn,
          selectedText,
          contextBefore,
          contextAfter,
        });
      } else {
        // Clear selection when nothing is selected
        setSelection(null);
      }
    });
  };

  // Update thread decorations
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const decorations: editor.IModelDeltaDecoration[] = [];

    threads.forEach((thread) => {
      const color = THREAD_COLORS[thread.colorIndex - 1];
      const isResolved = thread.status === 'resolved';

      decorations.push({
        range: new monaco.Range(
          thread.selection.startLine,
          1,
          thread.selection.endLine,
          1
        ),
        options: {
          isWholeLine: true,
          className: isResolved ? 'opacity-50' : '',
          glyphMarginClassName: 'thread-glyph',
          glyphMarginHoverMessage: { value: `Thread ${thread.colorIndex}` },
          linesDecorationsClassName: 'thread-decoration',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          overviewRuler: {
            color: color,
            position: monaco.editor.OverviewRulerLane.Left,
          },
        },
      });
    });

    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      decorations
    );
  }, [threads]);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar />
      <div className="flex-1">
        <Editor
          height="100%"
          language={document?.language || 'javascript'}
          value={document?.content || ''}
          theme="vs-dark"
          options={{
            ...MONACO_OPTIONS,
            fontSize,
          }}
          onMount={handleEditorDidMount}
          loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
        />
      </div>
    </div>
  );
}
