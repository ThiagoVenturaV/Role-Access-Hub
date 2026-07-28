import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useData, ProblemaStatus } from '@/contexts/DataContext';

const AMBER = '#B45309';
const AMBER_LIGHT = '#FFFBEB';

const FILTERS: { key: string; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'em_analise', label: 'Em Análise' },
  { key: 'em_progresso', label: 'Em Progresso' },
  { key: 'resolvido', label: 'Resolvidos' },
];

const CAT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Infraestrutura': 'construct', 'Iluminação': 'flashlight', 'Saneamento': 'water',
  'Espaços Públicos': 'leaf', 'Acessibilidade': 'accessibility', 'Segurança': 'shield',
  'Saúde': 'medkit', 'Educação': 'book',
};

export default function PrefeituraDemandas() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { problemas, validarProblema, updateProblemaStatus } = useData();
  const [filter, setFilter] = useState('todos');
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const filtered = problemas.filter((p) => filter === 'todos' || p.status === filter);
  const sortedFiltered = [...filtered].sort((a, b) => b.votos - a.votos);

  const handleValidar = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await validarProblema(id);
  };

  const handleAdvance = async (id: string, status: ProblemaStatus) => {
    const next: ProblemaStatus = status === 'em_analise' ? 'em_progresso' : 'resolvido';
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateProblemaStatus(id, next);
  };

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    pendente: { bg: colors.warningLight, text: colors.warning },
    em_analise: { bg: colors.primaryLight, text: colors.primary },
    em_progresso: { bg: colors.accentLight, text: colors.accent },
    resolvido: { bg: colors.successLight, text: colors.success },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Demandas da Comunidade</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{problemas.length} demandas registradas</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? AMBER : colors.muted }]}
            onPress={() => { Haptics.selectionAsync(); setFilter(f.key); }}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#FFFFFF' : colors.mutedForeground }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {sortedFiltered.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="warning-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhuma demanda encontrada</Text>
          </View>
        )}

        {sortedFiltered.map((p) => {
          const sc = STATUS_COLORS[p.status] ?? { bg: colors.muted, text: colors.mutedForeground };
          return (
            <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Priority band */}
              {p.votos >= 20 && (
                <View style={[styles.priorityBand, { backgroundColor: colors.destructive }]}>
                  <Ionicons name="flame" size={10} color="#FFFFFF" />
                  <Text style={styles.priorityText}>Alta prioridade · {p.votos} apoios</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={[styles.catIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name={CAT_ICONS[p.categoria] ?? 'alert-circle'} size={16} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.categoria}</Text>
                      <View style={styles.dot} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.criadoPor}</Text>
                      <View style={styles.dot} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.criadoEm}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.text }]}>{p.status.replace('_', ' ')}</Text>
                  </View>
                </View>

                <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={3}>{p.descricao}</Text>

                {/* Validation */}
                {!p.validado && (
                  <View style={[styles.aiBox, { backgroundColor: AMBER_LIGHT, borderColor: AMBER + '44' }]}>
                    <Ionicons name="hardware-chip" size={14} color={AMBER} />
                    <Text style={[styles.aiText, { color: AMBER }]}>IA registrou, classificou e validou · Aguardando confirmação humana</Text>
                  </View>
                )}

                {p.validado && (
                  <View style={[styles.aiBox, { backgroundColor: colors.successLight, borderColor: colors.success + '44' }]}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={[styles.aiText, { color: colors.success }]}>Validado · Encaminhado conforme cadastro</Text>
                  </View>
                )}

                <View style={styles.actions}>
                  <View style={styles.votosChip}>
                    <Ionicons name="thumbs-up" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.votosText, { color: colors.mutedForeground }]}>{p.votos} apoios</Text>
                  </View>
                  {!p.validado && (
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: AMBER }]} onPress={() => handleValidar(p.id)} activeOpacity={0.85}>
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Validar</Text>
                    </TouchableOpacity>
                  )}
                  {p.validado && p.status !== 'resolvido' && (
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => handleAdvance(p.id, p.status)} activeOpacity={0.85}>
                      <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Avançar</Text>
                    </TouchableOpacity>
                  )}
                  {p.projetoId && (
                    <View style={[styles.projetoChip, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="layers" size={12} color={colors.primary} />
                      <Text style={[styles.projetoText, { color: colors.primary }]}>Com projeto</Text>
                    </View>
                  )}
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
  filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  priorityBand: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 5 },
  priorityText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },
  cardBody: { padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3, fontFamily: 'Inter_700Bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: 'Inter_400Regular' },
  aiBox: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, padding: 8, marginBottom: 10, borderWidth: 1 },
  aiText: { fontSize: 11, flex: 1, fontFamily: 'Inter_400Regular' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  votosChip: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  votosText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  projetoChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  projetoText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
