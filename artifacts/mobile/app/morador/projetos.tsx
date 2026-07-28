import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useData, ProjetoStatus } from '@/contexts/DataContext';
import * as Haptics from 'expo-haptics';

const FILTERS: { key: string; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'aprovado', label: 'Aprovados' },
  { key: 'concluido', label: 'Concluídos' },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  proposta: { label: 'Proposta', bg: '#EEF2FF', text: '#1A56DB', icon: 'document-text' },
  prototipo: { label: 'Protótipo', bg: '#FFFBEB', text: '#D97706', icon: 'flask' },
  teste: { label: 'Teste', bg: '#FFF7ED', text: '#F97316', icon: 'beaker' },
  aprovado: { label: 'Aprovado', bg: '#F0FDF4', text: '#16A34A', icon: 'checkmark-circle' },
  execucao: { label: 'Em Execução', bg: '#F0FDF4', text: '#16A34A', icon: 'play-circle' },
  concluido: { label: 'Concluído', bg: '#F0FDF4', text: '#16A34A', icon: 'trophy' },
};

export default function MoradorProjetos() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { projetos } = useData();
  const [filter, setFilter] = useState('todos');
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const filtered = projetos.filter((p) => {
    if (filter === 'todos') return true;
    if (filter === 'em_andamento') return ['execucao', 'prototipo', 'teste', 'proposta'].includes(p.status);
    if (filter === 'aprovado') return p.status === 'aprovado';
    if (filter === 'concluido') return p.status === 'concluido';
    return true;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Projetos do Bairro</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{projetos.length} projetos registrados</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && { backgroundColor: colors.primary }]}
            onPress={() => { Haptics.selectionAsync(); setFilter(f.key); }}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#FFFFFF' : colors.mutedForeground }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="layers-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum projeto encontrado</Text>
          </View>
        )}
        {filtered.map((p) => {
          const sc = STATUS_CONFIG[p.status] ?? { label: p.status, bg: colors.muted, text: colors.mutedForeground, icon: 'help-circle' as const };
          const progress = p.etapas.filter((e) => e.concluida).length / p.etapas.length;
          return (
            <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Status bar */}
              <View style={[styles.statusBar, { backgroundColor: sc.bg }]}>
                <Ionicons name={sc.icon} size={14} color={sc.text} />
                <Text style={[styles.statusText, { color: sc.text }]}>{sc.label}</Text>
                {p.empresa && (
                  <>
                    <View style={[styles.dot, { backgroundColor: sc.text }]} />
                    <Ionicons name="business" size={12} color={sc.text} />
                    <Text style={[styles.statusText, { color: sc.text }]}>{p.empresa}</Text>
                  </>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{p.descricao}</Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                    <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress * 100}%` as any }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>{Math.round(progress * 100)}%</Text>
                </View>

                {/* Meta */}
                <View style={styles.meta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.lider}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.membros.length} membros</Text>
                  </View>
                  {p.prazo && (
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar" size={13} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.prazo}</Text>
                    </View>
                  )}
                </View>

                {/* Etapas */}
                <View style={styles.etapas}>
                  {p.etapas.map((e, i) => (
                    <View key={i} style={styles.etapa}>
                      <Ionicons name={e.concluida ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={e.concluida ? colors.success : colors.mutedForeground} />
                      <Text style={[styles.etapaText, { color: e.concluida ? colors.foreground : colors.mutedForeground }]}>{e.titulo}</Text>
                    </View>
                  ))}
                </View>
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
  filters: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.06)' },
  filterText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, marginBottom: 14, borderWidth: 1, overflow: 'hidden' },
  statusBar: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8 },
  statusText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  dot: { width: 3, height: 3, borderRadius: 1.5 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, fontFamily: 'Inter_700Bold' },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 12, fontFamily: 'Inter_400Regular' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressBg: { flex: 1, height: 6, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', width: 32, textAlign: 'right' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  etapas: { gap: 5 },
  etapa: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  etapaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
