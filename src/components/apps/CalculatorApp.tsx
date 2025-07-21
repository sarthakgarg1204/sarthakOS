'use client';

import { Parser } from 'expr-eval';
import { useEffect, useRef, useState } from 'react';

type TerminalEntry = {
  id: number;
  command: string;
  result: string;
};

type CalculatorAppProps = {
  id: string;
};

const parser = new Parser({
  operators: {
    add: true,
    subtract: true,
    multiply: true,
    divide: true,
    power: true,
    remainder: true,
    factorial: true,
    conditional: true,
    assignment: true,
    logical: false,
    comparison: false,
  },
});

parser.functions.ln = (x: number) => Math.log(x);

// Dynamic log base: log2(x), log3(x), ..., log36(x)
for (let base = 2; base <= 36; base++) {
  parser.functions[`log${base}`] = (x: number) => Math.log(x) / Math.log(base);
}

export default function CalculatorApp({ id }: Readonly<CalculatorAppProps>) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isClosing, setIsClosing] = useState(false);
  const variables = useRef<Record<string, number>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.trim();
      if (!cmd) return;

      const output = handleCommand(cmd);
      if (output !== null) {
        setEntries((prev) => [...prev, { id: prev.length, command: cmd, result: output }]);
      }

      setHistory((prev) => [...prev, cmd]);
      setHistoryIndex(history.length + 1);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const index = historyIndex - 1;
        setHistoryIndex(index);
        setCurrentCommand(history[index] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        const index = historyIndex + 1;
        setHistoryIndex(index);
        setCurrentCommand(history[index] || '');
      } else {
        setCurrentCommand('');
        setHistoryIndex(history.length);
      }
    }
  };

  const handleCommand = (cmd: string): string | null => {
    const normalized = cmd.toLowerCase().trim();

    if (normalized === 'clear') {
      setEntries([]);
      return null;
    }

    if (normalized === 'exit') {
      setIsClosing(true);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('closeWindow', { detail: id }));
      }, 1000);
      return 'Exiting Calculator...';
    }

    if (normalized === 'help') {
      return `📚 Available Commands:
• Operators: + - * / % ^ =
• Functions: sin(x), cos(x), sqrt(x), abs(x), round(x)
• Logs: log(x), ln(x), log10(x), log2(x)...log36(x)
• Variables: a = 5, b = a + 2
• Commands: help, clear, reset, vars, exit`;
    }

    if (normalized === 'vars') {
      const vars = Object.entries(variables.current)
        .map(([key, val]) => `${key} = ${val}`)
        .join('\n');
      return vars || 'No variables set.';
    }

    if (normalized === 'reset') {
      variables.current = {};
      return 'All variables cleared.';
    }

    try {
      const expr = parser.parse(cmd);
      const result = expr.evaluate(variables.current);

      const match = RegExp(/\d\W/).exec(cmd);
      if (match) {
        const varName = match[1];
        variables.current[varName] = result;
      }

      return result.toString();
    } catch (err) {
      if (err instanceof Error) {
        return `⚠️ Error: ${err.message}`;
      }
      return '⚠️ Unknown error occurred.';
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-[#2C001E] text-white p-3 text-sm font-mono leading-6 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
      tabIndex={0} // Makes the div focusable via keyboard
      role="textbox"
      aria-label="Calculator input area"
    >
      <div className="mb-1 text-[#FFA07A]">Ubuntu Terminal Calculator v2.12.7</div>
      <div className="mb-1 text-[#ccc]">Type &quot;help&quot; for instructions.</div>
      <div className="mb-4 text-[#666]">[Enter to evaluate, ↑↓ for history]</div>

      {entries.map((entry) => (
        <div key={entry.id} className="mb-2">
          <div className="flex">
            <span className="text-green-400 mr-2">&gt;</span>
            <span className="whitespace-pre-wrap break-words">{entry.command}</span>
          </div>
          <div className="ml-6 text-[#98fb98] whitespace-pre-wrap">{entry.result}</div>
        </div>
      ))}

      {!isClosing && (
        <div className="flex items-center">
          <span className="text-green-400 mr-2">&gt;</span>
          <input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-white caret-[#33ff33] font-mono"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
