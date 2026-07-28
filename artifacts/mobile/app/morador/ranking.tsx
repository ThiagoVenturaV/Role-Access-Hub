import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const RECOMPENSAS = [
  { id: 'r1', titulo: 'Brindes institucionais', pontos: 500, icon: 'gift' as const },
  { id: 'r2', titulo: 'Ingressos para eventos', pontos: 800, icon: 'ticket' as const },
  { id: 'r3', titulo: 'Vale-livros', pontos: 1000, icon: 'book' as const },
  { id: 'r4', titulo: 'Voucher em parceiros', pontos: 1500, icon: 'card' as const },
  { id: 'r5', titulo: 'Cursos e capacitações', pontos: 2000, icon: 'school' as const },
  { id: 'r6', titulo: 'Benefícios especiais PCR', pontos: 3000, icon: 'star' as const },
];

const MEDAL = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { ranking } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;
  const myPos = ranking.findIndex((r) => r.nome === user?.name);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* My Points Card */}
      <LinearGradient colors={['#1A3A7A', '#0F2D6B']} style={[styles.myCard, { paddingTop: insets.top + webTopPad + 20 }]}>
        <Text style={styles.myCardTitle}>Seus Pontos</Text>
        <View style={styles.pointsRow}>
          <Ionicons name="star" size={28} color="#FCD34D" />
          <Text style={styles.pointsValue}>{user?.pontos ?? 0}</Text>
        </View>
        {myPos >= 0 && (
          <Text style={styles.posText}>Você está em {myPos + 1}º lugar no ranking</Text>
        )}
        <View style={styles.nextGoal}>
          {RECOMPENSAS.filter(r => r.pontos > (user?.pontos ?? 0)).slice(0, 1).map((r) => (
            <View key={r.id} style={styles.nextGoalInner}>
              <Ionicons name={r.icon} size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.nextGoalText}>
                Próxima recompensa: {r.titulo} — faltam {r.pontos - (user?.pontos ?? 0)} pts
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Ranking */}
        <Text style={[styles.section, { color: colors.foreground }]}>Ranking Trimestral</Text>
        <View style={[styles.rankingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {ranking.map((item, i) => {
            const isMe = item.nome === user?.name;
            return (
              <View key={item.id} style={[styles.rankItem, i < ranking.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }, isMe && { backgroundColor: colors.primaryLight }]}>
                <View style={styles.rankLeft}>
                  <Text style={[styles.rankPos, { color: i < 3 ? colors.accent : colors.mutedForeground }]}>
                    {i < 3 ? MEDAL[i] : `${i + 1}º`}
                  </Text>
                  <View style={[styles.avatar, { backgroundColor: isMe ? colors.primary : colors.muted }]}>
                    <Ionicons name={item.role === 'lider' ? 'star' : 'person'} size={14} color={isMe ? '#FFFFFF' : colors.mutedForeground} />
                  </View>
                  <View>
                    <Text style={[styles.rankName, { color: colors.foreground }, isMe && { fontWeight: '700' }]}>
                      {item.nome}{isMe ? ' (você)' : ''}
                    </Text>
                    <Text style={[styles.rankRole, { color: colors.mutedForeground }]}>
                      {item.role === 'lider' ? 'Líder Comunitário' : 'Morador'} · {item.bairro}
                    </Text>
                  </View>
                </View>
                <View style={styles.rankRight}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={[styles.rankPontos, { color: colors.foreground }]}>{item.pontos}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Como ganhar pontos */}
        <Text style={[styles.section, { color: colors.foreground }]}>Como Ganhar Pontos</Text>
        <View style={[styles.howCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { action: 'Relatar um problema', pts: '+50', icon: 'warning' as const },
            { action: 'Relato validado pela IA', pts: '+50', icon: 'shield-checkmark' as const },
            { action: 'Avaliar projeto concluído', pts: '+20', icon: 'star' as const },
            { action: 'Projeto executado com sucesso', pts: '+100', icon: 'trophy' as const },
          ].map((item, i) => (
            <View key={i} style={[styles.howItem, i < 3 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.howIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={item.icon} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.howText, { color: colors.foreground }]}>{item.action}</Text>
              <Text style={[styles.howPts, { color: colors.success }]}>{item.pts}</Text>
            </View>
          ))}
        </View>

        {/* Recompensas */}
        <Text style={[styles.section, { color: colors.foreground }]}>Troca de Pontos</Text>
        {RECOMPENSAS.map((r) => {
          const canRedeem = (user?.pontos ?? 0) >= r.pontos;
          return (
            <View key={r.id} style={[styles.rewardCard, { backgroundColor: colors.card, borderColor: canRedeem ? colors.success : colors.border }]}>
              <View style={[styles.rewardIcon, { backgroundColor: canRedeem ? colors.successLight : colors.muted }]}>
                <Ionicons name={r.icon} size={20} color={canRedeem ? colors.success : colors.mutedForeground} />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: colors.foreground }]}>{r.titulo}</Text>
                <View style={styles.rewardPtsRow}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={[styles.rewardPts, { color: colors.warning }]}>{r.pontos} pontos</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.redeemBtn, { backgroundColor: canRedeem ? colors.success : colors.muted }]}
                disabled={!canRedeem}
                activeOpacity={0.8}
              >
                <Text style={[styles.redeemText, { color: canRedeem ? '#FFFFFF' : colors.mutedForeground }]}>
                  {canRedeem ? 'Resgatar' : 'Bloqueado'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  myCard: { paddingHorizontal: 24, paddingBottom: 28 },
  myCardTitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 1 },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6, marginBottom: 4 },
  pointsValue: { fontSize: 48, fontWeight: '800', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  posText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12, fontFamily: 'Inter_400Regular' },
  nextGoal: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 10 },
  nextGoalInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nextGoalText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', flex: 1, fontFamily: 'Inter_400Regular' },
  content: { padding: 20 },
  section: { fontSize: 18, fontWeight: '800', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  rankingCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  rankItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rankLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rankPos: { width: 28, fontSize: 16, textAlign: 'center', fontFamily: 'Inter_700Bold' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  rankRole: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1 },
  rankRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rankPontos: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  howCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  howItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  howIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  howText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  howPts: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  rewardCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14, marginBottom: 10 },
  rewardIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  rewardPtsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  rewardPts: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  redeemBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  redeemText: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
