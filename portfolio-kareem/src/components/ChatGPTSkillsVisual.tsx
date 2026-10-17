import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

// مسار لوجو OpenAI الأصلي (24x24)
const CHATGPT_SVG_PATH =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813z";

// الإصلاح: أول subpath هو الإطار الخارجي (الـ box الأخضر) فبنشيله.
// بعد الـ z الأولى الـ "m" نسبية للنقطة (22.2819, 9.8211) فبنحوّلها لـ "M" مطلقة (13.2599, 22.4292).
const OUTER_FRAME_END = "zm-9.022 12.6081";
const LOGO_INNER_PATH =
  "M13.2599 22.4292" +
  CHATGPT_SVG_PATH.slice(
    CHATGPT_SVG_PATH.indexOf(OUTER_FRAME_END) + OUTER_FRAME_END.length
  );

interface BranchDef {
  id: string;
  name: string;
  color: string;
  skills: string[];
}

const BRANCHES: BranchDef[] = [
  {
    id: "llms",
    name: "AI & Large Language Models",
    color: "#2dd4bf",
    skills: ["Prompt Eng", "LangChain", "RAG Systems", "Vector DBs", "Transformers", "Streamlit", "Hugging Face"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    color: "#38bdf8",
    skills: ["Scikit-Learn", "Random Forest", "Gradient Boosting", "SVM", "Ensemble", "Cross-Val", "Regression"],
  },
  {
    id: "dl",
    name: "Deep Learning",
    color: "#818cf8",
    skills: ["PyTorch", "TensorFlow", "Neural Nets", "CNNs", "Optimization", "Model Tuning"],
  },
  {
    id: "data",
    name: "Data Science & Analytics",
    color: "#34d399",
    skills: ["Python", "Pandas", "SQL", "NumPy", "EDA", "Feature Eng", "Data Cleaning"],
  },
  {
    id: "design",
    name: "Design & Visualization",
    color: "#fbbf24",
    skills: ["Graphic Design", "Data Viz", "Matplotlib", "Seaborn", "UI Systems", "Infographics"],
  },
  {
    id: "systems",
    name: "Automation & Systems",
    color: "#a78bfa",
    skills: ["Workflow Auto", "n8n", "C++", "Java", "Algorithms", "Git CI/CD", "Linux"],
  },
];

const CX = 400;
const CY = 400;
const R_OUTER = 350;
const R_INNER = 85;

const getSpiralPoint = (branchIndex: number, t: number) => {
  const baseAngleDeg = branchIndex * 60 - 90;
  const angleDeg = baseAngleDeg + 55 * t;
  const angleRad = (angleDeg * Math.PI) / 180;
  const r = R_OUTER - (R_OUTER - R_INNER) * t;

  return {
    x: CX + r * Math.cos(angleRad),
    y: CY + r * Math.sin(angleRad),
  };
};

export const ChatGPTSkillsVisual = () => {
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setOffset((prev) => (prev + delta * 0.12) % 1);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-[800px] mx-auto aspect-square flex items-center justify-center my-6 bg-background border-0 shadow-none ring-0">
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full absolute inset-0 select-none pointer-events-none"
      >
        <defs>
          {/* glow للـ pulses (في الإحداثيات العادية) */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* glow للوجو: القيمة صغيرة لأنها بتتضرب في scale(31.5) */}
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* mask الخطوط الحلزونية (بيشتغل لأنها في الإحداثيات العادية) */}
          <mask id="cutCenterHole">
            <rect width="800" height="800" fill="white" />
            <circle cx="400" cy="400" r="110" fill="black" />
          </mask>
        </defs>

        {/* اللوجو بدون الإطار الخارجي، ومن غير mask (القرص في الآخر هو اللي بيخبّي المنتصف) */}
        <g transform="translate(400, 400) scale(31.5) translate(-12, -12)">
          <path
            d={LOGO_INNER_PATH}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.14"
            strokeOpacity="0.75"
            filter="url(#logoGlow)"
          />
          <path
            d={LOGO_INNER_PATH}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.05"
            strokeOpacity="0.95"
          />
        </g>

        {/* 6 خطوط حلزونية للداخل */}
        {BRANCHES.map((b, i) => {
          const p0 = getSpiralPoint(i, 0);
          const pMid = getSpiralPoint(i, 0.5);
          const p1 = getSpiralPoint(i, 1);
          const pathData = `M ${p0.x} ${p0.y} Q ${pMid.x} ${pMid.y} ${p1.x} ${p1.y}`;
          const pulse = getSpiralPoint(i, (offset * 1.5) % 1);

          return (
            <g key={b.id} mask="url(#cutCenterHole)">
              <path
                d={pathData}
                fill="none"
                stroke={b.color}
                strokeWidth="2"
                strokeOpacity="0.35"
                strokeDasharray="6 8"
              />
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r="3.5"
                fill={b.color}
                filter="url(#neonGlow)"
              />
            </g>
          );
        })}

        {/* قرص المنتصف بلون الـ background */}
        <circle cx={CX} cy={CY} r="110" fill="hsl(var(--background))" />
      </svg>

      {/* المخ في المنتصف */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-background flex items-center justify-center z-30 pointer-events-none border-0 shadow-none">
        <Brain className="h-14 w-14 md:h-18 md:w-18 text-primary relative animate-float" />
      </div>

      {/* بادجات المهارات */}
      <div className="absolute inset-0 pointer-events-none">
        {BRANCHES.map((branch, branchIdx) => {
          const numItems = 3;

          return (
            <div key={branch.id}>
              {Array.from({ length: numItems }).map((_, slotIdx) => {
                const t = (offset + slotIdx / numItems) % 1;
                const skillIndex = (Math.floor(offset * 2) + slotIdx) % branch.skills.length;
                const skillName = branch.skills[skillIndex];
                const pos = getSpiralPoint(branchIdx, t);

                let opacity = 1;
                if (t < 0.15) opacity = t / 0.15;
                else if (t > 0.85) opacity = Math.max(0, (1 - t) / 0.15);

                const scale = 0.88 + 0.15 * Math.sin(t * Math.PI);

                return (
                  <div
                    key={`${branch.id}-${slotIdx}`}
                    className="absolute pointer-events-none transition-transform"
                    style={{
                      left: `${(pos.x / 800) * 100}%`,
                      top: `${(pos.y / 800) * 100}%`,
                      transform: `translate(-50%, -50%) scale(${scale})`,
                      opacity,
                      zIndex: 20,
                    }}
                  >
                    <div
                      className="px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-full border bg-card/85 backdrop-blur-sm flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                      style={{
                        borderColor: `${branch.color}99`,
                        boxShadow: `0 0 10px ${branch.color}33`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="font-mono text-[11px] md:text-xs font-semibold text-foreground tracking-tight">
                        {skillName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};