import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Clock, 
  ChevronDown, 
  Code2, 
  Server, 
  Smartphone, 
  Database, 
  Layout, 
  ShieldCheck, 
  Cloud, 
  TerminalSquare, 
  BrainCircuit,
  Settings2,
  Cpu,
  Layers,
  LineChart,
  Gamepad2,
  Radio,
  Boxes,
  Network,
  Users
} from 'lucide-react';
import { AnimatedContent } from './ui/AnimatedContent';
import { BlurText } from './ui/BlurText';

interface RoleDef {
  name: string;
  shortName: string;
  category: string;
  isCore: boolean;
  desc: string;
  tags: string[];
  duration: string;
  icon: any;
}

const ROLES: RoleDef[] = [
  // --- Software Engineering ---
  {
    name: "Frontend Engineer", shortName: "Frontend", category: "Software Engineering", isCore: true,
    desc: "Build web interfaces, component systems, responsiveness, and performance.",
    tags: ["React", "CSS/UI", "Performance"], duration: "35-40 mins", icon: Layout
  },
  {
    name: "Backend Engineer", shortName: "Backend", category: "Software Engineering", isCore: true,
    desc: "Build APIs, databases, services, authentication, and server logic.",
    tags: ["Node/Go/Python", "SQL", "APIs"], duration: "40-45 mins", icon: Server
  },
  {
    name: "Full Stack Engineer", shortName: "Full Stack", category: "Software Engineering", isCore: true,
    desc: "Build end-to-end web products across frontend and backend.",
    tags: ["Frontend", "Backend", "Databases"], duration: "45-50 mins", icon: Layers
  },
  {
    name: "Mobile App Engineer", shortName: "Mobile", category: "Software Engineering", isCore: true,
    desc: "Build iOS, Android, or cross-platform mobile applications.",
    tags: ["React Native", "iOS/Android", "UI"], duration: "40 mins", icon: Smartphone
  },
  {
    name: "QA / Test Engineer", shortName: "QA", category: "Software Engineering", isCore: true,
    desc: "Test product quality, write test cases, automation, and bug workflows.",
    tags: ["Testing", "Automation", "Cypress"], duration: "30-35 mins", icon: TerminalSquare
  },

  // --- Cloud, Infra & Security ---
  {
    name: "DevOps / Cloud Engineer", shortName: "DevOps", category: "Cloud, Infra & Security", isCore: true,
    desc: "Work with deployment, CI/CD, cloud infrastructure, and environments.",
    tags: ["AWS/GCP", "Docker", "CI/CD"], duration: "40-45 mins", icon: Cloud
  },
  {
    name: "Cybersecurity Engineer", shortName: "Security", category: "Cloud, Infra & Security", isCore: true,
    desc: "Work on security basics, vulnerabilities, monitoring, and safe systems.",
    tags: ["AppSec", "Network", "Audits"], duration: "40 mins", icon: ShieldCheck
  },
  {
    name: "Site Reliability Engineer", shortName: "SRE", category: "Cloud, Infra & Security", isCore: false,
    desc: "Ensure system availability, performance, and incident response.",
    tags: ["Monitoring", "Linux", "Scaling"], duration: "45 mins", icon: Settings2
  },
  {
    name: "Platform Engineer", shortName: "Platform", category: "Cloud, Infra & Security", isCore: false,
    desc: "Build internal developer platforms and standardized toolchains.",
    tags: ["Kubernetes", "Infra", "Tooling"], duration: "45 mins", icon: Boxes
  },
  {
    name: "Security Analyst", shortName: "Security", category: "Cloud, Infra & Security", isCore: false,
    desc: "Analyze threats, handle incidents, and review security logs.",
    tags: ["Threat Intel", "SIEM", "Analysis"], duration: "35 mins", icon: ShieldCheck
  },
  {
    name: "Network Engineer", shortName: "Network", category: "Cloud, Infra & Security", isCore: false,
    desc: "Design, implement, and manage computer networks and connectivity.",
    tags: ["Routing", "Protocols", "Firewalls"], duration: "40 mins", icon: Network
  },
  {
    name: "Cloud Infrastructure Engineer", shortName: "Cloud Infra", category: "Cloud, Infra & Security", isCore: false,
    desc: "Design and maintain scalable cloud architecture and services.",
    tags: ["Terraform", "AWS/Azure", "Arch"], duration: "45 mins", icon: Cloud
  },

  // --- Data & AI ---
  {
    name: "Data Analyst", shortName: "Data Analyst", category: "Data & AI", isCore: true,
    desc: "Analyze data, dashboards, SQL, reporting, and business insights.",
    tags: ["SQL", "Tableau/BI", "Analytics"], duration: "35 mins", icon: LineChart
  },
  {
    name: "Data Engineer", shortName: "Data Eng", category: "Data & AI", isCore: true,
    desc: "Build data pipelines, ETL workflows, storage, and data infrastructure.",
    tags: ["Python", "Spark", "Pipelines"], duration: "40-45 mins", icon: Database
  },
  {
    name: "AI / ML Engineer", shortName: "AI/ML", category: "Data & AI", isCore: true,
    desc: "Work with models, training pipelines, evaluation, and applied ML systems.",
    tags: ["Python", "PyTorch", "Models"], duration: "45-50 mins", icon: BrainCircuit
  },
  {
    name: "MLOps Engineer", shortName: "MLOps", category: "Data & AI", isCore: false,
    desc: "Deploy, scale, and monitor machine learning models in production.",
    tags: ["Deployment", "ML Flow", "Infra"], duration: "40 mins", icon: Settings2
  },
  {
    name: "Business Intelligence Analyst", shortName: "BI Analyst", category: "Data & AI", isCore: false,
    desc: "Transform data into actionable business strategies and dashboards.",
    tags: ["BI Tools", "Strategy", "SQL"], duration: "35 mins", icon: LineChart
  },
  {
    name: "Research Engineer", shortName: "Research", category: "Data & AI", isCore: false,
    desc: "Conduct advanced technical research and prototype new algorithms.",
    tags: ["Research", "Math", "Prototyping"], duration: "50 mins", icon: BrainCircuit
  },

  // --- Design & Product ---
  {
    name: "UI / UX Designer", shortName: "UI/UX", category: "Design & Product", isCore: true,
    desc: "Design product flows, interfaces, usability, and interaction patterns.",
    tags: ["Figma", "Usability", "Wireframes"], duration: "35-40 mins", icon: Layout
  },
  {
    name: "Product Designer", shortName: "Product Design", category: "Design & Product", isCore: true,
    desc: "Own end-to-end product design from problem framing to polished UI.",
    tags: ["Systems", "Research", "UI"], duration: "40 mins", icon: Layout
  },
  {
    name: "Associate Product Manager", shortName: "APM", category: "Design & Product", isCore: true,
    desc: "Work on product thinking, prioritization, user problems, and execution.",
    tags: ["Strategy", "Agile", "Roadmaps"], duration: "35-40 mins", icon: Users
  },
  {
    name: "Technical Program Manager", shortName: "TPM", category: "Design & Product", isCore: false,
    desc: "Lead cross-functional technical programs and complex delivery.",
    tags: ["Planning", "Delivery", "Scope"], duration: "40 mins", icon: Boxes
  },

  // --- Specialized Engineering ---
  {
    name: "Technical Support / Solutions Engineer", shortName: "Solutions", category: "Specialized Engineering", isCore: true,
    desc: "Solve technical customer problems and bridge product with implementation.",
    tags: ["Support", "Debugging", "APIs"], duration: "30-35 mins", icon: Code2
  },
  {
    name: "Embedded Systems Engineer", shortName: "Embedded", category: "Specialized Engineering", isCore: false,
    desc: "Develop software running on specialized hardware and microcontrollers.",
    tags: ["C/C++", "Hardware", "RTOS"], duration: "45 mins", icon: Cpu
  },
  {
    name: "IoT Engineer", shortName: "IoT", category: "Specialized Engineering", isCore: false,
    desc: "Build connected device networks and sensor data systems.",
    tags: ["Sensors", "MQTT", "Hardware"], duration: "40 mins", icon: Radio
  },
  {
    name: "Game Developer", shortName: "Game Dev", category: "Specialized Engineering", isCore: false,
    desc: "Develop interactive gaming experiences and gameplay logic.",
    tags: ["Unity/Unreal", "C#", "Physics"], duration: "45 mins", icon: Gamepad2
  },
  {
    name: "AR / VR Engineer", shortName: "AR/VR", category: "Specialized Engineering", isCore: false,
    desc: "Build immersive augmented and virtual reality applications.",
    tags: ["3D Math", "XR", "Unity"], duration: "45 mins", icon: Box
  },
  {
    name: "Developer Relations Engineer", shortName: "DevRel", category: "Specialized Engineering", isCore: false,
    desc: "Empower external developers through docs, SDKs, and community.",
    tags: ["SDKs", "Advocacy", "Docs"], duration: "35 mins", icon: Users
  },
  {
    name: "Systems Engineer", shortName: "Systems", category: "Specialized Engineering", isCore: false,
    desc: "Design and manage complex, high-scale operating system environments.",
    tags: ["Linux/Unix", "Kernels", "Arch"], duration: "45 mins", icon: Server
  },
  {
    name: "Blockchain / Web3 Engineer", shortName: "Web3", category: "Specialized Engineering", isCore: false,
    desc: "Build decentralized applications, smart contracts, and protocols.",
    tags: ["Solidity", "Crypto", "Smart Cont."], duration: "45 mins", icon: Boxes
  }
];

const CATEGORIES = [
  "Software Engineering",
  "Cloud, Infra & Security",
  "Data & AI",
  "Design & Product",
  "Specialized Engineering"
];

// Helper to provide fallback icon if Box doesn't load
function Box(props: any) {
  return <Boxes {...props} />;
}

export function ChoosePathScreen() {
  const navigate = useNavigate();
  const [showAllRoles, setShowAllRoles] = useState(false);

  const handleStartInterview = (roleName: string) => {
    // Navigate to the pre-interview step, perhaps passing the selected role
    navigate('/pre-interview');
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F2F0] relative font-[Inter,sans-serif] selection:bg-[#3E63F5] selection:text-white pb-24">
      {/* Global CSS for background textures */}
      <style>{`
        .noise-overlay {
          position: fixed;
          inset: 0;
          opacity: 0.25;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .dot-grid {
          position: fixed;
          inset: 0;
          background-size: 24px 24px;
          background-image: radial-gradient(circle at 1px 1px, rgba(31,36,48,0.06) 1px, transparent 0);
          pointer-events: none;
          z-index: 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 12px 40px rgba(30, 35, 60, 0.04);
        }
      `}</style>

      {/* Ambient Background Washes */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#E3E8F8] rounded-full mix-blend-multiply blur-[120px] opacity-70 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#F4EBE3] rounded-full mix-blend-multiply blur-[120px] opacity-60 pointer-events-none" />
      
      {/* Texture Layers */}
      <div className="dot-grid pointer-events-none" />
      <div className="noise-overlay pointer-events-none" />

      {/* Top Nav (Minimal) */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto p-6 md:p-8 flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-[#3E63F5] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif]">P</div>
          <span className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430] tracking-tight">PlacedOn</span>
        </div>
        <button 
          onClick={() => navigate('/candidate')} 
          className="text-[#1F2430]/60 hover:text-[#1F2430] transition-colors font-medium text-[14px]"
        >
          Cancel
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8">
        <AnimatedContent delay={0.1} direction="vertical" className="mb-12">
          <h1 className="font-[Manrope,sans-serif] text-[32px] md:text-[44px] font-extrabold text-[#1F2430] tracking-tight leading-tight mb-4">
            <BlurText text="Choose your interview path" delay={0.03} />
          </h1>
          <p className="text-[18px] text-[#1F2430]/60 font-medium max-w-2xl">
            Select your target role to begin an adaptive AI interview. No resume required. Each path evaluates real architecture and problem-solving.
          </p>
        </AnimatedContent>

        <div className="space-y-16">
          {CATEGORIES.map((category, catIndex) => {
            const categoryRoles = ROLES.filter(r => r.category === category && (showAllRoles || r.isCore));
            
            if (categoryRoles.length === 0) return null;

            return (
              <motion.section 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * catIndex }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430] whitespace-nowrap">{category}</h2>
                  <div className="h-px bg-[#1F2430]/10 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {categoryRoles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={role.name}
                          className="glass-card rounded-[1.5rem] p-6 lg:p-7 flex flex-col h-full group hover:bg-white/70 transition-colors border-white/80 hover:border-white shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-start mb-5">
                            <div className="w-12 h-12 rounded-xl bg-[#3E63F5]/10 flex items-center justify-center text-[#3E63F5] border border-[#3E63F5]/20 shadow-inner group-hover:scale-105 transition-transform">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 text-[#1F2430]/60 text-[12px] font-bold bg-white/60 px-2.5 py-1.5 rounded-lg border border-white/40 shadow-sm">
                              <Clock className="w-3.5 h-3.5 text-[#10B981]" /> 
                              {role.duration}
                            </div>
                          </div>
                          
                          <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-2">
                            {role.name}
                          </h3>
                          <p className="text-[14px] text-[#1F2430]/70 mb-5 leading-relaxed min-h-[42px] font-medium">
                            {role.desc}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-8">
                            {role.tags.map(tag => (
                              <span key={tag} className="text-[12px] font-bold text-[#1F2430]/60 bg-[#1F2430]/5 px-2.5 py-1 rounded-md border border-[#1F2430]/5">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-auto pt-6">
                            <button 
                              onClick={() => handleStartInterview(role.name)}
                              className="w-full py-3.5 rounded-xl bg-[#3E63F5]/10 text-[#3E63F5] font-bold text-[14px] hover:bg-[#3E63F5] hover:text-white transition-all flex items-center justify-center gap-2 group/btn border border-[#3E63F5]/20 hover:border-[#3E63F5] hover:shadow-[0_4px_20px_rgba(62,99,245,0.3)]"
                            >
                              Start {role.shortName} Interview 
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* View All Roles Toggle */}
        <div className="mt-16 flex justify-center pb-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAllRoles(!showAllRoles)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#1F2430]/10 text-[#1F2430] font-bold text-[14px] shadow-sm hover:shadow-md transition-all hover:bg-gray-50"
          >
            {showAllRoles ? "Hide Specialized Roles" : "View All Roles"}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllRoles ? "rotate-180" : ""}`} />
          </motion.button>
        </div>
      </main>
    </div>
  );
}
