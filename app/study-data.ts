export type StudyTask = { name: string; done: boolean; xpAwarded?: boolean };
export type StudyModule = { name: string; tasks: StudyTask[] };
export type StudyTopic = { name: string; progress: number; locked?: boolean; modules: StudyModule[] };
export type StudyBook = { id: string; title: string; author: string; difficulty: 'Introductorio' | 'Intermedio' | 'Avanzado'; xp: number; done?: boolean; xpAwarded?: boolean };
export type StudyBranch = { name: string; icon: string; level: number; tone: string; topics: StudyTopic[]; books?: StudyBook[] };

const block = (name: string, items: string): StudyModule => ({
  name,
  tasks: items.split('|').map((item) => ({ name: item.trim(), done: false })),
});

const level = (name: string, locked: boolean, ...modules: StudyModule[]): StudyTopic => ({
  name,
  progress: 0,
  locked,
  modules,
});

export const fullStudyBranches: StudyBranch[] = [
  {
    name: 'Marketing', icon: '📣', level: 1, tone: 'coral', topics: [
      level('Nivel 1 · Fundamentos de marketing', false,
        block('Bases', 'Qué es marketing realmente|Marketing vs ventas vs publicidad|Las 4 P del marketing|Producto, precio, plaza y promoción|Las 7 P del marketing|Segmentación de mercado|Targeting marketing|Posicionamiento de marca'),
        block('Cliente y recorrido', 'Cliente ideal / ICP|Buyer Persona|Necesidades, deseos y demanda|Propuesta de valor|Customer Journey|Funnel de marketing|B2B vs B2C marketing')),
      level('Nivel 2 · Entender al cliente', true,
        block('Investigación', 'Voice of Customer marketing|Investigación del cliente|Pain points customer research|Customer desires marketing|Jobs to be Done|Customer awareness levels|5 niveles de consciencia de Eugene Schwartz'),
        block('Insights', 'Motivaciones de compra|Objeciones del cliente|Triggers de compra|Perceived value marketing|Insights del consumidor|Mapear customer journey|Momentos de verdad customer experience')),
      level('Nivel 3 · Posicionamiento y oferta', true,
        block('Posicionamiento', 'Brand positioning|Positioning statement|Competitive positioning|Category positioning|Point of difference|Points of parity|Perceptual map|Category design|Unique selling proposition / USP'),
        block('Valor y oferta', 'Value proposition design|Value proposition canvas|Features vs benefits|Benefits vs outcomes|Perceived value|Customer value equation|Offer creation|Irresistible offer|Offer stack|Bonuses|Guarantees|Risk reversal|Price anchoring|Packaging services|Product bundling')),
      level('Nivel 4 · Estrategia de marketing', true,
        block('Estrategia', 'Go to market strategy|Marketing strategy|Market penetration strategy|Product market fit|Growth strategy|Growth loops|Marketing channels|Omnichannel marketing|Lifecycle marketing'),
        block('Crecimiento y ventaja', 'Retention marketing|Referral marketing|Brand vs performance marketing|Marketing budget allocation|Product portfolio strategy|Market expansion strategy|Blue Ocean Strategy|Porter differentiation strategy|Competitive advantage strategy')),
      level('Nivel 5 · Experto en marketing', true,
        block('Marketing avanzado', 'Marketing estratégico|Behavioral marketing|Marketing analytics|Category creation|Brand architecture|Pricing strategy|Customer lifetime value|Market entry strategy|Marketing attribution|Incrementality'),
        block('Dominio', 'Brand equity|Demand generation|Demand capture|Network effects|Distribution advantages|Growth loops|Product-led growth|Strategic moats|Prueba de dominio: construir una estrategia integral')),
    ],
  },
  {
    name: 'Ventas', icon: '🤝', level: 1, tone: 'blue', topics: [
      level('Nivel 1 · Fundamentos de ventas', false,
        block('Proceso comercial', 'Proceso de ventas|Sales funnel|Etapas de una venta|Prospect vs lead vs opportunity|Necesidades del cliente|Venta consultiva|Venta transaccional vs consultiva'),
        block('Conversación', 'Rapport en ventas|Escucha activa|Preguntas abiertas|Seguimiento|Cómo manejar objeciones|Cómo cerrar una venta')),
      level('Nivel 2 · Discovery', true,
        block('Descubrimiento', 'Sales discovery call|Discovery questions|SPIN Selling|Situation, problem, implication, need-payoff|Pain funnel|Needs analysis'),
        block('Calificación', 'Qualification sales|BANT|MEDDICC|Identifying buying motives|Identifying decision maker')),
      level('Nivel 3 · Objeciones y cierre', true,
        block('Objeciones', 'Objection handling|Price objection|I need to think about it objection|Competitor objection|Trust objections'),
        block('Cierre', 'Sales closing techniques|Trial close|Assumptive close|Alternative close|Follow up sales|Sales urgency ethical|Risk reversal sales')),
      level('Nivel 4 · Venta profesional', true,
        block('Venta avanzada', 'High ticket sales|B2B sales|Complex sales|Enterprise sales|Multiple stakeholder sales|Outbound sales|Inbound sales|Cold calling|Cold email|Social selling|Account based selling'),
        block('Gestión y expansión', 'Negotiation sales|Sales pipeline management|Sales forecasting|CRM sales process|Upselling strategies|Cross-selling|Expansion revenue|Account expansion|Customer retention sales')),
      level('Nivel 5 · Experto en ventas', true,
        block('Sistema comercial', 'Sales strategy|Sales operations|Revenue operations / RevOps|Sales enablement|Territory design|Compensation plans|Pipeline modeling|Forecast accuracy'),
        block('Liderazgo de ventas', 'Enterprise negotiation|Strategic accounts|Sales coaching|Sales team management|Prueba de dominio: construir un sistema comercial completo')),
    ],
  },
  {
    name: 'Publicidad y adquisición', icon: '🎯', level: 1, tone: 'pink', topics: [
      level('Nivel 1 · Matemáticas de publicidad', false,
        block('Métricas', 'CPM|CTR|CPC|CPL|CPA|Conversion rate|ROAS|MER marketing|CAC customer acquisition cost|LTV customer lifetime value|Break-even ROAS')),
      level('Nivel 2 · Meta Ads', true,
        block('Cuenta y estructura', 'Business Manager|Meta Ads Manager|Ad accounts|Pixels|Events|Conversions API|Meta Business Suite|Campaign|Ad Set|Ad|Campaign objectives|Advantage+ campaigns'),
        block('Audiencias y optimización', 'Broad targeting|Interest targeting|Custom audiences|Lookalike audiences|Retargeting|Meta learning phase|Attribution window|Campaign budget optimization|ABO vs CBO|Bid strategies|Frequency|Audience saturation')),
      level('Nivel 3 · Creativos', true,
        block('Estrategia creativa', 'Direct response creative|Ad creative strategy|Creative testing framework|Hooks advertising|Angles advertising|UGC ads|Static ads|Video ads'),
        block('Formatos', 'Problem solution ads|Before after advertising|Social proof ads|Testimonial ads|Offer ads|Founder ads|Native ads|Pattern interrupt ads|Producto → ángulo → hook → creativo → copy → CTA')),
      level('Nivel 4 · Funnels y canales', true,
        block('Conversión', 'Landing page optimization|Conversion Rate Optimization / CRO|Lead generation funnels|Sales funnels|Lead magnets|Webinar funnels|VSL|Lead nurturing|Email sequences|WhatsApp follow-up|Retargeting funnels|Lead scoring|Marketing automation'),
        block('Canales', 'Google Ads|Search Ads|Keyword intent|Match types|Quality Score|Search terms|Negative keywords|YouTube Ads|TikTok Ads|SEO|Email marketing|Referral marketing|Affiliate marketing|Partnerships|Organic social|Outbound acquisition')),
      level('Nivel 5 · Experto en adquisición', true,
        block('Escala', 'Multi-channel acquisition|Attribution models|Incrementality testing|Media mix|Budget allocation|Blended CAC|Marginal CAC|Creative fatigue|Customer acquisition economics|Cohort LTV|Marketing efficiency ratio|Growth modeling|Prueba de asignación de presupuesto')),
    ],
  },
  {
    name: 'Investigación y validación', icon: '🔎', level: 1, tone: 'aqua', topics: [
      level('Nivel 1 · Entender mercados', false,
        block('Mercado', 'Market research fundamentals|Primary research|Secondary research|Market segmentation|Market trends|Market demand|Market supply|Industry analysis|Competitor analysis')),
      level('Nivel 2 · Tamaño y atractivo', true,
        block('Dimensionamiento', 'TAM, SAM y SOM|Market sizing|Bottom-up market sizing|Top-down market sizing|Market growth rate|Market maturity|Market saturation|Competitive intensity|Barriers to entry|Porter Five Forces')),
      level('Nivel 3 · Cliente y competencia', true,
        block('Investigación del cliente', 'Customer interviews|Problem interviews|Customer discovery|Jobs To Be Done interviews|Interview bias|Leading questions research|Survey design|Qualitative research|Quantitative research'),
        block('Competencia', 'Competitor mapping|Competitor benchmarking|Competitive intelligence|Competitor pricing research|Review mining|Social listening|Competitor positioning|Mystery shopping')),
      level('Nivel 4 · Validación', true,
        block('Pruebas de demanda', 'Lean Startup|MVP / Minimum viable product|Smoke test|Fake door test|Landing page validation|Pre-sales validation|Concierge MVP|Wizard of Oz MVP|Prototype testing|Pricing tests|Demand testing')),
      level('Nivel 5 · Experto en mercados', true,
        block('Decisión estratégica', 'Market entry strategy|Scenario planning|Forecasting markets|Opportunity scoring|Sensitivity analysis|Strategic market segmentation|Conjoint analysis|Pricing research|Willingness to pay|Product market fit measurement|Cohort validation|Pre-mortem analysis|Construir un Opportunity Score')),
    ],
  },
  {
    name: 'Finanzas para negocios', icon: '💰', level: 1, tone: 'green', topics: [
      level('Nivel 1 · Conceptos esenciales', false,
        block('Rentabilidad y caja', 'Revenue vs profit|Gross profit|Net profit|Gross margin|Net margin|Fixed costs|Variable costs|Contribution margin|Break-even point|Cash flow|Working capital')),
      level('Nivel 2 · Estados financieros', true,
        block('Los tres estados', 'Income Statement / P&L|Balance Sheet|Cash Flow Statement|Cómo se conectan los tres estados financieros|Interpretar rentabilidad, patrimonio y efectivo')),
      level('Nivel 3 · Unit Economics', true,
        block('Economía por cliente', 'Unit economics|CAC|LTV|ARPU|Average order value|Contribution margin|Churn|Retention|Payback period|LTV:CAC ratio')),
      level('Nivel 4 · Planeación financiera', true,
        block('Pronóstico', 'Business budgeting|Financial forecasting|Rolling forecast|Cash flow forecasting|Scenario analysis|Sensitivity analysis|Runway|Burn rate|Revenue forecasting|Expense forecasting|Escenario pesimista, base y optimista')),
      level('Nivel 5 · Decisiones de capital', true,
        block('Asignación de capital', 'ROI|Payback period|NPV / VAN|IRR / TIR|Opportunity cost|Cost of capital|Debt vs equity|Operating leverage|Financial leverage|Capital allocation|ROIC|Business valuation basics')),
    ],
  },
  {
    name: 'Operaciones y sistemas', icon: '⚙️', level: 1, tone: 'orange', topics: [
      level('Nivel 1 · Procesos', false,
        block('Mapeo', 'Business process management|Process mapping|Workflow mapping|Flowcharts business|SIPOC|Inputs, outputs y procesos|Standardization')),
      level('Nivel 2 · SOPs', true,
        block('Documentación', 'SOP / Standard Operating Procedure|Documentar procesos|Process documentation|Checklists operations|Knowledge base business|Work instructions')),
      level('Nivel 3 · Eficiencia', true,
        block('Flujo y capacidad', 'Bottleneck theory|Theory of Constraints|Capacity planning|Cycle time|Lead time|Throughput|Utilization|Lean management|Waste elimination|Kaizen|Continuous improvement'),
        block('Causa raíz', 'Pareto principle operations|Root cause analysis|Five Whys|Fishbone diagram')),
      level('Nivel 4 · Automatización y calidad', true,
        block('Automatización', 'Business process automation|Workflow automation|Make automation|Zapier automation|n8n automation|CRM automation|API automation basics|Webhooks|AI automation|RPA basics'),
        block('Calidad', 'Quality control|Quality assurance|Error rate|SLA / Service Level Agreement|Quality checklist|Process audits|Customer service standards')),
      level('Nivel 5 · Sistema operativo empresarial', true,
        block('Operating system', 'Business operating system|Operations management|Organizational operating model|KPI management|OKRs|RACI matrix|Decision rights|Business continuity|Vendor management|Capacity forecasting|Scaling operations|Operations dashboard')),
    ],
  },
  {
    name: 'Analítica y decisiones', icon: '📊', level: 1, tone: 'gold', topics: [
      level('Nivel 1 · Cultura de datos', false,
        block('Fundamentos', 'Data literacy|Data-driven decision making|KPI vs metric|Leading vs lagging indicators|Vanity metrics|North Star Metric')),
      level('Nivel 2 · Hojas de cálculo y estadística', true,
        block('Excel / Google Sheets', 'Tablas|Filtros|Tablas dinámicas|Gráficos|SUMIFS|COUNTIFS|IF|XLOOKUP|INDEX MATCH|QUERY|Limpieza de datos|Dashboards|Excel for business analysis'),
        block('Estadística básica', 'Mean, median y mode|Variance|Standard deviation|Percentiles|Distribution|Probability basics|Sample vs population|Outliers')),
      level('Nivel 3 · Analítica empresarial', true,
        block('Análisis', 'Funnel analysis|Cohort analysis|Retention analysis|Customer segmentation|Revenue analysis|Pareto analysis|Sales analysis|Marketing analytics|Customer analytics|Construir árboles de métricas')),
      level('Nivel 4 · Experimentación y decisión', true,
        block('Experimentación', 'A/B testing|Hypothesis testing|Statistical significance|Confidence intervals|Sample size|Experiment design|Control group|Randomization|Selection bias|Survivorship bias'),
        block('Decisiones', 'Expected value|Probability decision making|Decision trees|Opportunity cost|Base rates|Bayesian thinking basics|Scenario analysis|Sensitivity analysis|Decision journal|Pre-mortem|Post-mortem')),
      level('Nivel 5 · Inteligencia empresarial', true,
        block('Herramientas avanzadas', 'Causal inference basics|Forecasting|Regression basics|Time series|Business intelligence|SQL basics|Power BI|Looker Studio|Data visualization|KPI architecture|Metric governance')),
    ],
  },
  {
    name: 'Psicología aplicada', icon: '🧠', level: 1, tone: 'purple', topics: [
      level('Nivel 1 · Comportamiento', false,
        block('Psicología del consumidor', 'Consumer psychology|Consumer behavior|Decision making psychology|Motivation psychology|Attention psychology|Memory psychology|Perception psychology')),
      level('Nivel 2 · Sesgos cognitivos', true,
        block('Sesgos', 'Anchoring bias|Loss aversion|Framing effect|Confirmation bias|Availability heuristic|Social proof|Authority bias|Scarcity effect|Endowment effect|Status quo bias|Sunk cost fallacy|Choice overload|Decoy effect|Ejemplos aplicados de cada sesgo')),
      level('Nivel 3 · Persuasión ética', true,
        block('Principios', 'Reciprocity|Commitment and consistency|Social proof|Authority|Liking|Scarcity|Unity|Trust building|Credibility|Risk perception'),
        block('Aplicación', 'Persuasion psychology|Behavioral economics|Influence psychology|Consumer decision journey')),
      level('Nivel 4 · Diseño de decisiones', true,
        block('Behavioral design', 'Choice architecture|Nudge theory|Defaults|Friction behavioral science|Incentive design|Behavioral design|Habit loops|Motivation vs ability|Behavioral triggers')),
      level('Nivel 5 · Psicología empresarial avanzada', true,
        block('Nivel experto', 'Prospect Theory|Behavioral Economics|Organizational Psychology|Negotiation psychology|Group psychology|Social psychology business|Identity-based behavior|Status signaling|Trust economics|Incentive psychology|Consumer neuroscience fundamentals')),
    ],
  },
  {
    name: 'Productividad y disciplina', icon: '⚡', level: 1, tone: 'coral', topics: [
      level('Nivel 1 · Autoconocimiento', false,
        block('Medición personal', 'Hora en que despiertas|Sueño|Energía|Horas productivas|Distracciones|Trabajo profundo|Tareas terminadas|Procrastinación'),
        block('Fundamentos', 'Energy management productivity|Circadian rhythm productivity|Attention management|Self-monitoring behavior')),
      level('Nivel 2 · Hábitos', true,
        block('Diseño de hábitos', 'Habit formation psychology|Cue, routine, reward|Implementation intentions|Habit stacking|Environment design habits|Friction habits|Identity-based habits|Commitment devices|Temptation bundling')),
      level('Nivel 3 · Procrastinación y concentración', true,
        block('Procrastinación', 'Psychology of procrastination|Temporal discounting|Task aversion|Avoidance behavior|Procrastination emotional regulation|Implementation intentions|Precommitment|Accountability systems'),
        block('Concentración', 'Deep Work|Attention residue|Context switching|Monotasking|Time blocking|Pomodoro technique|Focus environment|Digital distractions|Notification management')),
      level('Nivel 4 · Gestión personal', true,
        block('Sistema personal', 'Personal operating system|Weekly review|GTD fundamentals|Task management system|Calendar management|Timeboxing|Priority management|Impact effort matrix|Eisenhower matrix|Goal setting systems|OKRs personal|Quarterly planning')),
      level('Nivel 5 · Alto rendimiento sostenible', true,
        block('Rendimiento', 'Self regulation|Metacognition|Decision fatigue|Stress management|Recovery performance|Deliberate practice|Feedback loops|Goal review|Behavioral tracking')),
    ],
  },
  {
    name: 'Liderazgo y personas', icon: '👑', level: 1, tone: 'aqua', topics: [
      level('Nivel 1 · Comunicación', false,
        block('Comunicación de liderazgo', 'Leadership communication|Active listening|Assertive communication|Clear communication management|Expectations management|Difficult conversations|Nonviolent communication fundamentals')),
      level('Nivel 2 · Delegación y contratación', true,
        block('Delegación', 'How to delegate effectively|Delegation levels|Delegation vs abdication|Responsibility vs accountability|RACI|Decision rights|Delegation framework'),
        block('Contratación', 'How to hire employees|Structured interviews|Behavioral interviews|Scorecards hiring|Skills assessment|Culture fit vs culture add|Reference checks|Hiring bias')),
      level('Nivel 3 · Gestión', true,
        block('Gestión de personas', 'One-on-one meetings|Employee feedback|Performance management|Goal setting employees|KPI employees|Coaching employees|Employee motivation|Accountability management|Recognition employees')),
      level('Nivel 4 · Equipos y managers', true,
        block('Equipos', 'High-performing teams|Psychological safety|Team dynamics|Conflict management|Conflict resolution|Team incentives|Compensation design|Commission structures|Team culture|Meeting management'),
        block('Managers', 'Managing managers|Management systems|Leadership pipeline|Manager coaching|Organizational communication|Span of control')),
      level('Nivel 5 · Liderazgo empresarial', true,
        block('Dirección', 'Organizational design|Organizational structure|Change management|Strategic leadership|Executive decision making|Crisis leadership|Stakeholder management|Succession planning|Leadership culture|Incentive alignment|Prueba de diseño organizacional')),
    ],
  },
];

fullStudyBranches.push({
  name: 'Comunicación', icon: '🎙️', level: 1, tone: 'blue', topics: [
    level('Nivel 1 · Fundamentos', false,
      block('Bases', 'Qué es la comunicación|Comunicación verbal y no verbal|Emisor, receptor, mensaje, canal y contexto|Comunicación efectiva|Escucha activa|Barreras de comunicación|Cómo expresarse con claridad|Comunicación asertiva'),
      block('Conversación', 'Cómo iniciar conversaciones|Cómo mantener una conversación|Hacer buenas preguntas|Preguntas abiertas vs cerradas|Cómo demostrar interés|Cómo evitar conversaciones incómodas|Cómo cerrar una conversación|Adaptar el lenguaje a la persona')),
    level('Nivel 2 · Comunicación interpersonal', true,
      block('Inteligencia social', 'Leer el contexto social|Empatía|Rapport|Lenguaje corporal|Expresiones faciales|Contacto visual|Tono de voz|Ritmo y pausas al hablar|Detectar señales de interés o incomodidad'),
      block('Asertividad', 'Decir no|Poner límites|Expresar desacuerdo|Dar una opinión sin generar conflicto|Pedir algo correctamente|Dar y recibir críticas|Feedback efectivo|Conversaciones difíciles')),
    level('Nivel 3 · Persuasión y expresión', true,
      block('Persuasión', 'Principios de persuasión|Credibilidad|Autoridad|Reciprocidad|Prueba social|Consistencia|Escasez|Persuasión ética|Cómo presentar argumentos|Cómo responder objeciones'),
      block('Storytelling', 'Qué hace interesante una historia|Estructura inicio-conflicto-resolución|Storytelling aplicado a negocios|Storytelling aplicado a ventas|Uso de ejemplos y analogías|Crear tensión y curiosidad|Historias personales|Mensajes memorables')),
    level('Nivel 4 · Oratoria y comunicación profesional', true,
      block('Hablar en público', 'Control del miedo escénico|Preparar una presentación|Aperturas poderosas|Mantener la atención|Modulación de voz|Pausas|Lenguaje corporal en escenario|Uso de historias|Uso de diapositivas|Cierres poderosos|Improvisación|Sesiones de preguntas y respuestas'),
      block('Comunicación profesional', 'Comunicación empresarial|Reuniones efectivas|Presentar una idea|Presentar un proyecto|Pitch de negocio|Elevator pitch|Negociaciones|Comunicación con clientes|Comunicación con empleados|Comunicación con socios|Comunicación escrita profesional|WhatsApp profesional|Correos efectivos')),
    level('Nivel 5 · Dominio', true,
      block('Comunicación avanzada', 'Influencia|Retórica|Ethos, Pathos y Logos|Argumentación|Pensamiento rápido al hablar|Comunicación bajo presión|Manejo de conflictos|Mediación|Negociaciones difíciles|Comunicación emocional|Comunicación de liderazgo|Inspirar y movilizar personas'),
      block('Práctica experta', 'Dar una presentación de 10 minutos|Grabar un pitch de 60 segundos|Explicar una idea compleja de manera sencilla|Practicar storytelling|Mantener una conversación con un desconocido|Defender una idea ante objeciones|Simular una negociación|Dar feedback difícil|Liderar una reunión|Crear y presentar una propuesta de negocio')),
  ],
});

const books = (items: [string, string, StudyBook['difficulty'], number][]): StudyBook[] => items.map(([title, author, difficulty, xp], index) => ({ id: `${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title, author, difficulty, xp }));
const library: Record<string, StudyBook[]> = {
  Marketing: books([['Esto es marketing','Seth Godin','Introductorio',250],['Marketing 5.0','Philip Kotler, Hermawan Kartajaya e Iwan Setiawan','Introductorio',350],['Positioning','Al Ries y Jack Trout','Intermedio',350],['Obviously Awesome','April Dunford','Intermedio',350],['How Brands Grow','Byron Sharp','Avanzado',500],['Marketing Management','Philip Kotler y Kevin Lane Keller','Avanzado',500]]),
  Ventas: books([['Cómo ganar amigos e influir sobre las personas','Dale Carnegie','Introductorio',250],['To Sell Is Human','Daniel Pink','Introductorio',250],['SPIN Selling','Neil Rackham','Intermedio',350],['The Challenger Sale','Matthew Dixon y Brent Adamson','Intermedio',350],['Gap Selling','Keenan','Intermedio',350],['Never Split the Difference','Chris Voss','Avanzado',500],['The Psychology of Selling','Brian Tracy','Avanzado',350]]),
  'Publicidad y adquisición': books([['Ogilvy on Advertising','David Ogilvy','Introductorio',250],['Scientific Advertising','Claude Hopkins','Introductorio',250],['Breakthrough Advertising','Eugene Schwartz','Intermedio',500],['Cashvertising','Drew Eric Whitman','Intermedio',350],['Made to Stick','Chip Heath y Dan Heath','Intermedio',350],['Alchemy','Rory Sutherland','Avanzado',500],['Tested Advertising Methods','John Caples','Avanzado',500]]),
  'Investigación y validación': books([['The Mom Test','Rob Fitzpatrick','Introductorio',250],['Running Lean','Ash Maurya','Introductorio',350],['The Lean Startup','Eric Ries','Intermedio',350],['Testing Business Ideas','David Bland y Alexander Osterwalder','Intermedio',350],['Competing Against Luck','Clayton Christensen y otros','Avanzado',500],["The Innovator's Dilemma",'Clayton Christensen','Avanzado',500]]),
  'Finanzas para negocios': books([['Financial Intelligence for Entrepreneurs','Karen Berman y Joe Knight','Introductorio',350],['Profit First','Mike Michalowicz','Introductorio',250],['The Personal MBA','Josh Kaufman','Intermedio',350],['Simple Numbers, Straight Talk, Big Profits!','Greg Crabtree','Intermedio',350],['Valuation','McKinsey & Company','Avanzado',500],['The Intelligent Investor','Benjamin Graham','Avanzado',500]]),
  'Operaciones y sistemas': books([['The E-Myth Revisited','Michael Gerber','Introductorio',250],['Traction','Gino Wickman','Introductorio',350],['Clockwork','Mike Michalowicz','Intermedio',350],['Work the System','Sam Carpenter','Intermedio',350],['The Checklist Manifesto','Atul Gawande','Intermedio',350],['The Goal','Eliyahu Goldratt','Avanzado',500],['High Output Management','Andrew Grove','Avanzado',500]]),
  'Analítica y decisiones': books([['Thinking in Bets','Annie Duke','Introductorio',250],['The Signal and the Noise','Nate Silver','Introductorio',350],['How to Measure Anything','Douglas Hubbard','Intermedio',350],['Superforecasting','Philip Tetlock y Dan Gardner','Intermedio',350],['Thinking, Fast and Slow','Daniel Kahneman','Avanzado',500],['The Art of Statistics','David Spiegelhalter','Avanzado',500]]),
  'Psicología aplicada': books([['Influence','Robert Cialdini','Introductorio',350],['Predictably Irrational','Dan Ariely','Introductorio',250],['Pre-Suasion','Robert Cialdini','Intermedio',350],['Misbehaving','Richard Thaler','Intermedio',350],['Thinking, Fast and Slow','Daniel Kahneman','Avanzado',500],['Behave','Robert Sapolsky','Avanzado',500]]),
  'Productividad y disciplina': books([['Atomic Habits','James Clear','Introductorio',250],['The One Thing','Gary Keller y Jay Papasan','Introductorio',250],['Deep Work','Cal Newport','Intermedio',350],['Getting Things Done','David Allen','Intermedio',350],['Essentialism','Greg McKeown','Intermedio',350],['The Effective Executive','Peter Drucker','Avanzado',500],['Four Thousand Weeks','Oliver Burkeman','Avanzado',350]]),
  'Liderazgo y personas': books([['The One Minute Manager','Ken Blanchard y Spencer Johnson','Introductorio',250],['Leaders Eat Last','Simon Sinek','Introductorio',350],['Radical Candor','Kim Scott','Intermedio',350],['Multipliers','Liz Wiseman','Intermedio',350],['The Five Dysfunctions of a Team','Patrick Lencioni','Intermedio',350],['High Output Management','Andrew Grove','Avanzado',500],['The Hard Thing About Hard Things','Ben Horowitz','Avanzado',500]]),
  Comunicación: books([['Cómo ganar amigos e influir sobre las personas','Dale Carnegie','Introductorio',250],['How to Talk to Anyone','Leil Lowndes','Introductorio',250],['Crucial Conversations','Kerry Patterson y otros','Intermedio',350],['Made to Stick','Chip Heath y Dan Heath','Intermedio',350],['Talk Like TED','Carmine Gallo','Intermedio',350],['Never Split the Difference','Chris Voss','Avanzado',500],['Thank You for Arguing','Jay Heinrichs','Avanzado',500],["The Storyteller's Secret",'Carmine Gallo','Avanzado',350]]),
};
fullStudyBranches.forEach((branch) => { branch.books = library[branch.name] || []; });
