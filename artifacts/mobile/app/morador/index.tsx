import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

function StatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const map: Record<string, { label: string; bg: string; text: string }> = {
    pendente: { label: 'Pendente', bg: colors.warningLight, text: colors.warning },
    em_analise: { label: 'Em Análise', bg: colors.primaryLight, text: colors.primary },
    em_progresso: { label: 'Em Progresso', bg: colors.accentLight, text: colors.accent },
    aprovado: { label: 'Aprovado', bg: colors.successLight, text: colors.success },
    execucao: { label: 'Em Execução', bg: colors.successLight, text: colors.success },
    resolvido: { label: 'Resolvido', bg: colors.successLight, text: colors.success },
    proposta: { label: 'Proposta', bg: colors.primaryLight, text: colors.primary },
    prototipo: { label: 'Protótipo', bg: colors.warningLight, text: colors.warning },
    concluido: { label: 'Concluído', bg: colors.successLight, text: colors.success },
  };
  const s = map[status] ?? { label: status, bg: colors.muted, text: colors.mutedForeground };
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: s.text, fontFamily: 'Inter_600SemiBold' }}>{s.label}</Text>
    </View>
  );
}

const CATEGORIES: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Infraestrutura': 'construct',
  'Iluminação': 'flashlight',
  'Saneamento': 'water',
  'Espaços Públicos': 'leaf',
  'Acessibilidade': 'accessibility',
};

export default function MoradorHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { problemas, projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const recentProblemas = problemas.slice(0, 3);
  const activeProjects = projetos.filter((p) => p.status === 'execucao' || p.status === 'aprovado').slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#0F1F45', '#1A3A7A']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.bairro}>Bairro do Pilar · Recife</Text>
          </View>
          <View style={styles.pontosChip}>
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text style={styles.pontosText}>{user?.pontos ?? 0} pts</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.relatarBtn}
          onPress={() => router.navigate('/morador/relatar')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.relatarBtnText}>Relatar um Problema</Text>
          <View style={styles.pontosReward}>
            <Text style={styles.pontosRewardText}>+50 pts</Text>
          </View>
        </TouchableOpacity>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Problemas', value: problemas.length, icon: 'warning' as const },
            { label: 'Projetos ativos', value: projetos.filter(p => p.status === 'execucao').length, icon: 'layers' as const },
            { label: 'Resolvidos', value: problemas.filter(p => p.status === 'resolvido').length, icon: 'checkmark-circle' as const },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Ionicons name={s.icon} size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Projetos em Andamento</Text>
              <TouchableOpacity onPress={() => router.navigate('/morador/projetos')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {activeProjects.map((p) => (
              <View key={p.id} style={[styles.projectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.projectCardTop}>
                  <Text style={[styles.projectTitle, { color: colors.foreground }]} numberOfLines={1}>{p.titulo}</Text>
                  <StatusBadge status={p.status} />
                </View>
                <Text style={[styles.projectDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{p.descricao}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(p.etapas.filter(e => e.concluida).length / p.etapas.length) * 100}%` as any }]} />
                </View>
                <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
                  {p.etapas.filter(e => e.concluida).length}/{p.etapas.length} etapas · Líder: {p.lider}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Problems */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Demandas Recentes</Text>
            <TouchableOpacity onPress={() => router.navigate('/morador/projetos')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          {recentProblemas.map((p) => (
            <View key={p.id} style={[styles.problemaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.problemaIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={CATEGORIES[p.categoria] ?? 'alert-circle'} size={18} color={colors.primary} />
              </View>
              <View style={styles.problemaInfo}>
                <Text style={[styles.problemaTitle, { color: colors.foreground }]} numberOfLines={1}>{p.titulo}</Text>
                <View style={styles.problemaRow}>
                  <Text style={[styles.problemaCategory, { color: colors.mutedForeground }]}>{p.categoria}</Text>
                  <View style={styles.dot} />
                  <Text style={[styles.problemaVotos, { color: colors.mutedForeground }]}>{p.votos} apoios</Text>
                </View>
              </View>
              <StatusBadge status={p.status} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  bairro: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  pontosChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pontosText: { fontSize: 14, fontWeight: '700', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  relatarBtn: { backgroundColor: '#F97316', borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8, marginBottom: 20 },
  relatarBtnText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  pontosReward: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  pontosRewardText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  projectCard: { borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
  projectCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  projectTitle: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8, fontFamily: 'Inter_700Bold' },
  projectDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: 'Inter_400Regular' },
  progressBar: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 6 },
  progressFill: { height: 4, borderRadius: 2 },
  progressText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  problemaCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1 },
  problemaIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  problemaInfo: { flex: 1 },
  problemaTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3, fontFamily: 'Inter_600SemiBold' },
  problemaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  problemaCategory: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  problemaVotos: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' },
});
