import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useData } from '@/contexts/DataContext';

const AMBER = '#B45309';

export default function PrefeituraDados() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { problemas, projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  // Category breakdown
  const catCounts: Record<string, number> = {};
  problemas.forEach(p => { catCounts[p.categoria] = (catCounts[p.categoria] ?? 0) + 1; });
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...Object.values(catCounts), 1);

  // Status breakdown
  const statusCount = {
    pendente: problemas.filter(p => p.status === 'pendente').length,
    em_analise: problemas.filter(p => p.status === 'em_analise').length,
    em_progresso: problemas.filter(p => p.status === 'em_progresso').length,
    resolvido: problemas.filter(p => p.status === 'resolvido').length,
  };

  const totalProblemas = problemas.length;
  const resolucaoRate = totalProblemas > 0 ? Math.round((statusCount.resolvido / totalProblemas) * 100) : 0;
  const validacaoRate = totalProblemas > 0 ? Math.round((problemas.filter(p => p.validado).length / totalProblemas) * 100) : 0;

  const KPI_COLORS = [colors.accent, colors.primary, colors.success, '#D97706'];

  const KPI = [
    { icon: 'warning' as const, label: 'Total Demandas', value: totalProblemas, sub: 'registradas', color: colors.accent },
    { icon: 'checkmark-circle' as const, label: 'Taxa de Resolução', value: `${resolucaoRate}%`, sub: 'das demandas', color: colors.success },
    { icon: 'hardware-chip' as const, label: 'Validadas por IA', value: `${validacaoRate}%`, sub: 'dos relatos', color: colors.primary },
    { icon: 'layers' as const, label: 'Projetos Ativos', value: projetos.filter(p => p.status !== 'concluido').length, sub: 'em andamento', color: AMBER },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#451A03', '#B45309']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <Text style={styles.headerTitle}>Inteligência Territorial</Text>
        <Text style={styles.headerSub}>Bairro do Pilar · Recife · 2025</Text>
        <View style={styles.aiChip}>
          <Ionicons name="hardware-chip" size={13} color="#FFFFFF" />
          <Text style={styles.aiChipText}>Dados coletados e analisados pela IA da plataforma</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          {KPI.map((k) => (
            <View key={k.label} style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.kpiIcon, { backgroundColor: k.color + '15' }]}>
                <Ionicons name={k.icon} size={18} color={k.color} />
              </View>
              <Text style={[styles.kpiValue, { color: colors.foreground }]}>{k.value}</Text>
              <Text style={[styles.kpiLabel, { color: colors.foreground }]}>{k.label}</Text>
              <Text style={[styles.kpiSub, { color: colors.mutedForeground }]}>{k.sub}</Text>
            </View>
          ))}
        </View>

        {/* Status breakdown */}
        <Text style={[styles.section, { color: colors.foreground }]}>Situação das Demandas</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: 'Pendentes', value: statusCount.pendente, color: colors.warning },
            { label: 'Em Análise', value: statusCount.em_analise, color: colors.primary },
            { label: 'Em Progresso', value: statusCount.em_progresso, color: colors.accent },
            { label: 'Resolvidos', value: statusCount.resolvido, color: colors.success },
          ].map((item, i) => (
            <View key={item.label} style={[styles.statusItem, i < 3 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={[styles.statusDot, { backgroundColor: item.color }]} />
              <Text style={[styles.statusLabel, { color: colors.foreground }]}>{item.label}</Text>
              <View style={styles.statusBarRow}>
                <View style={[styles.statusBarBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.statusBarFill, { width: `${totalProblemas > 0 ? (item.value / totalProblemas) * 100 : 0}%` as any, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.statusVal, { color: item.color }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Category breakdown */}
        <Text style={[styles.section, { color: colors.foreground }]}>Demandas por Categoria</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {sortedCats.map(([cat, count], i) => (
            <View key={cat} style={[styles.catItem, i < sortedCats.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <Text style={[styles.catLabel, { color: colors.foreground }]}>{cat}</Text>
              <View style={styles.catBarRow}>
                <View style={[styles.catBarBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.catBarFill, { width: `${(count / maxCat) * 100}%` as any, backgroundColor: KPI_COLORS[i % 4] }]} />
                </View>
                <Text style={[styles.catVal, { color: colors.mutedForeground }]}>{count}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Projetos */}
        <Text style={[styles.section, { color: colors.foreground }]}>Pipeline de Projetos</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: 'Proposta / Protótipo', value: projetos.filter(p => ['proposta', 'prototipo', 'teste'].includes(p.status)).length, color: colors.warning },
            { label: 'Aprovados', value: projetos.filter(p => p.status === 'aprovado').length, color: colors.primary },
            { label: 'Em Execução', value: projetos.filter(p => p.status === 'execucao').length, color: colors.accent },
            { label: 'Concluídos', value: projetos.filter(p => p.status === 'concluido').length, color: colors.success },
          ].map((item, i) => (
            <View key={item.label} style={[styles.statusItem, i < 3 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={[styles.statusDot, { backgroundColor: item.color }]} />
              <Text style={[styles.statusLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.statusVal, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Gamification impact */}
        <View style={[styles.gamCard, { backgroundColor: AMBER + '12', borderColor: AMBER + '44' }]}>
          <Ionicons name="trophy" size={20} color={AMBER} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.gamTitle, { color: AMBER }]}>Impacto da Gamificação</Text>
            <Text style={[styles.gamText, { color: AMBER + 'BB' }]}>
              Moradores reportaram {totalProblemas} problemas, acumulando {problemas.reduce((a, p) => a + p.votos, 0)} apoios. Ranking trimestral ativo com {projetos.length} projetos pontuando.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular', marginBottom: 10 },
  aiChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 8, alignSelf: 'flex-start' },
  aiChipText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  kpiCard: { width: '47%', borderRadius: 14, padding: 14, borderWidth: 1 },
  kpiIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  kpiValue: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  kpiLabel: { fontSize: 13, fontWeight: '600', marginTop: 2, fontFamily: 'Inter_600SemiBold' },
  kpiSub: { fontSize: 11, marginTop: 1, fontFamily: 'Inter_400Regular' },
  section: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusLabel: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  statusBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBarBg: { width: 100, height: 5, borderRadius: 2.5 },
  statusBarFill: { height: 5, borderRadius: 2.5 },
  statusVal: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold', width: 20, textAlign: 'right' },
  catItem: { padding: 12 },
  catLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, fontFamily: 'Inter_600SemiBold' },
  catBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBarBg: { flex: 1, height: 6, borderRadius: 3 },
  catBarFill: { height: 6, borderRadius: 3 },
  catVal: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', width: 20, textAlign: 'right' },
  gamCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  gamTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  gamText: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_400Regular' },
});
