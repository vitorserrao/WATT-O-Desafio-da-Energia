export type ChallengeType = 
  | 'QUIZ' 
  | 'SIMULATION_MULTIMETER' 
  | 'SIMULATION_WIRING_SOCKET' 
  | 'SIMULATION_WIRING_LAMP'
  | 'SIMULATION_BREAKER' 
  | 'SIMULATION_AUTOCAD' 
  | 'SIMULATION_SHOWER'
  | 'SIMULATION_ECONOMY';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  subject: string;
}

export interface Challenge {
  id: number;
  period: number;
  title: string;
  description: string;
  type: ChallengeType;
  subject: string;
  choices: Choice[];
  simulationData?: any;
}

export const challenges: Challenge[] = [
  {
    id: 1,
    period: 1,
    title: "Ciência dos Materiais",
    description: "Você precisa especificar os condutores para os barramentos principais de um painel industrial. Qual material é preferido devido à sua alta condutividade e resistência à corrosão?",
    type: 'QUIZ',
    subject: "Ciência e Tecnologia dos Materiais",
    choices: [
      {
        id: "1a",
        text: "Cobre eletrolítico.",
        isCorrect: true,
        explanation: "Correto! O cobre tem excelente condutividade e é o padrão para barramentos de alta performance.",
        subject: "Materiais Elétricos"
      },
      {
        id: "1b",
        text: "Alumínio comercial.",
        isCorrect: false,
        explanation: "Embora mais leve, o alumínio exige conexões especiais para evitar oxidação e tem menor condutividade.",
        subject: "Materiais Elétricos"
      },
      {
        id: "1c",
        text: "Aço galvanizado.",
        isCorrect: false,
        explanation: "O aço tem alta resistividade elétrica, sendo usado para estruturas, não para condução principal.",
        subject: "Materiais Elétricos"
      }
    ]
  },
  {
    id: 2,
    period: 1,
    title: "Desenho Técnico: Planta Baixa",
    description: "Analise a planta baixa industrial. Identifique e clique no símbolo que representa uma 'Tomada de Corrente Média (1,10m)' para validar o projeto.",
    type: 'SIMULATION_AUTOCAD',
    subject: "Desenho Técnico Auxiliado por Computador",
    choices: [
      {
        id: "2a",
        text: "Triângulo preenchido pela metade.",
        isCorrect: true,
        explanation: "Exato! Segundo a NBR 5444, o triângulo meio cheio representa tomadas a meia altura (1,10m).",
        subject: "Desenho Técnico"
      },
      {
        id: "2b",
        text: "Triângulo totalmente vazio.",
        isCorrect: false,
        explanation: "Este símbolo representa tomadas baixas (0,30m).",
        subject: "Simbologia Elétrica"
      },
      {
        id: "2c",
        text: "Círculo com um X.",
        isCorrect: false,
        explanation: "Este símbolo representa um ponto de luz no teto.",
        subject: "Simbologia Elétrica"
      }
    ]
  },
  {
    id: 3,
    period: 2,
    title: "Segurança NR-10",
    description: "Um painel de 440V precisa de manutenção. Segundo a NR-10, qual a primeira etapa obrigatória do processo de desenergização?",
    type: 'QUIZ',
    subject: "Segurança do Trabalho",
    choices: [
      {
        id: "3a",
        text: "Seccionamento (abertura do circuito).",
        isCorrect: true,
        explanation: "Correto! O seccionamento é o primeiro passo, seguido por impedimento de reenergização e constatação de ausência de tensão.",
        subject: "Segurança do Trabalho"
      },
      {
        id: "3b",
        text: "Colocar as luvas de proteção.",
        isCorrect: false,
        explanation: "Equipamentos de proteção são essenciais, mas o procedimento técnico de segurança começa com o seccionamento.",
        subject: "Normas Regulamentadoras"
      },
      {
        id: "3c",
        text: "Aterramento temporário.",
        isCorrect: false,
        explanation: "O aterramento é uma das últimas etapas da desenergização, após constatar a ausência de tensão.",
        subject: "Segurança do Trabalho"
      }
    ]
  },
  {
    id: 4,
    period: 2,
    title: "Análise de Circuitos: Medição",
    description: "Configure o multímetro para medir a TENSÃO de saída de uma fonte DC de 12V. Onde você deve conectar as pontas de prova?",
    type: 'SIMULATION_MULTIMETER',
    subject: "Circuitos Elétricos A",
    choices: [
      {
        id: "4a",
        text: "Escala DCV e pontas em paralelo com a fonte.",
        isCorrect: true,
        explanation: "Correto! Medição de tensão é sempre em paralelo e na escala correta (DCV para fontes contínuas).",
        subject: "Circuitos Elétricos"
      },
      {
        id: "4b",
        text: "Escala DCA e pontas em série.",
        isCorrect: false,
        explanation: "Isso mediria a corrente, não a tensão.",
        subject: "Lei de Ohm"
      },
      {
        id: "4c",
        text: "Escala OHM com o circuito ligado.",
        isCorrect: false,
        explanation: "Nunca use a escala de resistência em circuitos energizados!",
        subject: "Circuitos Elétricos"
      }
    ]
  },
  {
    id: 5,
    period: 3,
    title: "Instalação de Tomada (TUG)",
    description: "Conecte os condutores nos bornes corretos da tomada seguindo o padrão de cores da NBR 5410.",
    type: 'SIMULATION_WIRING_SOCKET',
    subject: "Instalações Elétricas",
    choices: [
      {
        id: "5a",
        text: "Azul (N), Verde (T), Vermelho (F).",
        isCorrect: true,
        explanation: "Perfeito! Azul é Neutro, Verde/Amarelo é Terra e Vermelho/Preto é Fase.",
        subject: "Instalações Elétricas"
      },
      {
        id: "5b",
        text: "Preto (N), Branco (T), Verde (F).",
        isCorrect: false,
        explanation: "Cores incorretas segundo a norma brasileira NBR 5410.",
        subject: "Normatização"
      },
      {
        id: "5c",
        text: "Qualquer cor, desde que funcione.",
        isCorrect: false,
        explanation: "As cores são vitais para a segurança e manutenção futura.",
        subject: "Instalações Elétricas"
      }
    ]
  },
  {
    id: 6,
    period: 3,
    title: "Instalação de Iluminação",
    description: "Faça a conexão de um interruptor simples para ligar uma lâmpada. Qual fio deve passar pelo interruptor?",
    type: 'SIMULATION_WIRING_LAMP',
    subject: "Instalações Elétricas",
    choices: [
      {
        id: "6a",
        text: "O fio de Fase (seccionado pelo interruptor).",
        isCorrect: true,
        explanation: "Correto! O interruptor deve sempre seccionar a Fase para garantir segurança na troca da lâmpada.",
        subject: "Instalações Elétricas"
      },
      {
        id: "6b",
        text: "O fio Neutro.",
        isCorrect: false,
        explanation: "Seccionar o Neutro deixa o bocal da lâmpada energizado mesmo com a luz apagada. Perigoso!",
        subject: "Proteção Elétrica"
      },
      {
        id: "6c",
        text: "O fio Terra.",
        isCorrect: false,
        explanation: "O terra nunca deve ser seccionado por interruptores.",
        subject: "Instalações Elétricas"
      }
    ]
  },
  {
    id: 7,
    period: 4,
    title: "Troca de Chuveiro Elétrico",
    description: "Você precisa conectar um novo chuveiro de 7500W. Qual a conexão correta para evitar derretimento dos fios?",
    type: 'SIMULATION_SHOWER',
    subject: "Projetos de Instalações Elétricas",
    choices: [
      {
        id: "7a",
        text: "Conector de porcelana ou cerâmica.",
        isCorrect: true,
        explanation: "Exato! Devido à alta corrente, conectores de plástico derretem. A porcelana suporta o calor.",
        subject: "Instalações Prediais"
      },
      {
        id: "7b",
        text: "Fita isolante comum enrolada.",
        isCorrect: false,
        explanation: "Fita isolante em chuveiros de alta potência tende a ressecar e causar mau contato.",
        subject: "Dimensionamento"
      },
      {
        id: "7c",
        text: "Emenda de torção simples.",
        isCorrect: false,
        explanation: "Emendas de torção sem conector apropriado geram aquecimento excessivo (Efeito Joule).",
        subject: "Instalações Prediais"
      }
    ]
  },
  {
    id: 8,
    period: 4,
    title: "Máquinas Elétricas",
    description: "Um motor de indução trifásico está operando. O que acontece com o escorregamento se a carga mecânica no eixo aumentar?",
    type: 'QUIZ',
    subject: "Fundamentos de Máquinas Elétricas",
    choices: [
      {
        id: "8a",
        text: "O escorregamento aumenta.",
        isCorrect: true,
        explanation: "Correto! Mais carga exige mais torque, o que faz o rotor girar mais devagar em relação ao campo girante.",
        subject: "Máquinas Elétricas"
      },
      {
        id: "8b",
        text: "O escorregamento diminui.",
        isCorrect: false,
        explanation: "O escorregamento só diminuiria se a carga fosse reduzida.",
        subject: "Máquinas Elétricas"
      },
      {
        id: "8c",
        text: "Permanece em zero.",
        isCorrect: false,
        explanation: "Escorregamento zero só ocorre em motores síncronos ou em vazio ideal.",
        subject: "Máquinas Elétricas"
      }
    ]
  },
  {
    id: 9,
    period: 5,
    title: "Economia: Oferta e Demanda",
    description: "O Operador Nacional do Sistema (ONS) detectou um aumento súbito na demanda de energia. Ajuste a oferta para equilibrar o sistema e evitar um apagão.",
    type: 'SIMULATION_ECONOMY',
    subject: "Economia Aplicada",
    choices: [
      {
        id: "9a",
        text: "Despachar usinas termelétricas (mais caras).",
        isCorrect: true,
        explanation: "Correto! Quando a demanda excede a base (hídrica), despachamos térmicas para manter a frequência da rede.",
        subject: "Comercialização"
      },
      {
        id: "9b",
        text: "Desligar as usinas solares.",
        isCorrect: false,
        explanation: "Isso agravaria o problema reduzindo a oferta disponível.",
        subject: "Operação de Sistemas"
      },
      {
        id: "9c",
        text: "Abaixar a tensão da cidade inteira.",
        isCorrect: false,
        explanation: "Isso causaria danos a equipamentos eletrônicos e não resolve o equilíbrio de potência.",
        subject: "Economia de Energia"
      }
    ]
  },
  {
    id: 10,
    period: 5,
    title: "Dimensionamento de Proteção",
    description: "Um circuito de tomada de uso específico (TUE) para um forno elétrico de 4400W (220V) exige proteção adequada. Selecione o disjuntor correto para este circuito.",
    type: 'SIMULATION_BREAKER',
    subject: "Instalações Elétricas Industriais",
    choices: [
      {
        id: "10a",
        text: "Disjuntor C32 (Curva C, 32A).",
        isCorrect: true,
        explanation: "Correto! Para 4400W em 220V, a corrente é 20A. O disjuntor de 32A (Curva C) oferece a proteção e margem necessária.",
        subject: "Dimensionamento"
      },
      {
        id: "10b",
        text: "Disjuntor C10 (Curva C, 10A).",
        isCorrect: false,
        explanation: "Incorreto. 10A é insuficiente para uma carga de 20A, o disjuntor desarmaria imediatamente.",
        subject: "Proteção"
      },
      {
        id: "10c",
        text: "Disjuntor C50 (Curva C, 50A).",
        isCorrect: false,
        explanation: "Superdimensionado. Um disjuntor de 50A pode não proteger a fiação adequadamente em caso de sobrecarga leve.",
        subject: "Segurança Elétrica"
      }
    ]
  },
  {
    id: 11,
    period: 6,
    title: "Qualidade de Energia",
    description: "A fábrica instalou inversores de frequência e os transformadores estão aquecendo. Qual fenômeno está ocorrendo?",
    type: 'QUIZ',
    subject: "Qualidade de Energia Elétrica",
    choices: [
      {
        id: "11a",
        text: "Distorções Harmônicas.",
        isCorrect: true,
        explanation: "Exato! Cargas não-lineares geram harmônicos que aumentam as perdas nos transformadores.",
        subject: "Qualidade de Energia"
      },
      {
        id: "11b",
        text: "Efeito Corona.",
        isCorrect: false,
        explanation: "O efeito corona ocorre em linhas de alta tensão, não em transformadores de baixa tensão.",
        subject: "Sistemas de Potência"
      },
      {
        id: "11c",
        text: "Sobretensão atmosférica.",
        isCorrect: false,
        explanation: "Isso seria causado por raios, não por inversores de frequência.",
        subject: "Proteção"
      }
    ]
  },
  {
    id: 12,
    period: 6,
    title: "Formatura e Registro Profissional",
    description: "Você concluiu o curso no IFSC! Como Tecnólogo em Sistemas de Energia, onde você deve obter seu registro profissional?",
    type: 'QUIZ',
    subject: "Formação Complementar",
    choices: [
      {
        id: "12a",
        text: "CREA (Conselho Regional de Engenharia e Agronomia).",
        isCorrect: true,
        explanation: "Correto! O Tecnólogo é um profissional de nível superior registrado no sistema CONFEA/CREA.",
        subject: "Legislação"
      },
      {
        id: "12b",
        text: "CFT (Conselho Federal dos Técnicos).",
        isCorrect: false,
        explanation: "O CFT é para técnicos de nível médio. Tecnólogos são nível superior.",
        subject: "Legislação"
      },
      {
        id: "12c",
        text: "Sindicato dos Eletricistas.",
        isCorrect: false,
        explanation: "Sindicatos defendem direitos trabalhistas, mas não emitem registro profissional de classe.",
        subject: "Legislação"
      }
    ]
  }
];
