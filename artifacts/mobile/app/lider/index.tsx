import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

function StatCard({ icon, value, label, color, bg }: { icon: keyof typeof Ionicons.glyphMap; value: number | string; label: string; color: string; bg: string }) {
  return (
    <View style={[statStyles.card, { backgroundColor: bg, flex: 1 }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={[statStyles.label, { color }]}>{label}</Text>
    </View>
  );
}
const statStyles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  value: { fontSize: 22, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  label: { fontSize: 11, textAlign: 'center', fontFamily: 'Inter_400Regular', opacity: 0.8 },
});

const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#F5F3FF';

export default function LiderHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { projetos, problemas } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const myProjects = projetos.filter((p) => p.lider === user?.name || p.membros.includes(user?.name ?? ''));
  const pendingActions = myProjects.filter((p) => p.status === 'proposta' || p.status === 'prototipo' || p.status === 'teste');
  const activeProjects = myProjects.filter((p) => p.status === 'execucao' || p.status === 'aprovado');

  const ACTIONS = [
    { icon: 'add-circle' as const, label: 'Novo Projeto', desc: '+100 pts', color: PURPLE, bg: PURPLE_LIGHT },
    { icon: 'people' as const, label: 'Gerenciar Equipe', desc: 'Ver membros', color: colors.primary, bg: colors.primaryLight },
    { icon: 'document-text' as const, label: 'Plano de Ação', desc: '+100 pts', color: colors.success, bg: colors.successLight },
    { icon: 'chatbubbles' as const, label: 'Feedback', desc: 'Comunidade', color: colors.accent, bg: colors.accentLight },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#2E1065', '#5B21B6']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.subtitle}>Líder Comunitário · Pilar</Text>
          </View>
          <View style={styles.pontosChip}>
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text style={styles.pontosText}>{user?.pontos ?? 0} pts</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="layers" value={myProjects.length} label="Meus Projetos" color="#FFFFFF" bg="rgba(255,255,255,0.12)" />
          <StatCard icon="time" value={pendingActions.length} label="Ações Pendentes" color="#FCD34D" bg="rgba(252,211,77,0.15)" />
          <StatCard icon="people" value={myProjects.reduce((a, p) => a + p.membros.length, 0)} label="Membros" color="#A78BFA" bg="rgba(167,139,250,0.15)" />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          {ACTIONS.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.actionCard, { backgroundColor: a.bg, borderColor: a.color + '33' }]}
              onPress={() => i === 0 && router.navigate('/lider/projetos')}
              activeOpacity={0.8}
            >
              <Ionicons name={a.icon} size={22} color={a.color} />
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
              <Text style={[styles.actionDesc, { color: a.color + 'AA' }]}>{a.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Projects */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Projetos Ativos</Text>
        {activeProjects.length === 0 && pendingActions.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="layers-outline" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum projeto ativo ainda</Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: PURPLE }]}
              onPress={() => router.navigate('/lider/projetos')}
            >
              <Text style={styles.emptyBtnText}>Iniciar um projeto</Text>
            </TouchableOpacity>
          </View>
        )}
        {[...activeProjects, ...pendingActions].map((p) => {
          const progress = p.etapas.filter((e) => e.concluida).length / p.etapas.length;
          const nextEtapa = p.etapas.find((e) => !e.concluida);
          return (
            <View key={p.id} style={[styles.projectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.projectHeader}>
                <Text style={[styles.projectTitle, { color: colors.foreground }]}>{p.titulo}</Text>
                <View style={[styles.badge, { backgroundColor: PURPLE_LIGHT }]}>
                  <Text style={[styles.badgeText, { color: PURPLE }]}>{p.membros.length} membros</Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: PURPLE }]} />
                </View>
                <Text style={[styles.progressPct, { color: colors.mutedForeground }]}>{Math.round(progress * 100)}%</Text>
              </View>
              {nextEtapa && (
                <View style={[styles.nextStep, { backgroundColor: PURPLE_LIGHT }]}>
                  <Ionicons name="arrow-forward-circle" size={14} color={PURPLE} />
                  <Text style={[styles.nextStepText, { color: PURPLE }]}>Próxima: {nextEtapa.titulo}</Text>
                </View>
              )}
              {p.pontuacao > 0 && (
                <View style={styles.ptsRow}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={[styles.ptsText, { color: colors.warning }]}>{p.pontuacao} pts acumulados</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Pending problems for new projects */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Demandas para Liderar</Text>
        {problemas.filter(p => p.validado && !p.projetoId).slice(0, 2).map((p) => (
          <View key={p.id} style={[styles.demandaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.demandaIcon, { backgroundColor: PURPLE_LIGHT }]}>
              <Ionicons name="alert-circle" size={18} color={PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.demandaTitle, { color: colors.foreground }]}>{p.titulo}</Text>
              <Text style={[styles.demandaVotos, { color: colors.mutedForeground }]}>{p.votos} apoios · {p.categoria}</Text>
            </View>
            <TouchableOpacity style={[styles.liderar, { backgroundColor: PURPLE }]}>
              <Text style={styles.liderarText}>Liderar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  pontosChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pontosText: { fontSize: 14, fontWeight: '700', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  statsRow: { flexDirection: 'row', gap: 10 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12, marginTop: 4, fontFamily: 'Inter_700Bold' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionCard: { width: '47.5%', borderRadius: 14, padding: 14, gap: 6, borderWidth: 1 },
  actionLabel: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  actionDesc: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center', gap: 10, marginBottom: 24 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  emptyBtn: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  projectCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  projectTitle: { fontSize: 15, fontWeight: '700', flex: 1, fontFamily: 'Inter_700Bold', marginRight: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progressBg: { flex: 1, height: 6, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', width: 32 },
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8, marginBottom: 6 },
  nextStepText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  ptsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ptsText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  demandaCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1 },
  demandaIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  demandaTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  demandaVotos: { fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
  liderar: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  liderarText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
});
