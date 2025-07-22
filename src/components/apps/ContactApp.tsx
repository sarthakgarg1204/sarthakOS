"use client";

import ThemedBox from "@/components/ui/ThemedBox";
import emailjs from "@emailjs/browser";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ContactApp() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_USER_ID || "");
  }, []);

  const sendMessage = async () => {
    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const subject = subjectRef.current?.value.trim() || "";
    const message = messageRef.current?.value.trim() || "";

    const newErrors = {
      name: name === "",
      email: !email.includes("@"),
      message: message === "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill required fields correctly.");
      return;
    }

    setSending(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
        { name, email, subject, message, time: new Date().toLocaleString() }
      );

      toast.success("Message sent successfully!");
      nameRef.current!.value = "";
      emailRef.current!.value = "";
      subjectRef.current!.value = "";
      messageRef.current!.value = "";
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ThemedBox
      className="w-full h-full flex flex-col text-sm font-sans relative select-none overflow-x-hidden"
      darkClassName="bg-[#1e1e1e] text-white"
      lightClassName="bg-[#f4f4f4] text-black"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-ub-gedit-light text-sm border-b border-black/10 dark:border-white/10">
        <span className="font-semibold text-white">
          📩 Send a Message to Me
        </span>
        <button
          onClick={sendMessage}
          className="px-3 py-1 bg-[#E95420] hover:bg-[#cc4520] text-white border border-[#b13a1b] rounded-md"
        >
          Send
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 relative">
        {/* Fields */}
        {[
          {
            label: "Your Name",
            ref: nameRef,
            line: 1,
            error: errors.name,
            type: "text",
            color: "text-ubt-gedit-blue",
          },
          {
            label: "Your Email",
            ref: emailRef,
            line: 2,
            error: errors.email,
            type: "email",
            color: "text-ubt-gedit-green",
          },
          {
            label: "Subject (optional)",
            ref: subjectRef,
            line: 3,
            error: false,
            type: "text",
            color: "text-ubt-gedit-blue",
          },
        ].map(({ label, ref, line, error, type, color }) => (
          <div className="relative" key={line}>
            <span
              className={`absolute left-1 top-1/2 ml-2 -translate-y-1/2 text-xs font-semibold ${color}`}
            >
              {line}
            </span>
            <input
              ref={ref}
              placeholder={label}
              type={type as never}
              className={`pl-8 w-full py-2 rounded-md bg-white/70 dark:bg-black/20 border border-gray-400 focus:border-[#E95420] outline-none transition-all shadow-sm ${
                error ? "border-red-500 placeholder-red-400" : ""
              }`}
            />
          </div>
        ))}

        {/* Message */}
        <div className="relative max-h-[300px] w-full">
          <span className="absolute left-1 top-1/2 ml-2 -translate-y-1/2 text-xs font-semibold text-ubt-gedit-blue">
            4
          </span>
          <textarea
            ref={messageRef}
            rows={1}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              const maxHeight = 300;
              el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
            }}
            className={clsx(
              "w-full pl-8 pr-4 py-2 rounded-md",
              "bg-white/70 dark:bg-black/20",
              "border border-gray-400 focus:border-[#E95420] outline-none",
              "transition-all shadow-sm text-sm",
              "max-h-[300px] resize-none",
              "overflow-hidden whitespace-pre-wrap break-words",
              "scrollbar-hide",
              errors.message && "border-red-500 placeholder-red-400"
            )}
            placeholder="Your Message . . ." // hide native placeholder
            style={{
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          />
        </div>
      </div>

      {/* Spinner */}
      {sending && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Image
            className="w-8 animate-spin"
            src="/status/process-working-symbolic.svg"
            alt="Sending..."
            width={32}
            height={32}
          />
        </motion.div>
      )}
    </ThemedBox>
  );
}
