import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useConfigStore } from '../store/configStore';
import { createCodeSelection } from '../utils/codeContext';

export function useSelection(editor: any) {
  const setSelection = useEditorStore((state) => state.setSelection);
  const document = useEditorStore((state) => state.document);
  const maxContextLines = useConfigStore((state) => state.config.maxContextLines);

  useEffect(() => {
    if (!editor) return;

    const disposable = editor.onDidChangeCursorSelection((e: any) => {
      const selection = e.selection;

      // Only process if there's an actual selection (not just cursor position)
      if (
        selection.startLineNumber !== selection.endLineNumber ||
        selection.startColumn !== selection.endColumn
      ) {
        if (document?.content) {
          const codeSelection = createCodeSelection(
            selection,
            document.content,
            maxContextLines
          );
          setSelection(codeSelection);
        }
      } else {
        setSelection(null);
      }
    });

    return () => disposable.dispose();
  }, [editor, document, maxContextLines, setSelection]);
}
