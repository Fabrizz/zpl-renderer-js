import { ALargeSmall, Barcode, ChevronDown, Compass, Construction, Ruler, Wrench } from "lucide-react";
import { suggestionData } from "@/zplLanguage";
import { useState } from "react";
import BasicMarkdown from "./BasicMarkdown";

function getColors(cmd: (typeof suggestionData[0]) | null | undefined) {
  let Color = "text-yellow-400";
  let ColorBg = "bg-yellow-300/10";
  let ColorBorder = "border-yellow-300/20";
  let ColorFill = "bg-yellow-300/20";
  let Icon = Compass;

  if (cmd) switch (cmd?.kind) {
    case 5: //sk.Class:
      ColorFill = "bg-purple-300";
      Color = "text-purple-300";
      ColorBg = "bg-purple-300/10";
      ColorBorder = "border-purple-300/20";
      Icon = Barcode;
      break;
    case 18: //sk.Text:
      ColorFill = "bg-blue-300";
      Color = "text-blue-300";
      ColorBg = "bg-blue-300/10";
      ColorBorder = "border-blue-300/20";
      Icon = ALargeSmall;
      break;
    case 6: //sk.Struct:
      ColorFill = "bg-lime-300";
      Color = "text-lime-300";
      ColorBg = "bg-lime-300/10";
      ColorBorder = "border-lime-300/20";
      Icon = Construction;
      break;
    case 10: //sk.Event:
      ColorFill = "bg-red-300";
      Color = "text-red-300";
      ColorBg = "bg-red-300/10";
      ColorBorder = "border-red-300/20";
      Icon = Wrench;
      break;
    case 25: //sk.User:
      ColorFill = "bg-orange-300";
      Color = "text-orange-300";
      ColorBg = "bg-orange-300/10";
      ColorBorder = "border-orange-300/20";
      Icon = Ruler;
      break;
    case 27: //sk.Snippet:
      ColorFill = "bg-yellow-300";
      Color = "text-yellow-300";
      ColorBg = "bg-yellow-300/10";
      ColorBorder = "border-yellow-300/20";
      Icon = Wrench;
      break;
  } else {
    ColorFill = "bg-white/80";
    Color = "text-white/80";
    ColorBg = "bg-white/10";
    ColorBorder = "border-white-800/30";
    Icon = Ruler;
  }

  return { Color, ColorBg, ColorBorder, ColorFill, Icon };
}

export default function Help({ cmd = "^XA" }: { cmd: string | null | undefined }) {
  const [open, setOpen] = useState(false);

  let command: (typeof suggestionData)[0] | null = null;

  if (!cmd) {
    command = {
      label: "##",
      kind: 30,
      detail: "Select a command to see documentation",
      documentation: { value: "When you write a ZPL command documentation will appear here \n\n `Use Ctrl + Space` to view suggestions in the editor.", isTrusted: true },
      insertText: "",
      insertTextRules: 4, //languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }
  } else {
    cmd = cmd?.toUpperCase() || null;
    // Find the command in the suggestion data
    command = suggestionData.find(s => s.label === cmd) || null;
    if (!command) {
      const nc = cmd?.substring(0, 2) || "";
      command = suggestionData.find(s => s.label.startsWith(nc)) || null;
    }
  }

  const { Color, ColorBg, ColorBorder, ColorFill, Icon } = getColors(command);

  return (
    <div className={`transition-all relative duration-300 overflow-hidden w-full max-w-full flex-wrap z-20 h-9.5 px-1.5 border-b border-white/10 bg-neutral-900/80 ${open ? "h-32!" : ""}`}>
      <button onClick={() => setOpen(!open)} className={`my-1.25! gap-1 group overflow-hidden h-7 flex-1 flex items-center px-2 w-full justify-between rounded-md border transition-all duration-300 ${Color} ${ColorBg} ${ColorBorder}`}>
        <span className={`absolute transition-all duration-300 -top-8 -left-8 h-12 w-18 z-0 blur-2xl ${ColorFill}`}></span>
        <span className='font-mono font-bold mt-px z-10'>{cmd || command?.label}</span>
        <span className='text-white/80 gap-1 mb-0.5 ml-0.5 flex-1 flex items-center justify-center text-sm transition-all z-10'>
          <span>{command?.detail}</span>
          <ChevronDown className={"inline size-4 transition-all duration-300 " + (open ? "rotate-180" : "")}/>
        </span>
        <Icon className={`inline size-4 z-10`} />
      </button>
      <div className={`text-gray-50 h-22 overflow-y-scroll nice-scroll border-t border-border -mx-1.5 px-2 pt-1`}>
        <BasicMarkdown
          className="prose max-w-none text-sm"
          markdown={command?.documentation.value || ""}
        />
      </div>
    </div>
  );
}