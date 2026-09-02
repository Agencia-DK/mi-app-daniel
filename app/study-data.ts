export type StudyTask = { name: string; detail?: string; done: boolean; xpAwarded?: boolean };
export type StudyModule = { name: string; tasks: StudyTask[] };
export type StudyTopic = { name: string; progress: number; locked?: boolean; modules: StudyModule[] };
export type StudyBook = { id: string; title: string; author: string; difficulty: 'Introductorio' | 'Intermedio' | 'Avanzado'; xp: number; done?: boolean; xpAwarded?: boolean };
export type StudyBranch = { name: string; icon: string; level: number; tone: string; topics: StudyTopic[]; books?: StudyBook[] };

const block = (name: string, items: string): StudyModule => ({
  name,
  tasks: items.split('|').map((item) => {
    const [name, detail] = item.split('::');
    return { name: detail ? `${name.trim()} — ${detail.trim()}` : name.trim(), detail: detail?.trim(), done: false };
  }),
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
      level('Nivel 1 · Fundamentos de Marketing', false,
        block('Valor y empresa', '1.1 · ¿Qué es Marketing?::Necesidad, deseo, demanda, intercambio, cliente y creación de valor. Entrega una explicación propia.|1.2 · Creación, entrega y captura de valor::Analiza una empresa real: problema, propuesta, entrega y modelo de ingresos.|1.3 · Marketing estratégico, táctico y operativo::Clasifica 10 ejemplos entre estrategia, táctica y ejecución.|1.4 · Las 4P::Analiza producto, precio, plaza y promoción de una empresa.|1.5 · Las 7P de servicios::Añade personas, proceso y evidencia física a un servicio.|1.6 · B2C, B2B y servicios::Compara decisión, ticket, confianza y ciclo de compra.|1.7 · Marketing dentro de una empresa::Relaciona Marketing con Ventas, Operaciones, Finanzas y Servicio.|1.8 · Mercado y competencia::Categoría, sustitutos, barreras, oferta, demanda y elasticidad básica.|Proyecto · Diagnóstico de Marketing::Empresa, cliente, valor, 4P/7P, competencia y tres recomendaciones.')),
      level('Nivel 2 · Comportamiento del consumidor', true,
        block('Decisiones e influencia', '2.1 · Proceso de decisión de compra::Reconstruye tres compras: necesidad, búsqueda, evaluación, compra y postcompra.|2.2 · Atención y percepción::Analiza 15 anuncios con saliencia, contraste y carga cognitiva.|2.3 · Motivaciones del consumidor::Funcionales, emocionales, sociales, identidad, estatus y conveniencia.|2.4 · Memoria y aprendizaje::Asociaciones, repetición, reconocimiento y recuerdo en marcas.|2.5 · Actitudes y preferencias::Cómo se forman y cambian las preferencias.|2.6 · Sesgos y heurísticas::Anclaje, framing, pérdida, prueba social, escasez, señuelo y defaults.|2.7 · Influencia social y cultural::Grupos, autoridad, normas, WOM, identidad y contexto.|2.8 · Customer Journey::Acciones, emociones, fricciones y touchpoints de awareness a loyalty.|2.9 · Postcompra, satisfacción y lealtad::Expectativas, recompra, recomendación y abandono.|2.10 · Persuasión vs. manipulación::Dark patterns, urgencia falsa y diseño ético.|Proyecto · Investigación de compra::Entrevista a 8–10 personas, entrega journey, insights y recomendaciones.')),
      level('Nivel 3 · Investigación de mercados', true,
        block('Evidencia e insights', '3.1 · Problema vs. pregunta de investigación::Convierte problemas empresariales en preguntas investigables.|3.2 · Desk Research::Fuentes oficiales, estudios, INEGI, reportes y evaluación de evidencia.|3.3 · Investigación competitiva::Matriz de producto, precio, segmento, mensaje, canales y reviews.|3.4 · Investigación cualitativa::Entrevistas profundas, neutralidad, probing y seguimiento.|3.5 · Focus groups y observación::Cuándo usarlos y cuándo no.|3.6 · Social Listening::Problemas, lenguaje, deseos y objeciones en comunidades.|3.7 · Encuestas::Escalas, orden, sesgos y wording.|3.8 · Muestreo::Población, muestra, representatividad, cuotas y margen de error.|3.9 · Estadística para investigación::Media, variabilidad, correlación e intervalos de confianza.|3.10 · A/B Testing::Hipótesis, control, variante, métrica y duración.|3.11 · Encontrar insights::Distingue dato, observación, insight y recomendación.|Proyecto · Oportunidad real::Brief, desk research, competencia, entrevistas, patrones e insights.')),
      level('Nivel 4 · Estrategia de Marketing', true,
        block('STP y crecimiento', '4.1 · Análisis del mercado::Tamaño, crecimiento, tendencias, clientes y competencia.|4.2 · Macroentorno::PESTEL aplicado a decisiones de Marketing.|4.3 · Análisis competitivo::Competidores, sustitutos, ventajas, debilidades y huecos.|4.4 · Market Sizing::TAM, SAM y SOM con estimaciones top-down y bottom-up.|4.5 · Segmentación::Demográfica, geográfica, psicográfica, conductual, necesidades y valor.|4.6 · Targeting::Tamaño, crecimiento, competencia, rentabilidad, accesibilidad y fit.|4.7 · Posicionamiento::Frame of reference, paridad, diferencia y reason to believe.|4.8 · Mapas perceptuales::Representa alternativas según la percepción del mercado.|4.9 · Propuesta de valor::Cliente, problema, beneficio, diferencia y evidencia.|4.10 · Jobs To Be Done::El progreso que busca realizar el consumidor.|4.11 · Objetivos y estrategia::Objetivo, estrategia, táctica, acción y KPI.|Proyecto · Estrategia de entrada::Sizing, target, posicionamiento, propuesta, objetivos y KPIs.')),
      level('Nivel 5 · Producto, oferta y marca', true,
        block('Oferta memorable', '5.1 · Producto como sistema de valor::Beneficio central, producto real y aumentado.|5.2 · Portfolio y líneas de producto::Producto, línea, SKU, portfolio y arquitectura.|5.3 · Ciclo de vida::Introducción, crecimiento, madurez y declive.|5.4 · Diseño de ofertas::Producto, bonos, garantías, riesgo, packaging y diferenciación.|5.5 · Innovación y discovery::Problema, insight, concepto, prototipo y validación.|5.6 · MVP y prototipos::Valida antes de construir todo.|5.7 · Concept Testing::Comprensión, relevancia, diferencia, credibilidad e intención.|5.8 · Fundamentos de Branding::Identidad, imagen, asociaciones, awareness y consistencia.|5.9 · Posicionamiento de marca::Une estrategia y branding.|5.10 · Brand Equity::Keller y Aaker aplicados.|5.11 · Arquitectura de marca::Branded house, house of brands y endorsed brands.|Proyecto · Nueva oferta::Insight, MVP, test, marca, arquitectura e hipótesis de lanzamiento.')),
      level('Nivel 6 · Pricing', true,
        block('Precio y valor', '6.1 · Fundamentos de Pricing::Coste, competencia y valor.|6.2 · Cost-based Pricing::Utilidad y limitaciones.|6.3 · Competitor-based Pricing::Mapa de precios de una categoría.|6.4 · Value-based Pricing::Cuánto valor genera para el cliente.|6.5 · Elasticidad aplicada::Cómo el precio afecta la demanda.|6.6 · Willingness to Pay::Investiga disposición a pagar.|6.7 · Van Westendorp::Metodología y limitaciones.|6.8 · Gabor-Granger::Ejercicio práctico.|6.9 · Arquitectura de precios::Basic, Standard, Premium, anchors, upsell y decoy.|6.10 · Descuentos y promociones::Demanda, margen, referencia de precio y recompra.|6.11 · Unit Economics aplicados::Margen de contribución, CAC, LTV y payback.|Proyecto · Rediseño de precios::Competencia, valor, paquetes, margen y recomendación.')),
      level('Nivel 7 · Canales y Go-to-Market', true,
        block('Llegar al mercado', '7.1 · Go-to-Market::Lleva una oferta de la empresa al mercado.|7.2 · Canales directos e indirectos::Venta directa, distribuidores, partners, marketplaces y retail.|7.3 · Channel Economics::Calcula la economía de cada canal.|7.4 · Retail y Trade Marketing::Fabricante, comercio y shopper.|7.5 · Ecommerce::Catálogo, checkout, pago, logística y postventa.|7.6 · Funnel comercial::Lead, oportunidad, propuesta y compra.|7.7 · Relación Marketing-Ventas::Lead, calidad, handoff, feedback y pipeline.|7.8 · B2B Marketing::Buying center, ciclos largos, confianza y account-based thinking.|Proyecto · Go-to-Market::Canal, economics, ecommerce, funnel, forecast y B2B/B2C.')),
      level('Nivel 8 · Comunicación y adquisición', true,
        block('Comunicar y convertir', '8.1 · Comunicación integrada::Audiencia, objetivo, mensaje y canales.|8.2 · Estrategia de comunicación::Qué decir, a quién, por qué, dónde y cuándo.|8.3 · Creative Brief::Escribe un brief correctamente.|8.4 · Concepto creativo::Insight, mensaje, Big Idea y ejecución.|8.5 · Copywriting aplicado::Hook, headline, beneficio, prueba y CTA.|8.6 · Medios::Reach, frecuencia, impressions, CPM y paid/owned/earned.|8.7 · Marketing de contenidos::Pilares, formatos, distribución y medición.|8.8 · Funnel de adquisición::Tráfico, lead, oportunidad y cliente.|8.9 · Paid Media::Meta, Google, subastas, segmentación, creatividad y bidding.|8.10 · SEO::Intención, keywords, contenido, enlaces y técnico.|8.11 · Landing Pages y CRO::Fricción, CTA, prueba social e hipótesis.|8.12 · Economía de adquisición::CPC, CPL, CAC, conversión, margen y LTV.|Proyecto · Campaña de adquisición::Target, mensaje, canales, landing, presupuesto y KPIs.')),
      level('Nivel 9 · CRM, retención y medición', true,
        block('Clientes y rendimiento', '9.1 · CRM::Contacts, companies, deals, activities y customer data.|9.2 · Lifecycle Marketing::Prospecto, lead, cliente, recurrente e inactivo.|9.3 · Segmentación de clientes::Comportamiento, compra, valor y actividad.|9.4 · RFM::Recency, Frequency y Monetary en Excel.|9.5 · Cohorts::Compara clientes adquiridos en momentos distintos.|9.6 · Customer Experience::Mapea la experiencia completa.|9.7 · Retención y churn::Repeat rate, retention, churn y reactivation.|9.8 · Lifecycle Communication::Welcome, nurture, postcompra, cross-sell y win-back.|9.9 · KPIs de Marketing::CAC, conversión, margen, LTV, ROAS y ROMI.|9.10 · Atribución::First click, last click, multi-touch y limitaciones.|9.11 · Incrementalidad::Qué ocurrió realmente gracias a Marketing.|9.12 · Dashboards::Información esencial para dirigir Marketing.|Proyecto · Sistema de clientes::CRM, lifecycle, RFM, retention y dashboard.')),
      level('Nivel 10 · Dirección de Marketing', true,
        block('Capstone', '10.1 · Diagnóstico integral::Mercado, consumidor, competencia, producto, precio, canales, adquisición y retención.|10.2 · Detectar el verdadero problema::Oferta, precio, posicionamiento, conversión, retención o mercado.|10.3 · Objetivos de Marketing::Objetivos comerciales, KPIs y metas.|10.4 · Construcción de estrategia::Dónde competir, con quién y cómo ganar.|10.5 · Plan de Marketing::Diagnóstico, objetivos, estrategia, iniciativas, presupuesto y KPIs.|10.6 · Priorización::Impacto, coste, dificultad, riesgo y velocidad.|10.7 · Presupuesto de Marketing::Distribuye inversión entre iniciativas.|Proyecto · Capstone::Construye y presenta un plan integral de Marketing.')),
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
  Marketing: books([['Esto es marketing','Seth Godin','Introductorio',250],['Marketing 5.0','Philip Kotler, Hermawan Kartajaya e Iwan Setiawan','Introductorio',350],['Posicionamiento: la batalla por su mente','Al Ries y Jack Trout','Intermedio',350],['La vaca púrpura','Seth Godin','Intermedio',350],['Cómo crecen las marcas','Byron Sharp','Avanzado',500],['Dirección de marketing','Philip Kotler y Kevin Lane Keller','Avanzado',500]]),
  Ventas: books([['Cómo ganar amigos e influir sobre las personas','Dale Carnegie','Introductorio',250],['Vender es humano','Daniel H. Pink','Introductorio',250],['El pequeño libro rojo de las ventas','Jeffrey Gitomer','Intermedio',350],['El vendedor desafiante','Matthew Dixon y Brent Adamson','Intermedio',350],['El arte de cerrar la venta','Brian Tracy','Intermedio',350],['Rompe la barrera del NO','Chris Voss','Avanzado',500],['Psicología de ventas','Brian Tracy','Avanzado',350]]),
  'Publicidad y adquisición': books([['Ogilvy y la publicidad','David Ogilvy','Introductorio',250],['Publicidad científica','Claude Hopkins','Introductorio',250],['Confesiones de un publicitario','David Ogilvy','Intermedio',350],['El libro rojo de la publicidad','Luis Bassat','Intermedio',350],['Ideas que pegan','Chip Heath y Dan Heath','Intermedio',350],['Alquimia','Rory Sutherland','Avanzado',500],['Las 22 leyes inmutables del marketing','Al Ries y Jack Trout','Avanzado',500]]),
  'Investigación y validación': books([['Generación de modelos de negocio','Alexander Osterwalder e Yves Pigneur','Introductorio',250],['Diseñando la propuesta de valor','Alexander Osterwalder y otros','Introductorio',250],['El método Lean Startup','Eric Ries','Intermedio',350],['Sprint: el método para resolver problemas y testar nuevas ideas en solo cinco días','Jake Knapp','Intermedio',350],['El dilema de los innovadores','Clayton Christensen','Avanzado',500],['La estrategia del océano azul','W. Chan Kim y Renée Mauborgne','Avanzado',500]]),
  'Finanzas para negocios': books([['Inteligencia financiera para emprendedores','Karen Berman y Joe Knight','Introductorio',350],['La ganancia es primero','Mike Michalowicz','Introductorio',250],['MBA personal','Josh Kaufman','Intermedio',350],['Contabilidad y finanzas para Dummies','Oriol Amat','Intermedio',350],['Valoración de empresas','Pablo Fernández','Avanzado',500],['El inversor inteligente','Benjamin Graham','Avanzado',500]]),
  'Operaciones y sistemas': books([['El mito del emprendedor','Michael E. Gerber','Introductorio',250],['Tracción','Gino Wickman','Introductorio',350],['El efecto checklist','Atul Gawande','Intermedio',350],['La quinta disciplina','Peter Senge','Intermedio',350],['Reingeniería','Michael Hammer y James Champy','Intermedio',350],['La meta','Eliyahu M. Goldratt','Avanzado',500],['Gestión de alto rendimiento','Andrew S. Grove','Avanzado',500]]),
  'Analítica y decisiones': books([['Pensar en apuestas','Annie Duke','Introductorio',250],['La señal y el ruido','Nate Silver','Introductorio',350],['Superpronosticadores','Philip Tetlock y Dan Gardner','Intermedio',350],['Contra los dioses: la extraordinaria historia del riesgo','Peter L. Bernstein','Intermedio',350],['Pensar rápido, pensar despacio','Daniel Kahneman','Avanzado',500],['El arte de la estadística','David Spiegelhalter','Avanzado',500]]),
  'Psicología aplicada': books([['Influencia','Robert Cialdini','Introductorio',350],['Las trampas del deseo','Dan Ariely','Introductorio',250],['Pre-suasión','Robert Cialdini','Intermedio',350],['Todo lo que he aprendido con la psicología económica','Richard H. Thaler','Intermedio',350],['El error de Descartes','Antonio Damasio','Avanzado',500],['Compórtate','Robert Sapolsky','Avanzado',500]]),
  'Productividad y disciplina': books([['Hábitos atómicos','James Clear','Introductorio',250],['Lo único','Gary Keller y Jay Papasan','Introductorio',250],['Céntrate','Cal Newport','Intermedio',350],['Organízate con eficacia','David Allen','Intermedio',350],['Esencialismo','Greg McKeown','Intermedio',350],['El ejecutivo eficaz','Peter Drucker','Avanzado',500],['Cuatro mil semanas','Oliver Burkeman','Avanzado',350]]),
  'Liderazgo y personas': books([['El ejecutivo al minuto','Ken Blanchard y Spencer Johnson','Introductorio',250],['Los líderes comen al final','Simon Sinek','Introductorio',350],['Franqueza radical','Kim Scott','Intermedio',350],['Multiplicadores','Liz Wiseman','Intermedio',350],['Las cinco disfunciones de un equipo','Patrick Lencioni','Intermedio',350],['Gestión de alto rendimiento','Andrew S. Grove','Avanzado',500],['Emprender y liderar una startup','Ben Horowitz','Avanzado',500]]),
  Comunicación: books([['Cómo hablar bien en público e influir en los hombres de negocios','Dale Carnegie','Introductorio',250],['Cómo hablar con cualquiera','Leil Lowndes','Introductorio',250],['Conversaciones cruciales','Kerry Patterson y otros','Intermedio',350],['Ideas que pegan','Chip Heath y Dan Heath','Intermedio',350],['Habla como TED','Carmine Gallo','Intermedio',350],['Rompe la barrera del NO','Chris Voss','Avanzado',500],['El arte de tener razón','Arthur Schopenhauer','Avanzado',350],['Storytelling: la máquina de fabricar historias y formatear las mentes','Christian Salmon','Avanzado',500]]),
};
fullStudyBranches.forEach((branch) => { branch.books = library[branch.name] || []; });
