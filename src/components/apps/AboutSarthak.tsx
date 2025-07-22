'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Code2,
    FileText,
    Rocket,
    User
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Section = 'about' | 'education' | 'skills' | 'projects' | 'resume';

const sections: { id: Section; label: string; icon: JSX.Element }[] = [
  { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Code2 className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <Rocket className="w-4 h-4" /> },
  { id: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" /> },
];

const AboutSarthak = () => {
  const [activeSection, setActiveSection] = useState<Section>('about');

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="w-full flex flex-col items-center justify-start py-6 px-4 md:px-8 text-white select-none">
            <div className="w-24 md:w-28 mb-4 rounded-full bg-white p-1 shadow-md">
              <Image src="/images/logos/bitmoji.png" alt="Sarthak Avatar" width={112} height={112} className="w-full rounded-full" />
            </div>
            <div className="text-center text-lg md:text-2xl leading-tight pt-6">
              <div>
                my name is <span className="font-bold text-white">Sarthak Garg</span>,
              </div>
              <div>
                I&apos;m a <span className="text-pink-500 font-bold">Full Stack Developer & AI/ML Engineer</span>
              </div>
            </div>
            <div className="relative mt-4 mb-6 w-32 md:w-48 h-0.5 bg-white">
              <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full" />
              <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="grid gap-4 w-full md:w-5/6">
              <div className="px-4 bg-opacity-5 backdrop-blur-sm rounded-md transition-all hover:border-white/30">
                <div className="flex items-start gap-3">
                  <span className="text-amber-300 text-xl">🎓</span>
                  <p className="text-sm md:text-base leading-relaxed">
                    I&apos;m a <strong>Computer Science undergrad</strong> at JMIT (Batch 2026), passionate about building intelligent systems and impactful digital experiences.
                  </p>
                </div>
              </div>
              <div className="px-4 bg-opacity-5 backdrop-blur-sm rounded-md transition-all hover:border-white/30">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">🏆</span>
                  <p className="text-sm md:text-base leading-relaxed">
                    As the <strong>National Winner of Smart India Hackathon 2024</strong>, I built{' '}
                    <a href="https://github.com/sarthakgarg1204/carbon-nigrani" target="_blank" className="underline text-blue-400">Carbon Nigrani</a>.
                  </p>
                </div>
              </div>
              <div className="px-4 bg-opacity-5 backdrop-blur-sm rounded-md transition-all hover:border-white/30">
                <div className="flex items-start gap-3">
                  <span className="text-teal-300 text-xl">🧠</span>
                  <p className="text-sm md:text-base leading-relaxed">
                    I developed <a href="https://kropgenie.streamlit.app" target="_blank" className="underline text-blue-400">CropGenie</a> — a real-time AI recommender system.
                  </p>
                </div>
              </div>
              <div className="px-4 bg-opacity-5 backdrop-blur-sm rounded-md transition-all hover:border-white/30">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">💻</span>
                  <p className="text-sm md:text-base leading-relaxed">
                    I specialize in <strong>MERN, TypeScript, scalable APIs</strong>, and production AI integration with Flask & Scikit-learn.
                  </p>
                </div>
              </div>
              <div className="px-4 bg-opacity-5 backdrop-blur-sm rounded-md transition-all hover:border-white/30">
                <div className="flex items-start gap-3">
                  <span className="text-pink-300 text-xl">🚀</span>
                  <p className="text-sm md:text-base leading-relaxed">
                    I believe in learning fast, building fast, and solving with empathy.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-300 text-center">
              📍 Karnal, Haryana, India <br />
              🔗{' '}
              <a href="mailto:sarthakgarg7124@gmail.com" className="underline text-blue-400">Email</a> •{' '}
              <a href="https://linkedin.com/in/sarthakgarg1204" target="_blank" className="underline text-blue-400">LinkedIn</a> •{' '}
              <a href="https://github.com/sarthakgarg1204" target="_blank" className="underline text-blue-400">GitHub</a> •{' '}
              <a href="https://sarthakgarg1204.github.io" target="_blank" className="underline text-blue-400">Portfolio</a>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6 w-full md:w-4/5 mx-auto text-sm md:text-base">
           <div className="flex flex-col items-center justify-center w-full my-4">
  {/* Heading */}
  <h2 className="text-lg md:text-xl font-semibold text-primary flex items-center gap-2">
    Education
  </h2>

  {/* Decorative Line */}
  <div className="relative mt-2 w-32 md:w-48 h-0.5 bg-white/40">
    <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full" />
    <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full" />
  </div>
</div>

            {[
              {
                level: 'B.Tech in Computer Science',
                school: 'JMIT, Radaur',
                years: '2022 – 2026',
                cgpa: '7.49 / 10',
                desc: 'Relevant Coursework: DSA, OS, DBMS, CN, AI/ML, OOPs'
              },
              {
                level: 'Senior Secondary (Class 12th)',
                school: 'Narsingh Dass Public School, Taraori, Karnal – CBSE',
                years: '2021 – 2022',
                percentage: '82%',
                stream: 'PCM'
              },
              {
                level: 'Secondary (Class 10th)',
                school: 'Narsingh Dass Public School, Taraori, Karnal – CBSE',
                years: '2019 – 2020',
                percentage: '92%'
              }
            ].map((edu, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-md p-4 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white">{edu.level}</h3>
                    <p className="text-gray-300">{edu.school}</p>
                  </div>
                  <span className="text-gray-400 text-sm mt-2 md:mt-0">{edu.years}</span>
                </div>
                <div className="mt-2 text-gray-300">
                  {edu.cgpa && <p><strong>CGPA:</strong> {edu.cgpa}</p>}
                  {edu.percentage && <p><strong>Percentage:</strong> {edu.percentage}</p>}
                  {edu.stream && <p><strong>Stream:</strong> {edu.stream}</p>}
                  {edu.desc && <p className="mt-1">{edu.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        );
    case 'skills':
  return (
    <div className="w-full flex flex-col items-center text-white py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl font-semibold text-primary flex items-center gap-2">
          🛠️ Skills
        </h2>
        <div className="relative mt-2 w-32 md:w-48 h-0.5 bg-white/40">
          <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full" />
          <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Intro */}
      <ul className="tracking-tight text-sm md:text-base w-11/12 text-center text-gray-300 space-y-3">
        <li>
          I’ve worked with a variety of languages, tools, and frameworks to build scalable, intelligent, and visually polished applications.
        </li>
        <li>
          My areas of expertise include <span className="text-amber-300 font-semibold">Full Stack Development</span> and <span className="text-teal-400 font-semibold">AI/ML Engineering</span>.
        </li>
      </ul>

      {/* Categories */}
      <div className="w-full md:w-5/6 flex flex-col md:flex-row justify-center items-start gap-8">
        {/* Languages & Tools */}
        <div className="w-full md:w-1/2 text-center">
          <h3 className="font-semibold mb-3 text-lg text-white">Languages & Tools</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "JavaScript-F7DF1C?logo=javascript&logoColor=000",
              "TypeScript-3178C6?logo=typescript&logoColor=white",
              "C++-00599C?logo=c%2B%2B&logoColor=white",
              "Python-3776AB?logo=python&logoColor=white",
              "HTML5-E34F26?logo=html5&logoColor=white",
              "CSS3-1572B6?logo=css3&logoColor=white",
              "Git-F05032?logo=git&logoColor=white",
              "Linux-FCC624?logo=linux&logoColor=000",
              "Firebase-FFCA28?logo=firebase&logoColor=white"
            ].map((badge, i) => (
              <img
                key={i}
                src={`https://img.shields.io/badge/${badge}&style=flat`}
                alt="badge"
                className="h-7 m-1"
              />
            ))}
          </div>
        </div>

        {/* Frameworks & Libraries */}
        <div className="w-full md:w-1/2 text-center">
          <h3 className="font-semibold mb-3 text-lg text-white">Frameworks & Libraries</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "React-61DAFB?logo=react&logoColor=black",
              "Next.js-000000?logo=nextdotjs&logoColor=white",
              "Node.js-339933?logo=node.js&logoColor=white",
              "Express-000000?logo=express&logoColor=white",
              "MongoDB-47A248?logo=mongodb&logoColor=white",
              "TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white",
              "Framer_Motion-EF008F?logo=framer&logoColor=white",
              "Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white",
              "Flask-000000?logo=flask&logoColor=white"
            ].map((badge, i) => (
              <img
                key={i}
                src={`https://img.shields.io/badge/${badge}&style=flat`}
                alt="badge"
                className="h-7 m-1"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

case 'projects':
  return (
    <div className="w-full flex flex-col items-center text-white py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl font-semibold text-primary flex items-center gap-2">
          🚀 Projects
        </h2>
        <div className="relative mt-2 w-32 md:w-48 h-0.5 bg-white/40">
          <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full" />
          <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-5/6">
        {[
          {
            title: "🖥️ Ubuntu Web OS Simulation",
            description:
              "A full Ubuntu-inspired web OS with draggable windows, theme toggle, dynamic state handling and animations.",
            tech: "Next.js, Tailwind CSS, Framer Motion, TypeScript",
            link: "https://sarthak-os.vercel.app",
            repo: "https://github.com/sarthakgarg1204/sarthakOS",
          },
          {
            title: "🏭 Carbon Nigrani",
            description:
              "Smart India Hackathon 2024 Winning Project – Real-time carbon emission tracker for Indian coal mines.",
            tech: "MERN Stack, Flask, Python, MQTT",
            link: null,
            repo: "https://github.com/sarthakgarg1204/carbon-nigrani",
          },
          {
            title: "🌾 KropGenie",
            description:
              "AI-based live crop & fertilizer recommender system built using scikit-learn and deployed on Streamlit.",
            tech: "Python, Pandas, Scikit-learn, Streamlit",
            link: "https://kropgenie.streamlit.app",
            repo: "https://github.com/sarthakgarg1204/CropGenie",
          },
          {
            title: "❌⭕ AI Tic Tac Toe",
            description:
              "A Minimax-powered unbeatable Tic Tac Toe game with intuitive UI and game logic.",
            tech: "React.js, TypeScript, Minimax",
            link: "https://sarthakgarg1204.github.io/Codsoft/Tic-Tac-Toe-AI/",
            repo: "https://github.com/sarthakgarg1204/Codsoft/Tic-Tac-Toe-AI/",
          },
        ].map((project, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-white/20 hover:shadow-lg transition-all flex flex-col justify-between space-y-3"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {project.title}
            </h3>
            <p className="text-gray-300">{project.description}</p>
            <p className="text-sm text-gray-400">Tech: {project.tech}</p>
            <div className="flex gap-4 mt-1">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm hover:text-blue-300"
                >
                  {project.title.includes("Tic Tac Toe") ? "Play Now ↗" : "View Live ↗"}
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline text-sm hover:text-green-300"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );




      case 'resume':
  return (
    <div className="flex flex-col items-center justify-start space-y-6 w-full h-full">
      {/* Action Buttons */}
      <div className="flex gap-4 text-sm">
        <a
          href="/Sarthak_Resume.pdf"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          Download PDF
        </a>
        <a
          href="/Sarthak_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
        >
          <FileText className="w-4 h-4" />
          Open in New Tab
        </a>
      </div>

      {/* Preview Box */}
      <div className="w-full max-w-4xl aspect-[1/1.414] border border-white/10 rounded-md overflow-hidden shadow-lg bg-white dark:bg-zinc-900">
        <iframe
          src="/Sarthak_Resume.pdf"
          title="Sarthak Resume Preview"
          className="w-full h-full"
        />
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-background text-foreground flex rounded-md overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col gap-1 p-3 min-w-[160px] border-r border-muted bg-muted text-sm font-medium">
        {sections.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded hover:bg-accent transition text-left',
              activeSection === id ? 'bg-primary text-white' : ''
            )}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-sm leading-relaxed"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AboutSarthak;
