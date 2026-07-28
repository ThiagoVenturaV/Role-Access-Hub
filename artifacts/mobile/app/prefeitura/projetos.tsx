import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useData } from '@/contexts/DataContext';

const AMBER = '#B45309';
const AMBER_LIGHT = '#FFFBEB';

export default function PrefeituraProjetos() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { projetos, aprovarProjeto, updateProjetoStatus } = useData();
  const [tab, setTab] = useState<'pendentes' | 'execucao' | 'concluidos'>('pendentes');
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const pendentes = projetos.filter(p => ['prototipo', 'teste'].includes(p.status));
  const execucao = projetos.filter(p => p.status === 'execucao' || p.status === 'aprovado');
  const concluidos = projetos.filter(p => p.status === 'concluido');

  const shown = tab === 'pendentes' ? pendentes : tab === 'execucao' ? execucao : concluidos;

  const handleAprovar = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await aprovarProjeto(id);
  };

  const handleConcluir = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateProjetoStatus(id, 'concluido');
  };

  const STATUS_LABELS: Record<string, string> = {
    proposta: 'Proposta', prototipo: 'Aguardando Aprovação', teste: 'Teste Comunidade',
    aprovado: 'Aprovado', execucao: 'Em Execução', concluido: 'Concluído',
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Gestão de Projetos</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{projetos.length} projetos na plataforma</Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        {[
          { key: 'pendentes' as const, label: 'Ag. Aprovação', value: pendentes.length, color: colors.warning },
          { key: 'execucao' as const, label: 'Em Execução', value: execucao.length, color: colors.primary },
          { key: 'concluidos' as const, label: 'Concluídos', value: concluidos.length, color: colors.success },
        ].map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: tab === s.key ? s.color : colors.border, borderWidth: tab === s.key ? 2 : 1 }]}
            onPress={() => { Haptics.selectionAsync(); setTab(s.key); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {shown.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="layers-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum projeto nesta categoria</Text>
          </View>
        )}

        {shown.map((p) => {
          const progress = p.etapas.filter(e => e.concluida).length / p.etapas.length;
          const canApprove = p.status === 'prototipo' || p.status === 'teste';
          const canComplete = p.status === 'execucao';

          return (
            <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Status tag */}
              <View style={[styles.tag, { backgroundColor: p.status === 'concluido' ? colors.successLight : p.status === 'aprovado' || p.status === 'execucao' ? colors.primaryLight : AMBER_LIGHT }]}>
                <Text style={[styles.tagText, { color: p.status === 'concluido' ? colors.success : p.status === 'aprovado' || p.status === 'execucao' ? colors.primary : AMBER }]}>
                  {STATUS_LABELS[p.status]}
                </Text>
              </View>

              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.titulo}</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{p.descricao}</Text>

              {/* Progress */}
              <View style={styles.progressRow}>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: p.status === 'concluido' ? colors.success : colors.primary }]} />
                </View>
                <Text style={[styles.progressPct, { color: colors.mutedForeground }]}>{Math.round(progress * 100)}%</Text>
              </View>

              {/* Meta */}
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <Ionicons name="person" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.lider}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.membros.length} membros</Text>
                </View>
                {p.empresa && (
                  <View style={styles.metaItem}>
                    <Ionicons name="business" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.empresa}</Text>
                  </View>
                )}
                {p.prazo && (
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.prazo}</Text>
                  </View>
                )}
              </View>

              {/* Pontuação */}
              <View style={styles.ptsRow}>
                <Ionicons name="star" size={12} color="#D97706" />
                <Text style={[styles.ptsText, { color: colors.warning }]}>{p.pontuacao} pontos acumulados no projeto</Text>
              </View>

              {/* Actions */}
              {canApprove && (
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.rejectBtn, { borderColor: colors.destructive }]} activeOpacity={0.8}>
                    <Ionicons name="close" size={15} color={colors.destructive} />
                    <Text style={[styles.rejectBtnText, { color: colors.destructive }]}>Recusar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.approveBtn, { backgroundColor: colors.success }]} onPress={() => handleAprovar(p.id)} activeOpacity={0.85}>
                    <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Aprovar Projeto</Text>
                  </TouchableOpacity>
                </View>
              )}

              {canComplete && (
                <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.success }]} onPress={() => handleConcluir(p.id)} activeOpacity={0.85}>
                  <Ionicons name="trophy" size={15} color="#FFFFFF" />
                  <Text style={styles.completeBtnText}>Marcar como Concluído</Text>
                </TouchableOpacity>
              )}
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
  summary: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 4 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  summaryLabel: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  tag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8 },
  tagText: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, fontFamily: 'Inter_700Bold' },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: 'Inter_400Regular' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  progressBg: { flex: 1, height: 6, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', width: 32 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  ptsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  ptsText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderRadius: 12, paddingVertical: 10 },
  rejectBtnText: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, paddingVertical: 10 },
  approveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 11 },
  completeBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
});
