// ZplWorkbench.tsx
import { useEffect, useRef, useState } from "react";
import Editor, { useMonaco, type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { registerZplCompletions, registerZplLanguage, ZPL_ID } from "../zplLanguage";

import { loader } from "@monaco-editor/react";
import { Button } from "./ui/button";
import { BrushCleaning, Share } from "lucide-react";
import { toast } from "sonner";
loader.config({ paths: { vs: "/monaco/vs" } });

function getZplCommandAt(
  model: monaco.editor.ITextModel,
  pos: monaco.Position
): string | null {
  const line = model.getLineContent(pos.lineNumber);
  const idx = pos.column - 1;

  const hat = line.lastIndexOf("^", Math.max(0, idx - 1));
  const tilde = line.lastIndexOf("~", Math.max(0, idx - 1));
  const start = Math.max(hat, tilde);
  if (start === -1) return null;

  const prefix = line[start]; // '^' or '~'
  const m = line.slice(start + 1).match(/^[A-Z][A-Z0-9@]?/); // FO, XA, A0, A@
  if (!m) return null;

  return prefix + m[0]; // e.g. "^FO"
}

export default function ZplWorkbench({
  initial = "",
  set,
  onCurrentCommand,
}: {
  initial?: string;
  set: (zpl: string) => void;
  onCurrentCommand?: (cmd: string | null) => void;
}) {
  const monacoInst = useMonaco();
  const [zpl, setZplInt] = useState(initial);

  function setZpl(value: string | undefined) {
    if (value === undefined) return;
    setZplInt(value);
    set(value);
  }

  // Register language + theme once monaco is ready
  useEffect(() => {
    if (!monacoInst) return;
    registerZplLanguage(monacoInst as typeof monaco);
    registerZplCompletions(monacoInst as typeof monaco);
  }, [monacoInst]);

  // Simple validation: warn if ^XA/^XZ are unbalanced
  useEffect(() => {
    if (!monacoInst) return;
    const model = monacoInst.editor.getModels().find(m => m.getLanguageId() === ZPL_ID);
    if (!model) return;

    const text = model.getValue();
    const xa = (text.match(/\^XA/g) || []).length;
    const xz = (text.match(/\^XZ/g) || []).length;

    const markers: monaco.editor.IMarkerData[] = [];
    if (xa !== xz) {
      markers.push({
        severity: monaco.MarkerSeverity.Warning,
        message: `Unbalanced start/end: ^XA=${xa}, ^XZ=${xz}`,
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      });
    }
    monacoInst.editor.setModelMarkers(model, "zpl-check", markers);
  }, [zpl, monacoInst]);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const lastCmdRef = useRef<string | null>(null);
  const onMount: OnMount = (editor) => {
    editorRef.current = editor;

    const recompute = () => {
      const ed = editorRef.current!;
      const model = ed.getModel();
      const pos = ed.getPosition();
      if (!model || !pos) return;

      const cmd = getZplCommandAt(model, pos);
      if (cmd !== lastCmdRef.current) {
        lastCmdRef.current = cmd;
        onCurrentCommand?.(cmd);
      }
    };

    const d1 = editor.onDidChangeCursorPosition(recompute);
    const d2 = editor.onDidChangeModelContent(recompute);
    recompute(); // initial

    return () => { d1.dispose(); d2.dispose(); };
  };

  const replaceAllAsSingleUndo = (text: string) => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (!model) return;
    const full = model.getFullModelRange();

    toast.warning("Cleaned workbench. Undo with Ctrl+Z.", {
      description: "Replaced all content with original ZPL. This counts as a single undo step.",
      duration: 8000,
    });

    ed.pushUndoStop();
    ed.executeEdits(
      "replace-all",
      [{ range: full, text, forceMoveMarkers: true }],
      [new monaco.Selection(1, 1, 1, 1)]
    );
    ed.pushUndoStop();
  };

  return (
    <div className="h-72 w-full md:h-full flex-1">
      <Editor
        className="h-full w-full"
        defaultLanguage={ZPL_ID}
        defaultValue={initial}
        onMount={onMount}
        theme="zpl-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          wordWrap: "off",
          automaticLayout: true,
          padding: { top: 10, bottom: 10 },
          quickSuggestions: { other: true, comments: false, strings: true },
          quickSuggestionsDelay: 50,
          suggest: {
            showIcons: true,
            showInlineDetails: true,
            preview: true,
            showStatusBar: true,
          },
        }}
        onChange={(value) => setZpl(value ?? "")}
        beforeMount={(m) => registerZplLanguage(m as typeof monaco)}
      />
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <Button
          className="p-0! size-8 backdrop-blur-sm bg-white/5 z-20!"
          variant="outline"
          onClick={() => replaceAllAsSingleUndo(initial)}
        >
          <BrushCleaning className="size-4" />
        </Button>
        <Button
          className="p-0! size-8 backdrop-blur-sm bg-white/5 z-20!"
          variant="outline"
          onClick={() => toast.info("Sharing url-inlined zpl workbenches is not implemented yet.")}
        >
          <Share className="size-4" />
        </Button>
      </div>
    </div>

  );
}
