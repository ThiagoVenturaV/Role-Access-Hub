import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProblemaStatus = 'pendente' | 'em_analise' | 'em_progresso' | 'resolvido';
export type ProjetoStatus = 'proposta' | 'prototipo' | 'teste' | 'aprovado' | 'execucao' | 'concluido';

export interface Problema {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: ProblemaStatus;
  criadoPor: string;
  criadoEm: string;
  validado: boolean;
  bairro: string;
  votos: number;
  projetoId?: string;
}

export interface Etapa {
  titulo: string;
  concluida: boolean;
}

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  status: ProjetoStatus;
  lider: string;
  membros: string[];
  problemaId: string;
  bairro: string;
  prazo?: string;
  pontuacao: number;
  empresa?: string;
  etapas: Etapa[];
}

export interface RankingItem {
  id: string;
  nome: string;
  pontos: number;
  role: string;
  bairro: string;
  projetos: number;
}

interface DataContextType {
  problemas: Problema[];
  projetos: Projeto[];
  ranking: RankingItem[];
  addProblema: (p: Omit<Problema, 'id' | 'criadoEm' | 'votos' | 'validado'>) => Promise<Problema>;
  updateProblemaStatus: (id: string, status: ProblemaStatus) => Promise<void>;
  validarProblema: (id: string) => Promise<void>;
  updateProjetoStatus: (id: string, status: ProjetoStatus) => Promise<void>;
  aprovarProjeto: (id: string) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

const PROBLEMAS_KEY = '@pilar:problemas';
const PROJETOS_KEY = '@pilar:projetos';

const SEED_PROBLEMAS: Problema[] = [
  { id: 'p1', titulo: 'Buraco na Rua das Flores', descricao: 'Grande buraco no asfalto causando risco de acidentes para motoristas e pedestres nas proximidades da feira.', categoria: 'Infraestrutura', status: 'em_progresso', criadoPor: 'João Silva', criadoEm: '2025-06-10', validado: true, bairro: 'Pilar', votos: 23, projetoId: 'pr2' },
  { id: 'p2', titulo: 'Iluminação pública apagada', descricao: 'Três postes apagados na Rua Central, aumentando insegurança noturna nos últimos 2 meses.', categoria: 'Iluminação', status: 'em_progresso', criadoPor: 'Maria Santos', criadoEm: '2025-06-12', validado: true, bairro: 'Pilar', votos: 41, projetoId: 'pr1' },
  { id: 'p3', titulo: 'Esgoto transbordando', descricao: 'Esgoto a céu aberto próximo à escola municipal causando mau cheiro e risco à saúde.', categoria: 'Saneamento', status: 'em_analise', criadoPor: 'Carlos Oliveira', criadoEm: '2025-06-18', validado: false, bairro: 'Pilar', votos: 15 },
  { id: 'p4', titulo: 'Parque sem manutenção', descricao: 'Equipamentos quebrados e vegetação sem controle no Parque Central.', categoria: 'Espaços Públicos', status: 'resolvido', criadoPor: 'Ana Lima', criadoEm: '2025-05-20', validado: true, bairro: 'Pilar', votos: 38, projetoId: 'pr3' },
  { id: 'p5', titulo: 'Calçada quebrada na escola', descricao: 'Calçadas irregulares em frente à EMEF prejudicando acessibilidade para cadeirantes.', categoria: 'Acessibilidade', status: 'pendente', criadoPor: 'Pedro Costa', criadoEm: '2025-07-01', validado: false, bairro: 'Pilar', votos: 7 },
  { id: 'p6', titulo: 'Falta de área de lazer infantil', descricao: 'Crianças sem opção de lazer segura no bairro. Área disponível mas sem equipamentos.', categoria: 'Espaços Públicos', status: 'pendente', criadoPor: 'Lucia Fernandes', criadoEm: '2025-07-05', validado: false, bairro: 'Pilar', votos: 12 },
];

const SEED_PROJETOS: Projeto[] = [
  { id: 'pr1', titulo: 'Iluminação LED no Bairro', descricao: 'Substituição de 15 postes por tecnologia LED de baixo consumo e maior durabilidade.', status: 'execucao', lider: 'Carlos Silva', membros: ['Ana Lima', 'Pedro Costa', 'Lucia Fernandes'], problemaId: 'p2', bairro: 'Pilar', prazo: '2025-09-30', pontuacao: 1250, empresa: 'Energisa', etapas: [{ titulo: 'Levantamento dos postes', concluida: true }, { titulo: 'Aprovação do projeto técnico', concluida: true }, { titulo: 'Compra dos equipamentos', concluida: true }, { titulo: 'Instalação dos LEDs', concluida: false }, { titulo: 'Entrega à comunidade', concluida: false }] },
  { id: 'pr2', titulo: 'Recapeamento da Rua das Flores', descricao: 'Reparo completo do asfalto em 300m de via pública com sinalização nova.', status: 'aprovado', lider: 'Maria Santos', membros: ['João Silva', 'Carlos Oliveira'], problemaId: 'p1', bairro: 'Pilar', prazo: '2025-10-15', pontuacao: 980, etapas: [{ titulo: 'Vistoria técnica', concluida: true }, { titulo: 'Plano de ação entregue', concluida: true }, { titulo: 'Licitação aprovada', concluida: false }, { titulo: 'Execução das obras', concluida: false }, { titulo: 'Entrega e inauguração', concluida: false }] },
  { id: 'pr3', titulo: 'Revitalização do Parque Central', descricao: 'Reforma com novos equipamentos, paisagismo e área de convivência.', status: 'concluido', lider: 'João Ferreira', membros: ['Maria Santos', 'Ana Lima', 'Pedro Costa', 'Lucia Fernandes'], problemaId: 'p4', bairro: 'Pilar', prazo: '2025-05-31', pontuacao: 1580, empresa: 'Verde Ambiental', etapas: [{ titulo: 'Planejamento participativo', concluida: true }, { titulo: 'Parceria com empresa', concluida: true }, { titulo: 'Execução das obras', concluida: true }, { titulo: 'Inauguração pública', concluida: true }, { titulo: 'Avaliação final', concluida: true }] },
  { id: 'pr4', titulo: 'Escola de Líderes', descricao: 'Programa de capacitação para jovens líderes com módulos de gestão e advocacy.', status: 'prototipo', lider: 'Ana Lima', membros: ['Carlos Oliveira', 'Pedro Costa'], problemaId: 'p6', bairro: 'Pilar', prazo: '2025-11-30', pontuacao: 650, empresa: 'UNICAP', etapas: [{ titulo: 'Estrutura do programa', concluida: true }, { titulo: 'Seleção de participantes', concluida: false }, { titulo: 'Módulo piloto', concluida: false }, { titulo: 'Avaliação da comunidade', concluida: false }, { titulo: 'Expansão do programa', concluida: false }] },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ranking: RankingItem[] = [
    { id: 'r1', nome: 'João Ferreira', pontos: 1580, role: 'lider', bairro: 'Pilar', projetos: 3 },
    { id: 'r2', nome: 'Carlos Silva', pontos: 1250, role: 'lider', bairro: 'Pilar', projetos: 2 },
    { id: 'r3', nome: 'Maria Santos', pontos: 980, role: 'lider', bairro: 'Pilar', projetos: 2 },
    { id: 'r4', nome: 'Carlos Oliveira', pontos: 870, role: 'morador', bairro: 'Pilar', projetos: 0 },
    { id: 'r5', nome: 'Ana Lima', pontos: 820, role: 'lider', bairro: 'Pilar', projetos: 1 },
    { id: 'r6', nome: 'Pedro Costa', pontos: 650, role: 'morador', bairro: 'Pilar', projetos: 0 },
    { id: 'r7', nome: 'Lucia Fernandes', pontos: 480, role: 'morador', bairro: 'Pilar', projetos: 0 },
    { id: 'r8', nome: 'Roberto Alves', pontos: 350, role: 'morador', bairro: 'Pilar', projetos: 0 },
    { id: 'r9', nome: 'Fernanda Dias', pontos: 280, role: 'morador', bairro: 'Pilar', projetos: 0 },
    { id: 'r10', nome: 'Marcos Souza', pontos: 180, role: 'morador', bairro: 'Pilar', projetos: 0 },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [pData, prData] = await Promise.all([
          AsyncStorage.getItem(PROBLEMAS_KEY),
          AsyncStorage.getItem(PROJETOS_KEY),
        ]);
        setProblemas(pData ? JSON.parse(pData) : SEED_PROBLEMAS);
        setProjetos(prData ? JSON.parse(prData) : SEED_PROJETOS);
      } catch {
        setProblemas(SEED_PROBLEMAS);
        setProjetos(SEED_PROJETOS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveProblemas = async (data: Problema[]) => {
    setProblemas(data);
    await AsyncStorage.setItem(PROBLEMAS_KEY, JSON.stringify(data));
  };
  const saveProjetos = async (data: Projeto[]) => {
    setProjetos(data);
    await AsyncStorage.setItem(PROJETOS_KEY, JSON.stringify(data));
  };

  const addProblema = async (p: Omit<Problema, 'id' | 'criadoEm' | 'votos' | 'validado'>): Promise<Problema> => {
    const novo: Problema = {
      ...p,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      criadoEm: new Date().toISOString().split('T')[0],
      votos: 1,
      validado: false,
    };
    await saveProblemas([novo, ...problemas]);
    return novo;
  };

  const updateProblemaStatus = async (id: string, status: ProblemaStatus) => {
    await saveProblemas(problemas.map((p) => (p.id === id ? { ...p, status } : p)));
  };
  const validarProblema = async (id: string) => {
    await saveProblemas(problemas.map((p) => p.id === id ? { ...p, validado: true, status: 'em_analise' as ProblemaStatus } : p));
  };
  const updateProjetoStatus = async (id: string, status: ProjetoStatus) => {
    await saveProjetos(projetos.map((p) => (p.id === id ? { ...p, status } : p)));
  };
  const aprovarProjeto = async (id: string) => {
    await saveProjetos(projetos.map((p) => p.id === id ? { ...p, status: 'aprovado' as ProjetoStatus } : p));
  };

  return (
    <DataContext.Provider value={{ problemas, projetos, ranking, addProblema, updateProblemaStatus, validarProblema, updateProjetoStatus, aprovarProjeto, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
