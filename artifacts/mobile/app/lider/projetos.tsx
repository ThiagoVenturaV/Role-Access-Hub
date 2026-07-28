import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#F5F3FF';

const STATUS_FLOW = ['proposta', 'prototipo', 'teste', 'aprovado', 'execucao', 'concluido'];
const STATUS_LABELS: Record<string, string> = {
  proposta: 'Proposta', prototipo: 'Protótipo', teste: 'Teste Comunidade',
  aprovado: 'Aprovado', execucao: 'Em Execução', concluido: 'Concluído',
};

export default function LiderProjetos() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { projetos, updateProjetoStatus } = useData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const myProjects = projetos.filter(
    (p) => p.lider === user?.name || p.membros.includes(user?.name ?? '')
  );

  const handleAdvance = async (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < STATUS_FLOW.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await updateProjetoStatus(id, STATUS_FLOW[idx + 1] as any);
    }
  };

  const PONTOS_INFO = [
    { action: 'Aceitar liderar projeto', pts: '+100' },
    { action: 'Entregar plano de ação', pts: '+100' },
    { action: 'Concluir todas as etapas', pts: '+150' },
    { action: 'Projeto aprovado pela Prefeitura', pts: '+200' },
    { action: 'Projeto executado com sucesso', pts: '+100' },
    { action: 'Bônus: Projeto aprovado PCR', pts: '+300' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Meus Projetos</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{myProjects.length} projetos</Text>
      </View>

      <View style={styles.content}>
        {/* Points guide */}
        <View style={[styles.pontosBanner, { backgroundColor: PURPLE_LIGHT, borderColor: PURPLE + '44' }]}>
          <Ionicons name="star" size={16} color={PURPLE} />
          <Text style={[styles.pontosTitle, { color: PURPLE }]}>Como ganhar pontos como Líder</Text>
          {PONTOS_INFO.map((p, i) => (
            <View key={i} style={styles.pontosRow}>
              <Text style={[styles.pontosAction, { color: PURPLE }]}>{p.action}</Text>
              <Text style={[styles.pontosPts, { color: PURPLE }]}>{p.pts}</Text>
            </View>
          ))}
        </View>

        {myProjects.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="layers-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Você não está em nenhum projeto ainda</Text>
          </View>
        )}

        {myProjects.map((p) => {
          const isExpanded = expanded === p.id;
          const idx = STATUS_FLOW.indexOf(p.status);
          const canAdvance = idx < STATUS_FLOW.length - 1;
          const isLeader = p.lider === user?.name;
          const progress = p.etapas.filter((e) => e.concluida).length / p.etapas.length;

          return (
            <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Status pipeline */}
              <View style={styles.pipeline}>
                {STATUS_FLOW.map((s, i) => (
                  <React.Fragment key={s}>
                    <View style={[styles.pipeStep, { backgroundColor: i <= idx ? PURPLE : colors.muted }]}>
                      {i < idx ? (
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      ) : i === idx ? (
                        <View style={styles.pipeDot} />
                      ) : null}
                    </View>
                    {i < STATUS_FLOW.length - 1 && (
                      <View style={[styles.pipeLine, { backgroundColor: i < idx ? PURPLE : colors.muted }]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
              <Text style={[styles.statusLabel, { color: PURPLE }]}>{STATUS_LABELS[p.status]}</Text>

              <TouchableOpacity onPress={() => setExpanded(isExpanded ? null : p.id)} activeOpacity={0.9}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={isExpanded ? undefined : 2}>{p.descricao}</Text>
              </TouchableOpacity>

              {/* Progress */}
              <View style={styles.progressRow}>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: PURPLE }]} />
                </View>
                <Text style={[styles.progressPct, { color: colors.mutedForeground }]}>{Math.round(progress * 100)}%</Text>
              </View>

              {isExpanded && (
                <View style={styles.expandedSection}>
                  <Text style={[styles.expandTitle, { color: colors.foreground }]}>Etapas do Projeto</Text>
                  {p.etapas.map((e, i) => (
                    <View key={i} style={[styles.etapa, { borderBottomColor: colors.border }]}>
                      <Ionicons name={e.concluida ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={e.concluida ? colors.success : colors.mutedForeground} />
                      <Text style={[styles.etapaText, { color: e.concluida ? colors.foreground : colors.mutedForeground }]}>{e.titulo}</Text>
                    </View>
                  ))}

                  {p.empresa && (
                    <View style={[styles.empresaChip, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="business" size={14} color={colors.primary} />
                      <Text style={[styles.empresaText, { color: colors.primary }]}>Parceria: {p.empresa}</Text>
                    </View>
                  )}

                  <Text style={[styles.expandTitle, { color: colors.foreground, marginTop: 12 }]}>Equipe</Text>
                  <Text style={[styles.memberItem, { color: colors.foreground }]}>
                    <Ionicons name="star" size={12} color="#D97706" /> {p.lider} (Líder)
                  </Text>
                  {p.membros.map((m, i) => (
                    <Text key={i} style={[styles.memberItem, { color: colors.mutedForeground }]}>
                      <Ionicons name="person" size={12} color={colors.mutedForeground} /> {m}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.cardActions}>
                <View style={styles.ptsChip}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={[styles.ptsChipText, { color: colors.warning }]}>{p.pontuacao} pts</Text>
                </View>
                {isLeader && canAdvance && (
                  <TouchableOpacity
                    style={[styles.advanceBtn, { backgroundColor: PURPLE }]}
                    onPress={() => handleAdvance(p.id, p.status)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.advanceBtnText}>Avançar Etapa</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setExpanded(isExpanded ? null : p.id)}>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, marginTop: 2, fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  pontosBanner: { borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, gap: 6 },
  pontosTitle: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  pontosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pontosAction: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
  pontosPts: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  pipeline: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  pipeStep: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  pipeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  pipeLine: { flex: 1, height: 2 },
  statusLabel: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, fontFamily: 'Inter_700Bold' },
  cardDesc: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progressBg: { flex: 1, height: 5, borderRadius: 2.5 },
  progressFill: { height: 5, borderRadius: 2.5 },
  progressPct: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold', width: 30 },
  expandedSection: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  expandTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8, fontFamily: 'Inter_700Bold' },
  etapa: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1 },
  etapaText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  empresaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, padding: 8, marginTop: 8 },
  empresaText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  memberItem: { fontSize: 13, paddingVertical: 3, fontFamily: 'Inter_400Regular' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  ptsChip: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  ptsChipText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  advanceBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  advanceBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
});
