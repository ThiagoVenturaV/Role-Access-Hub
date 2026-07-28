import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const AMBER = '#B45309';
const AMBER_LIGHT = '#FFFBEB';

export default function PrefeituraHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { problemas, projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const pendentes = problemas.filter(p => p.status === 'pendente');
  const emAnalise = problemas.filter(p => p.status === 'em_analise');
  const emProgresso = problemas.filter(p => p.status === 'em_progresso');
  const resolvidos = problemas.filter(p => p.status === 'resolvido');
  const pendingApproval = projetos.filter(p => p.status === 'teste' || p.status === 'prototipo');
  const executing = projetos.filter(p => p.status === 'execucao');

  const STATS = [
    { label: 'Demandas', value: problemas.length, sub: `${pendentes.length} novas`, color: AMBER, icon: 'warning' as const },
    { label: 'Pendente Aprovação', value: pendingApproval.length, sub: 'requerem ação', color: colors.destructive, icon: 'time' as const },
    { label: 'Em Execução', value: executing.length, sub: 'projetos', color: colors.primary, icon: 'play-circle' as const },
    { label: 'Resolvidos', value: resolvidos.length, sub: 'problemas', color: colors.success, icon: 'checkmark-circle' as const },
  ];

  const PRIORITY = problemas.filter(p => !p.validado && p.votos > 10).slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#451A03', '#B45309']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Painel de Gestão</Text>
            <Text style={styles.sub}>Prefeitura do Recife · Pilar</Text>
          </View>
          <View style={[styles.chip]}>
            <Ionicons name="shield" size={14} color="#FCD34D" />
            <Text style={styles.chipText}>{user?.name?.split(' ')[0]}</Text>
          </View>
        </View>
        <Text style={styles.date}>3º Trimestre · Julho 2025</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {STATS.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>{s.label}</Text>
            <Text style={[styles.statSub, { color: colors.mutedForeground }]}>{s.sub}</Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {/* Alerts */}
        {pendingApproval.length > 0 && (
          <TouchableOpacity
            style={[styles.alertCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}
            onPress={() => router.navigate('/prefeitura/projetos')}
            activeOpacity={0.85}
          >
            <Ionicons name="alert-circle" size={20} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: '#92400E' }]}>
                {pendingApproval.length} projeto{pendingApproval.length > 1 ? 's' : ''} aguardando aprovação
              </Text>
              <Text style={[styles.alertSub, { color: '#B45309' }]}>Toque para revisar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D97706" />
          </TouchableOpacity>
        )}

        {/* Progress bars */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Situação das Demandas</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: 'Pendentes', value: pendentes.length, total: problemas.length, color: colors.warning },
            { label: 'Em Análise', value: emAnalise.length, total: problemas.length, color: colors.primary },
            { label: 'Em Progresso', value: emProgresso.length, total: problemas.length, color: colors.accent },
            { label: 'Resolvidos', value: resolvidos.length, total: problemas.length, color: colors.success },
          ].map((item, i) => (
            <View key={item.label} style={[styles.progressItem, i < 3 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={styles.progressItemRow}>
                <Text style={[styles.progressItemLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.progressItemValue, { color: item.color }]}>{item.value}</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` as any, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Priority alerts */}
        {PRIORITY.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prioridade — Não Validadas</Text>
            {PRIORITY.map((p) => (
              <View key={p.id} style={[styles.priorityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.priorityLeft, { backgroundColor: colors.destructive + '15' }]}>
                  <Ionicons name="flame" size={18} color={colors.destructive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.priorityTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                  <Text style={[styles.priorityMeta, { color: colors.mutedForeground }]}>{p.votos} apoios · {p.categoria}</Text>
                </View>
                <TouchableOpacity style={[styles.validateBtn, { backgroundColor: AMBER }]} onPress={() => router.navigate('/prefeitura/demandas')} activeOpacity={0.8}>
                  <Text style={styles.validateBtnText}>Validar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Active projects */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Projetos em Execução</Text>
        {executing.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="layers-outline" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum projeto em execução</Text>
          </View>
        ) : executing.map((p) => {
          const progress = p.etapas.filter(e => e.concluida).length / p.etapas.length;
          return (
            <View key={p.id} style={[styles.execCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.execHeader}>
                <Text style={[styles.execTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                <Text style={[styles.execPct, { color: colors.primary }]}>{Math.round(progress * 100)}%</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: colors.muted, marginBottom: 8 }]}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: colors.primary }]} />
              </View>
              <View style={styles.execMeta}>
                <Ionicons name="person" size={12} color={colors.mutedForeground} />
                <Text style={[styles.execMetaText, { color: colors.mutedForeground }]}>{p.lider} · {p.prazo ?? 'Sem prazo'}</Text>
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
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 13, fontWeight: '600', color: '#FCD34D', fontFamily: 'Inter_600SemiBold' },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter_400Regular' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  statCard: { width: '47%', borderRadius: 14, padding: 14, borderWidth: 1 },
  statIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 26, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 13, fontWeight: '600', marginTop: 2, fontFamily: 'Inter_600SemiBold' },
  statSub: { fontSize: 11, marginTop: 2, fontFamily: 'Inter_400Regular' },
  content: { paddingHorizontal: 16, paddingBottom: 10 },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1.5 },
  alertTitle: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  alertSub: { fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  progressCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  progressItem: { padding: 12 },
  progressItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressItemLabel: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  progressItemValue: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  progressBg: { height: 5, borderRadius: 2.5 },
  progressFill: { height: 5, borderRadius: 2.5 },
  priorityCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1 },
  priorityLeft: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  priorityTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  priorityMeta: { fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
  validateBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  validateBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  empty: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center', gap: 10, marginBottom: 16 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  execCard: { borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 10 },
  execHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  execTitle: { fontSize: 14, fontWeight: '600', flex: 1, fontFamily: 'Inter_600SemiBold', marginRight: 8 },
  execPct: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  execMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  execMetaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
