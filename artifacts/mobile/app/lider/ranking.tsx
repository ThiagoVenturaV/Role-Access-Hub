import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const PURPLE = '#7C3AED';

export default function LiderRanking() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { ranking } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;
  const leaders = ranking.filter((r) => r.role === 'lider');
  const myPos = ranking.findIndex((r) => r.nome === user?.name);
  const MEDAL = ['🥇', '🥈', '🥉'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#2E1065', '#5B21B6']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <Text style={styles.headerTitle}>Ranking de Líderes</Text>
        <Text style={styles.headerSub}>3º trimestre · 2025</Text>
        <View style={styles.myPoints}>
          <Ionicons name="star" size={20} color="#FCD34D" />
          <Text style={styles.myPointsVal}>{user?.pontos ?? 0}</Text>
          <Text style={styles.myPointsLabel}>seus pontos</Text>
        </View>
        {myPos >= 0 && (
          <Text style={styles.myRank}>Posição geral: {myPos + 1}º lugar</Text>
        )}
      </LinearGradient>

      <View style={styles.content}>
        {/* Top 3 Líderes */}
        <Text style={[styles.section, { color: colors.foreground }]}>Top Líderes Comunitários</Text>
        <View style={[styles.rankCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {leaders.map((item, i) => {
            const isMe = item.nome === user?.name;
            return (
              <View key={item.id} style={[styles.rankItem, i < leaders.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }, isMe && { backgroundColor: '#F5F3FF' }]}>
                <Text style={[styles.medal, { color: i < 3 ? colors.accent : colors.mutedForeground }]}>{i < 3 ? MEDAL[i] : `${i + 1}º`}</Text>
                <View style={[styles.avatar, { backgroundColor: isMe ? PURPLE : '#EDE9FE' }]}>
                  <Ionicons name="star" size={14} color={isMe ? '#FFFFFF' : PURPLE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rankName, { color: colors.foreground }]}>{item.nome}{isMe ? ' (você)' : ''}</Text>
                  <Text style={[styles.rankMeta, { color: colors.mutedForeground }]}>{item.projetos} projetos · {item.bairro}</Text>
                </View>
                <View style={styles.ptsRow}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={[styles.ptsVal, { color: colors.foreground }]}>{item.pontos}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Points guide */}
        <Text style={[styles.section, { color: colors.foreground }]}>Sistema de Pontuação — Líderes</Text>
        <View style={[styles.guideCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { action: 'Aceitar liderar projeto', pts: '100', bonus: false },
            { action: 'Entregar plano de ação', pts: '100', bonus: false },
            { action: 'Concluir todas as etapas', pts: '150', bonus: false },
            { action: 'Projeto aprovado pela Prefeitura', pts: '200', bonus: false },
            { action: 'Projeto executado com sucesso', pts: '100', bonus: false },
            { action: 'Bônus: projeto aprovado PCR', pts: '+300', bonus: true },
            { action: 'Bônus: projeto executado', pts: '+200', bonus: true },
          ].map((item, i) => (
            <View key={i} style={[styles.guideItem, i < 6 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Ionicons name={item.bonus ? 'flash' : 'checkmark-circle'} size={14} color={item.bonus ? colors.accent : PURPLE} />
              <Text style={[styles.guideAction, { color: colors.foreground }]}>{item.action}</Text>
              <Text style={[styles.guidePts, { color: item.bonus ? colors.accent : PURPLE }]}>{item.pts} pts</Text>
            </View>
          ))}
        </View>

        {/* Quarter prize */}
        <View style={[styles.prizeCard, { backgroundColor: '#FFF7ED', borderColor: '#F97316' }]}>
          <Ionicons name="trophy" size={28} color="#F97316" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.prizeTitle, { color: '#92400E' }]}>Premiação Trimestral</Text>
            <Text style={[styles.prizeDesc, { color: '#B45309' }]}>
              Os 3 projetos com maior pontuação ao final do trimestre recebem premiação oficial da Prefeitura do Recife.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 28, gap: 4 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginBottom: 8 },
  myPoints: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  myPointsVal: { fontSize: 40, fontWeight: '800', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  myPointsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  myRank: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  content: { padding: 20 },
  section: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  rankCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  rankItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  medal: { width: 28, fontSize: 16, textAlign: 'center', fontFamily: 'Inter_700Bold' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  rankMeta: { fontSize: 11, marginTop: 1, fontFamily: 'Inter_400Regular' },
  ptsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ptsVal: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  guideCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  guideItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  guideAction: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  guidePts: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  prizeCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 16, padding: 16, borderWidth: 1.5 },
  prizeTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  prizeDesc: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular' },
});
