import { useState, type ComponentType, type CSSProperties } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

/* ------------------------------------------------------------------ */
/*  Motion + animation styles (scoped by the pv- prefix)               */
/* ------------------------------------------------------------------ */
const CSS = `
.pv-grow{transform-box:fill-box;transform-origin:bottom;animation:pv-grow 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes pv-grow{from{transform:scaleY(0)}}
.pv-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:pv-draw 1.6s .5s ease forwards}
@keyframes pv-draw{to{stroke-dashoffset:0}}
.pv-float{animation:pv-float 4s ease-in-out infinite alternate}
@keyframes pv-float{to{transform:translate(5px,-6px)}}
.pv-pulse{transform-box:fill-box;transform-origin:center;animation:pv-pulse 2.4s ease-in-out infinite}
@keyframes pv-pulse{50%{transform:scale(1.4);opacity:.3}}
.pv-dash{stroke-dasharray:6 6;animation:pv-dash 1s linear infinite}
@keyframes pv-dash{to{stroke-dashoffset:-12}}
.pv-sweep{animation:pv-sweep 3.6s ease-in-out infinite alternate}
@keyframes pv-sweep{to{transform:translateX(216px)}}
.pv-flip{transform-box:fill-box;transform-origin:center;animation:pv-flip 3.6s ease-in-out infinite}
@keyframes pv-flip{0%,40%{fill:var(--a);transform:scaleX(1)}50%{transform:scaleX(.05)}60%,90%{fill:var(--b);transform:scaleX(1)}100%{fill:var(--a);transform:scaleX(1)}}
.pv-scan{animation:pv-scan 2.6s ease-in-out infinite alternate}
@keyframes pv-scan{to{transform:translateY(172px)}}
.pv-pop{animation:pv-pop .6s cubic-bezier(.2,.8,.2,1) both}
@keyframes pv-pop{from{opacity:0;transform:translateX(-10px)}}
.pv-ring{animation:pv-ring 1.6s .2s cubic-bezier(.2,.8,.2,1) both}
@keyframes pv-ring{from{stroke-dashoffset:352}}
.pv-bar{transform-origin:left;animation:pv-bar var(--d) linear forwards}
@keyframes pv-bar{from{transform:scaleX(0)}}
.pv-in{animation:pv-in .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes pv-in{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion:reduce){
  .pv-viz *,.pv-bar,.pv-in{animation:none!important}
  .pv-draw{stroke-dashoffset:0!important}
}
`;

/* ------------------------------------------------------------------ */
/*  Live visuals: one small animated scene per project                 */
/* ------------------------------------------------------------------ */
interface VizProps {
  c: string;
}

const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const svgProps = { viewBox: "0 0 400 220", className: "h-full w-full" } as const;

// Bank campaign: bars + conversion trend
const BankViz = ({ c }: VizProps) => {
  const vals = [38, 52, 44, 68, 60, 86, 74, 104];
  return (
    <svg {...svgProps}>
      {vals.map((v, i) => (
        <rect
          key={i}
          x={40 + i * 42}
          y={190 - v * 1.4}
          width="26"
          height={v * 1.4}
          rx="5"
          fill={c}
          fillOpacity={0.22 + i * 0.07}
          className="pv-grow"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
      <polyline
        points={vals.map((v, i) => `${53 + i * 42},${178 - v * 1.4}`).join(" ")}
        fill="none"
        stroke={c}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="pv-draw"
      />
    </svg>
  );
};

// Clustering: three groups, noise points, pulsing centroids
const ClusterViz = ({ c }: VizProps) => {
  const rand = seeded(11);
  const groups = [
    { x: 105, y: 85, k: c },
    { x: 285, y: 75, k: "#38bdf8" },
    { x: 205, y: 160, k: "#fbbf24" },
  ];
  const noise = [[40, 170], [350, 160], [190, 35], [60, 40], [345, 25]];
  return (
    <svg {...svgProps}>
      {noise.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" fillOpacity="0.35" />
      ))}
      {groups.map((g, gi) => (
        <g key={gi}>
          {Array.from({ length: 18 }).map((_, i) => {
            const a = rand() * Math.PI * 2;
            const r = 8 + rand() * 40;
            return (
              <circle
                key={i}
                cx={g.x + Math.cos(a) * r}
                cy={g.y + Math.sin(a) * r * 0.8}
                r={2.6 + rand() * 1.6}
                fill={g.k}
                fillOpacity="0.8"
                className="pv-float"
                style={{ animationDelay: `${-rand() * 4}s` }}
              />
            );
          })}
          <circle cx={g.x} cy={g.y} r="7" fill="none" stroke={g.k} strokeWidth="2" className="pv-pulse" />
          <circle cx={g.x} cy={g.y} r="2.5" fill={g.k} />
        </g>
      ))}
    </svg>
  );
};

// Factory system: roles on top, workflow pipeline below
const FactoryViz = ({ c }: VizProps) => (
  <svg {...svgProps}>
    {["Admin", "Manager", "Employee"].map((r, i) => (
      <g key={r}>
        <rect x={84 + i * 84} y="24" width="64" height="22" rx="11" fill={c} fillOpacity="0.12" stroke={c} strokeOpacity="0.6" />
        <text x={116 + i * 84} y="39" textAnchor="middle" fontSize="10" className="font-mono text-foreground" fill="currentColor">
          {r}
        </text>
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <line key={i} x1={81 + i * 97} y1="115" x2={126 + i * 97} y2="115" stroke={c} strokeWidth="2" className="pv-dash" />
    ))}
    {["Orders", "Inventory", "Production", "Reports"].map((l, i) => (
      <g key={l}>
        <circle cx={55 + i * 97} cy="115" r="26" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="2" />
        <circle cx={55 + i * 97} cy="115" r="6" fill={c} className="pv-pulse" style={{ animationDelay: `${i * 300}ms` }} />
        <text x={55 + i * 97} y="165" textAnchor="middle" fontSize="11" fill="currentColor" className="font-mono">
          {l}
        </text>
      </g>
    ))}
  </svg>
);

// Image processing: pixel grid with a sliding 3x3 kernel
const ImageViz = ({ c }: VizProps) => {
  const rand = seeded(5);
  return (
    <svg {...svgProps}>
      {Array.from({ length: 72 }).map((_, i) => (
        <rect
          key={i}
          x={56 + (i % 12) * 24}
          y={38 + Math.floor(i / 12) * 24}
          width="22"
          height="22"
          rx="3"
          fill={c}
          fillOpacity={0.08 + rand() * 0.5}
        />
      ))}
      <g className="pv-sweep">
        <rect x="56" y="62" width="72" height="72" rx="6" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="2" />
      </g>
      <text x="200" y="205" textAnchor="middle" fontSize="11" fill="currentColor" className="font-mono">
        3×3 kernel
      </text>
    </svg>
  );
};

// Othello: board where discs keep flipping
const OthelloViz = ({ c }: VizProps) => {
  const dark = "hsl(var(--background))";
  const discs: [number, number, number][] = [
    [2, 2, 1], [2, 3, 0], [3, 2, 0], [3, 3, 1], [1, 2, 0],
    [2, 4, 1], [4, 3, 1], [3, 4, 0], [1, 3, 1], [4, 2, 0],
  ];
  return (
    <svg {...svgProps}>
      <rect x="110" y="20" width="180" height="180" rx="10" fill={c} fillOpacity="0.07" stroke={c} strokeOpacity="0.5" />
      {[1, 2, 3, 4, 5].map((i) => (
        <g key={i} stroke={c} strokeOpacity="0.2">
          <line x1={110 + i * 30} y1="20" x2={110 + i * 30} y2="200" />
          <line x1="110" y1={20 + i * 30} x2="290" y2={20 + i * 30} />
        </g>
      ))}
      {discs.map(([row, col, d], i) => {
        const a = d ? dark : c;
        const b = d ? c : dark;
        return (
          <circle
            key={i}
            cx={125 + col * 30}
            cy={35 + row * 30}
            r="11"
            fill={a}
            stroke={c}
            strokeWidth="1.5"
            className="pv-flip"
            style={{ "--a": a, "--b": b, animationDelay: `${i * 380}ms` } as CSSProperties}
          />
        );
      })}
    </svg>
  );
};

// O&A: invoice being scanned, fields extracted
const InvoiceViz = ({ c }: VizProps) => (
  <svg {...svgProps}>
    <rect x="90" y="20" width="130" height="180" rx="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.4" />
    <rect x="106" y="36" width="48" height="10" rx="3" fill={c} fillOpacity="0.6" />
    {[80, 104, 60, 96, 70, 88].map((w, i) => (
      <rect key={i} x="106" y={62 + i * 20} width={w} height="6" rx="3" fill="currentColor" fillOpacity="0.25" />
    ))}
    <rect x="90" y="20" width="130" height="3" fill={c} className="pv-scan" />
    {["Total", "Tax", "Date"].map((l, i) => (
      <g key={l} className="pv-pop" style={{ animationDelay: `${400 + i * 300}ms` }}>
        <line x1="220" y1={64 + i * 42} x2="244" y2={64 + i * 42} stroke={c} strokeOpacity="0.6" strokeDasharray="3 3" />
        <rect x="244" y={50 + i * 42} width="100" height="28" rx="14" fill={c} fillOpacity="0.12" stroke={c} strokeOpacity="0.7" />
        <text x="294" y={68 + i * 42} textAnchor="middle" fontSize="11" fill="currentColor" className="font-mono text-foreground">
          {l}
        </text>
      </g>
    ))}
  </svg>
);

// Super CV: ATS score ring + chat copilot
const CVViz = ({ c }: VizProps) => (
  <svg {...svgProps}>
    <circle cx="120" cy="110" r="56" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" />
    <circle
      cx="120"
      cy="110"
      r="56"
      fill="none"
      stroke={c}
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray="352"
      strokeDashoffset="35"
      transform="rotate(-90 120 110)"
      className="pv-ring"
    />
    <text x="120" y="120" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor" className="text-foreground">
      92
    </text>
    <text x="120" y="140" textAnchor="middle" fontSize="10" fill="currentColor" className="font-mono">
      ATS match
    </text>
    {[150, 120, 160].map((w, i) => (
      <g key={i} className="pv-pop" style={{ animationDelay: `${500 + i * 350}ms` }}>
        <rect x="210" y={52 + i * 44} width={w} height="30" rx="15" fill={i === 1 ? "currentColor" : c} fillOpacity={i === 1 ? 0.1 : 0.2} />
        <rect x="226" y={64 + i * 44} width={w - 42} height="6" rx="3" fill="currentColor" fillOpacity="0.4" />
      </g>
    ))}
  </svg>
);

// Waste Detection: Object detection bounding boxes with labels and metric
const WasteViz = ({ c }: VizProps) => {
  const boxes = [
    { x: 45, y: 42, w: 90, h: 108, label: "Plastic", conf: "94%" },
    { x: 155, y: 65, w: 105, h: 85, label: "Metal", conf: "91%" },
    { x: 280, y: 38, w: 80, h: 112, label: "Glass", conf: "96%" },
  ];

  return (
    <svg {...svgProps}>
      {/* Conveyor / Surface line */}
      <line x1="30" y1="182" x2="370" y2="182" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" />

      {/* Target Reticle / Bounding boxes */}
      {boxes.map((b, i) => (
        <g key={b.label} className="pv-pop" style={{ animationDelay: `${i * 220}ms` }}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="6"
            fill={c}
            fillOpacity="0.08"
            stroke={c}
            strokeWidth="1.8"
          />
          {/* Tech corner brackets */}
          <path
            d={`M ${b.x} ${b.y + 10} V ${b.y} H ${b.x + 10} M ${b.x + b.w - 10} ${b.y} H ${b.x + b.w} V ${b.y + 10} M ${b.x} ${b.y + b.h - 10} V ${b.y + b.h} H ${b.x + 10} M ${b.x + b.w - 10} ${b.y + b.h} H ${b.x + b.w} V ${b.y + b.h - 10}`}
            stroke={c}
            strokeWidth="2.4"
            fill="none"
          />
          {/* Label tag */}
          <rect x={b.x} y={b.y - 18} width={b.w * 0.82} height="18" rx="4" fill={c} />
          <text
            x={b.x + 6}
            y={b.y - 5}
            fontSize="9.5"
            fontWeight="bold"
            fill="#0b0d14"
            className="font-mono"
          >
            {b.label} {b.conf}
          </text>
        </g>
      ))}

      {/* 90% mAP50 Highlight Pill */}
      <g className="pv-pop" style={{ animationDelay: "650ms" }}>
        <rect x="142" y="168" width="116" height="26" rx="13" fill={c} fillOpacity="0.16" stroke={c} strokeWidth="1.2" />
        <text x="200" y="185" textAnchor="middle" fontSize="11" fontWeight="700" fill={c} className="font-mono">
          90% mAP50
        </text>
      </g>
    </svg>
  );
};

// Public Health Chatbot: Verified assistant with WHO/CDC sources
const HealthViz = ({ c }: VizProps) => (
  <svg {...svgProps}>
    {/* Shield / Medical Cross Emblem */}
    <g transform="translate(50, 42)">
      <circle cx="28" cy="28" r="26" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1.8" />
      <rect x="25" y="14" width="6" height="28" rx="3" fill={c} />
      <rect x="14" y="25" width="28" height="6" rx="3" fill={c} />
      <circle cx="28" cy="28" r="33" fill="none" stroke={c} strokeWidth="1" className="pv-pulse" />
    </g>

    {/* Message bubble 1 */}
    <g className="pv-pop" style={{ animationDelay: "200ms" }}>
      <rect x="135" y="30" width="220" height="34" rx="12" fill="currentColor" fillOpacity="0.08" />
      <text x="150" y="52" fontSize="11" fill="currentColor" className="text-foreground">
        What are trusted fever care steps?
      </text>
    </g>

    {/* Message bubble 2: Assistant response */}
    <g className="pv-pop" style={{ animationDelay: "450ms" }}>
      <rect x="135" y="74" width="235" height="46" rx="12" fill={c} fillOpacity="0.14" stroke={c} strokeWidth="1.2" />
      <text x="150" y="94" fontSize="11" fill="currentColor" className="text-foreground font-medium">
        Stay hydrated &amp; rest adequately.
      </text>
      <text x="150" y="110" fontSize="9.5" fill={c} className="font-mono">
        Non-diagnostic • Clinical triage protocol
      </text>
    </g>

    {/* Source badges */}
    <g className="pv-pop" style={{ animationDelay: "750ms" }}>
      {[
        { name: "WHO", x: 135 },
        { name: "CDC", x: 195 },
        { name: "MedlinePlus", x: 250 },
      ].map((s) => (
        <g key={s.name}>
          <rect x={s.x} y="136" width={s.name.length * 8.5 + 20} height="20" rx="10" fill={c} fillOpacity="0.1" stroke={c} strokeOpacity="0.5" />
          <text x={s.x + (s.name.length * 8.5 + 20) / 2} y="150" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={c} className="font-mono">
            ✓ {s.name}
          </text>
        </g>
      ))}
    </g>
  </svg>
);

// FIFA 23: Player rating card + attribute weights & regression metric
const FifaViz = ({ c }: VizProps) => {
  const stats = [
    { label: "Potential", val: 92, w: 115 },
    { label: "Value", val: 89, w: 98 },
    { label: "Special", val: 86, w: 90 },
    { label: "Wage", val: 84, w: 82 },
  ];

  return (
    <svg {...svgProps}>
      {/* FIFA Player Card on Left */}
      <g transform="translate(62, 24)" className="pv-pop">
        <path
          d="M 12 0 L 78 0 Q 88 0 88 10 L 88 116 L 48 144 L 8 116 L 8 10 Q 8 0 18 0 Z"
          fill={c}
          fillOpacity="0.1"
          stroke={c}
          strokeWidth="1.8"
        />
        <text x="30" y="38" fontSize="28" fontWeight="800" fill={c} className="font-mono">
          89
        </text>
        <text x="30" y="52" fontSize="11" fontWeight="700" fill="currentColor" className="font-mono text-muted-foreground">
          OVR
        </text>
        <line x1="20" y1="58" x2="76" y2="58" stroke={c} strokeOpacity="0.3" strokeWidth="1" />
        <text x="48" y="78" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="currentColor" className="text-foreground">
          FIFA 23
        </text>
        <text x="48" y="94" textAnchor="middle" fontSize="9" fill={c} className="font-mono">
          ★ ML Model
        </text>
      </g>

      {/* Feature Attributes & Predictions on Right */}
      <g transform="translate(182, 30)">
        <text x="0" y="0" fontSize="11" fontWeight="600" fill="currentColor" className="font-mono text-foreground">
          Feature Importance &amp; Prediction
        </text>
        {stats.map((s, i) => (
          <g key={s.label} transform={`translate(0, ${18 + i * 28})`} className="pv-pop" style={{ animationDelay: `${i * 180}ms` }}>
            <text x="0" y="10" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">
              {s.label}
            </text>
            <text x="140" y="10" textAnchor="end" fontSize="10" fontWeight="700" fill={c} className="font-mono">
              {s.val}
            </text>
            <rect x="0" y="16" width="140" height="5" rx="2.5" fill="currentColor" fillOpacity="0.12" />
            <rect
              x="0"
              y="16"
              width={s.w}
              height="5"
              rx="2.5"
              fill={c}
              className="pv-grow"
              style={{ transformOrigin: "left" }}
            />
          </g>
        ))}

        {/* Prediction Accuracy Badge */}
        <g transform="translate(0, 138)" className="pv-pop" style={{ animationDelay: "600ms" }}>
          <rect x="0" y="0" width="140" height="22" rx="11" fill={c} fillOpacity="0.12" stroke={c} strokeOpacity="0.6" strokeWidth="1" />
          <text x="70" y="14" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={c} className="font-mono">
            R²: 0.93 • High Precision
          </text>
        </g>
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
interface Project {
  id: string;
  title: string;
  category: string;
  accent: string;
  summary: string;
  points: string[];
  tags: string[];
  Viz: ComponentType<VizProps>;
  github?: string; // أضف رابط الـ repo هنا وهيظهر زر GitHub تلقائياً
}

const PROJECTS: Project[] = [
  {
    id: "waste-detection",
    title: "Waste Detection (YOLO v8–v11)",
    category: "Computer Vision",
    accent: "#10b981",
    summary:
      "Scalable computer vision pipeline detecting 22 waste material types with 90% mAP50.",
    points: [
      "90% mAP50 accuracy identifying 22 distinct waste material classes",
      "Benchmarked and deployed with YOLOv8 through YOLOv11 architectures",
      "Optimized data augmentation and preprocessing pipeline",
    ],
    tags: ["YOLOv8–v11", "Computer Vision", "Object Detection", "PyTorch", "90% mAP50"],
    Viz: WasteViz,
  },
  {
    id: "health-chatbot",
    title: "Public Health AI Chatbot",
    category: "HealthTech & NLP",
    accent: "#06b6d4",
    summary:
      "A safe, non-diagnostic health assistant grounded in trusted public sources (WHO, CDC, MedlinePlus) with clinical triage handoff.",
    points: [
      "Strict non-diagnostic guardrails with zero unverified medical advice",
      "RAG pipeline grounded in official WHO, CDC, and MedlinePlus sources",
      "Built for the Egyptian public with emergency triage and human handoff",
    ],
    tags: ["Conversational AI", "RAG", "Guardrails", "WHO / CDC", "Public Health"],
    Viz: HealthViz,
  },
  {
    id: "bank",
    title: "Bank Marketing Analysis",
    category: "Data Science",
    accent: "#2dd4bf",
    summary:
      "Analyzed a Portuguese bank's campaign data (UCI Bank Marketing) to find what drives term-deposit subscriptions.",
    points: [
      "Customer behavior and campaign performance analysis",
      "Predictive modeling of subscription likelihood",
      "Business insights on marketing effectiveness",
    ],
    tags: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn"],
    Viz: BankViz,
  },
  {
    id: "cluster",
    title: "Clustering Analysis",
    category: "Machine Learning",
    accent: "#38bdf8",
    summary:
      "Applied K-Means, DBSCAN, and Gaussian Mixture Models to customer segmentation and pattern recognition.",
    points: [
      "Compared centroid, density, and probabilistic methods",
      "Customer segmentation and pattern discovery",
    ],
    tags: ["K-Means", "DBSCAN", "GMM", "Scikit-learn", "Python"],
    Viz: ClusterViz,
  },
  {
    id: "factory",
    title: "Factory Management System",
    category: "Software Engineering",
    accent: "#34d399",
    summary:
      "Designed a system that automates manufacturing workflows, inventory control, and production tracking.",
    points: [
      "Role-based access for Admin, Manager, and Employee",
      "Real-time inventory and product tracking",
      "Sales and profit reports with PDF export",
      "Orders with Visa, PayPal, and Cash, plus live status",
      "Full UML set: use case, class, sequence, activity, state",
    ],
    tags: ["UML", "RBAC", "Inventory", "Reporting"],
    Viz: FactoryViz,
  },
  {
    id: "fifa-prediction",
    title: "FIFA 23 Rating Prediction",
    category: "Machine Learning",
    accent: "#22c55e",
    summary:
      "Machine learning models predicting football player Overall ratings from EDA, market valuation, and core skill attributes.",
    points: [
      "Exploratory Data Analysis (EDA) uncovering key rating drivers",
      "Regression models trained on Potential, Value, Wage, and Special attributes",
      "Feature importance insights for scouting and talent valuation",
    ],
    tags: ["Machine Learning", "EDA", "Regression", "Scikit-Learn", "Feature Importance"],
    Viz: FifaViz,
  },
  {
    id: "image",
    title: "Image Processing Toolbox",
    category: "MATLAB",
    accent: "#fbbf24",
    summary:
      "An interactive MATLAB GUI for spatial, morphological, and frequency-domain processing, with manual implementations.",
    points: [
      "Custom spatial filters: mean, median, geometric, adaptive",
      "Manual erosion, dilation, opening, and closing",
      "FFT spectrum with Ideal, Butterworth, and Gaussian filters",
      "Enhancement, noise modeling, and restoration",
    ],
    tags: ["MATLAB", "GUI", "Image Processing", "FFT"],
    Viz: ImageViz,
  },
  {
    id: "othello",
    title: "Othello AI Game",
    category: "Game AI",
    accent: "#818cf8",
    summary:
      "A complete Othello game with a rule engine, interactive GUI, and an AI opponent built on Minimax with Alpha-Beta pruning.",
    points: [
      "Heuristics: disc parity, mobility, position, stability",
      "Multithreaded AI so the interface never blocks",
      "PvP, PvA, and AI vs AI modes",
    ],
    tags: ["Minimax", "Alpha-Beta", "Heuristics", "Multithreading"],
    Viz: OthelloViz,
  },
  {
    id: "oa",
    title: "O&A Management",
    category: "AI Platform",
    accent: "#a78bfa",
    summary:
      "A financial platform that uses AI to automate invoice management and billing, cutting manual entry and errors.",
    points: [
      "OCR extraction of totals, line items, taxes, and dates",
      "Duplicate, calculation-error, and fraud detection",
      "NLP-based expense categorization",
    ],
    tags: ["OCR", "NLP", "Machine Learning", "LLMs"],
    Viz: InvoiceViz,
  },
  {
    id: "supercv",
    title: "Super CV",
    category: "Full Stack and AI",
    accent: "#2dd4bf",
    summary:
      "An AI career copilot that personalizes its advice from your CV using Gemini and a RAG pipeline.",
    points: [
      "Gemini chat with multi-turn session memory",
      "RAG over CV sections: experience, projects, skills",
      "ATS scoring, XYZ-formula bullet rewriter, MCQ generator",
    ],
    tags: ["React 19", "TypeScript", "Node.js", "Gemini API", "RAG", "Firebase"],
    Viz: CVViz,
  },
];

const AUTOPLAY_MS = 8000;

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Projects = () => {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  const p = PROJECTS[active];
  const Viz = p.Viz;
  const next = () => setActive((i) => (i + 1) % PROJECTS.length);
  const play = paused ? "paused" : "running";

  return (
    <section id="projects" ref={ref} className="py-24 relative z-10 bg-background overflow-hidden">
      <style>{CSS}</style>
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Projects" />
        <p className="-mt-4 mb-10 max-w-xl text-muted-foreground">
          Selected projects
        </p>

        <div
          className="reveal grid gap-6 lg:grid-cols-[280px_1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Index */}
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {PROJECTS.map((pr, i) => {
              const on = i === active;
              return (
                <button
                  key={pr.id}
                  type="button"
                  aria-current={on}
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  className={`relative w-[220px] shrink-0 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:w-full ${
                    on ? "border-border bg-card" : "border-transparent hover:bg-card/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full transition-all"
                      style={{
                        background: pr.accent,
                        opacity: on ? 1 : 0.45,
                        boxShadow: on ? `0 0 12px ${pr.accent}` : "none",
                      }}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm font-semibold ${
                          on ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {pr.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{pr.category}</span>
                    </span>
                  </span>
                  {on && (
                    <span className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full bg-border">
                      {auto ? (
                        <span
                          className="pv-bar block h-full w-full"
                          onAnimationEnd={next}
                          style={
                            {
                              background: pr.accent,
                              "--d": `${AUTOPLAY_MS}ms`,
                              animationPlayState: play,
                            } as CSSProperties
                          }
                        />
                      ) : (
                        <span className="block h-full w-full" style={{ background: pr.accent }} />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <article className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div
              className="pv-viz relative aspect-[400/220] w-full border-b border-border/60"
              style={{
                background: `radial-gradient(circle at 75% 20%, ${p.accent}26, transparent 55%), radial-gradient(hsl(var(--border)) 1px, transparent 1px) 0 0 / 22px 22px`,
              }}
            >
              <div key={p.id} className="absolute inset-0 text-muted-foreground">
                <Viz c={p.accent} />
              </div>
              <span className="absolute left-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                {p.category}
              </span>
            </div>

            <div key={p.id} className="pv-in p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">{p.title}</h3>
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title} on GitHub`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Github className="h-4 w-4" />
                    Code
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="mt-3 max-w-2xl text-muted-foreground">{p.summary}</p>

              <ul className="mt-5 grid gap-x-8 gap-y-2 md:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1 font-mono text-xs"
                    style={{ color: p.accent, background: `${p.accent}1a` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Projects;
