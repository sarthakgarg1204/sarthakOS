"use client";

import Image from "next/image";
import React, { JSX, useEffect, useRef, useState } from "react";

interface TerminalAppProps {
  openApp: (appId: string) => void;
  id: string;
}

type TerminalRow = {
  id: number;
  command: string;
  result: string | JSX.Element;
  dirAtExecution: string;
};

type DirectoryMap = Record<string, string[]>;

export default function TerminalApp({ openApp, id }: TerminalAppProps) {
  const [rows, setRows] = useState<TerminalRow[]>([]);
  const [currentDir, setCurrentDir] = useState("~");
  const [dirName, setDirName] = useState("root");
  const [inputValue, setInputValue] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const rowId = useRef<number>(1);

  const protectedDirs = new Set(["personal-documents"]);

  useEffect(() => {
    const handleTerminalOutput = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type: string;
        message: string;
        rowId: number;
      }>;
      const { type, message, rowId } = customEvent.detail;

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                result:
                  type === "error" ? (
                    <span className="text-red-500">{message}</span>
                  ) : (
                    message
                  ),
              }
            : row
        )
      );
    };

    window.addEventListener("terminal-output", handleTerminalOutput);
    return () =>
      window.removeEventListener("terminal-output", handleTerminalOutput);
  }, []);

  const childDirectories: DirectoryMap = {
    root: [
      "books",
      "projects",
      "personal-documents",
      "skills",
      "languages",
      "PDPU",
      "interests",
    ],
    PDPU: ["Sem-6"],
    books: [
      "Eric-Jorgenson_The-Almanack-of-Naval-Ravikant.pdf",
      "Elon Musk: How the Billionaire CEO of SpaceX.pdf",
      "The $100 Startup_CHRIS_GUILLEBEAU.pdf",
      "The_Magic_of_Thinking_Big.pdf",
    ],
    skills: [
      "Front-end development",
      "React.js",
      "jQuery",
      "Flutter",
      "Express.js",
      "SQL",
      "Firebase",
    ],
    projects: [
      "vivek9patel-personal-portfolio",
      "synonyms-list-react",
      "economist.com-unlocked",
      "Improve-Codeforces",
      "flutter-banking-app",
      "Meditech-Healthcare",
      "CPU-Scheduling-APP-React-Native",
    ],
    interests: ["Software Engineering", "Deep Learning", "Computer Vision"],
    languages: ["Javascript", "C++", "Java", "Dart"],
  };

  const escapeHtml = (str: string) =>
    str.replace(/[&<>"'/]/g, (char) => {
      const esc: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
      };
      return esc[char] || char;
    });

  const handleCommand = (raw: string) => {
    const command = raw.trim();
    if (!command || isClosing) return;

    commandHistory.current.push(command);
    historyIndex.current = commandHistory.current.length;

    const parts = command.split(" ");
    const main = parts[0];
    const args = parts.slice(1);
    let result: string | JSX.Element = "";

    const segments =
      currentDir === "~" ? ["root"] : currentDir.split("/").filter(Boolean);
    const currentDirKey = segments.at(-1) || "root";

    switch (main) {
      case "cd": {
        if (args.length === 0) {
          setCurrentDir("~");
          setDirName("root");
          break;
        }

        const target = args[0];
        if (target === "..") {
          if (currentDir !== "~") {
            segments.pop();
            const newDir =
              segments.length === 0 ? "~" : "/" + segments.join("/");
            const newDirName = segments.at(-1) || "root";
            setCurrentDir(newDir);
            setDirName(newDirName);
          }
          break;
        }

        if (protectedDirs.has(target)) {
          result = `bash /${dirName} : Permission denied 😏`;
          break;
        }

        if (childDirectories[currentDirKey]?.includes(target)) {
          const newPath = (currentDir === "~" ? "" : currentDir) + "/" + target;
          setCurrentDir(newPath.replace(/\/{2,}/g, "/"));
          setDirName(target);
        } else {
          result = `bash: cd: ${target}: No such file or directory`;
        }
        break;
      }

      case "ls": {
        const targetDir = args[0] || currentDirKey;
        if (childDirectories[targetDir]) {
          result = (
            <div className="flex flex-wrap gap-2">
              {childDirectories[targetDir].map((file, i) => (
                <span key={i} className="text-ubt-blue font-bold">
                  &apos;{file}
                </span>
              ))}
            </div>
          );
        } else {
          result = `ls: cannot access '${targetDir}': No such file or directory`;
        }
        break;
      }

      case "mkdir": {
        if (!args[0]) {
          result = "mkdir: missing operand";
          break;
        }

        const id = rowId.current++;
        setRows((prev) => [
          ...prev,
          {
            id,
            command,
            result: "", // result will be updated via event
            dirAtExecution: currentDir,
          },
        ]);

        window.dispatchEvent(
          new CustomEvent("create-folder-from-terminal", {
            detail: { folderName: args[0], rowId: id },
          })
        );
        setInputValue("");
        return;
      }

      case "pwd":
        result = currentDir.replace("~", "/home/ubuntu");
        break;

      case "echo":
        result = escapeHtml(args.join(" "));
        break;

      case "clear":
        setRows((prev) => [
          ...prev,
          {
            id: rowId.current++,
            command,
            result: "",
            dirAtExecution: currentDir,
          },
        ]);
        setTimeout(() => {
          setRows([]);
        }, 10);
        setInputValue("");
        return;

      case "exit":
        result = "Closing Terminal...";
        setIsClosing(true);
        setRows((prev) => [
          ...prev,
          {
            id: rowId.current++,
            command,
            result,
            dirAtExecution: currentDir,
          },
        ]);
        setInputValue("");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("closeWindow", { detail: id }));
        }, 1000);
        return;

      case "sudo":
        result = (
          <Image
            src="/images/memes/used-sudo-command.webp"
            alt="sudo meme"
            width={500}
            height={300}
            className="w-2/5"
            unoptimized
          />
        );
        break;

      case "spotify":
      case "chrome":
      case "aboutSarthak":
      case "trash":
      case "todoist":
      case "settings":
      case "vscode":
      case "terminal":
        openApp(main);
        break;

      default:
        result = `Command '${main}' not found. Try: cd, ls, pwd, mkdir, echo, clear, exit, spotify, chrome, settings`;
    }

    setRows((prev) => [
      ...prev,
      {
        id: rowId.current++,
        command,
        result,
        dirAtExecution: currentDir,
      },
    ]);

    setInputValue("");
    setTimeout(() => {
      terminalRef.current?.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex.current > 0) {
        historyIndex.current--;
        setInputValue(commandHistory.current[historyIndex.current] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex.current < commandHistory.current.length - 1) {
        historyIndex.current++;
        setInputValue(commandHistory.current[historyIndex.current] || "");
      } else {
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if (!isClosing) inputRef.current?.focus();
  }, [rows.length, isClosing]);

  return (
    <div
      id="terminal-body"
      ref={terminalRef}
      className="w-full h-full bg-[#2C001E] text-white text-[15px] font-bold p-2 overflow-auto"
      onClick={() => {
        if (!isClosing) inputRef.current?.focus();
      }}
    >
      {rows.map((row) => (
        <div key={row.id} className="mb-1">
          <div className="flex space-x-1">
            <span className="text-ubt-green">user@ubuntu</span>
            <span className="text-white">:</span>
            <span className="text-ubt-blue">{row.dirAtExecution}</span>
            <span className="text-white">$</span>
            <span>{row.command}</span>
          </div>
          <div className="ml-4">{row.result}</div>
        </div>
      ))}

      {!isClosing && (
        <div className="flex space-x-1">
          <span className="text-ubt-green">user@ubuntu</span>
          <span className="text-white">:</span>
          <span className="text-ubt-blue">{currentDir}</span>
          <span className="text-white">$</span>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent flex-1 outline-none text-white"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal Input"
          />
        </div>
      )}
    </div>
  );
}
