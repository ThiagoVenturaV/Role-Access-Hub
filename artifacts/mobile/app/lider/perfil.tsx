import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import * as Haptics from 'expo-haptics';

const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#F5F3FF';

const BADGES = [
  { icon: 'star' as const, label: 'Líder Ativo', desc: '1 projeto liderado', color: '#D97706' },
  { icon: 'people' as const, label: 'Mobilizador', desc: 'Equipe formada', color: PURPLE },
  { icon: 'trophy' as const, label: 'Projeto Concluído', desc: 'Resultado entregue', color: '#16A34A' },
];

export default function LiderPerfil() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const myProjects = projetos.filter((p) => p.lider === user?.name);
  const completedProjects = myProjects.filter((p) => p.status === 'concluido');
  const totalMembers = myProjects.reduce((a, p) => a + p.membros.length, 0);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#2E1065', '#5B21B6']} style={[styles.header, { paddingTop: insets.top + webTopPad + 24 }]}>
        <View style={styles.avatarRing}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Líder Comunitário · Pilar</Text>
        <View style={styles.ptsChip}>
          <Ionicons name="star" size={14} color="#FCD34D" />
          <Text style={styles.ptsText}>{user?.pontos} pts</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          {[
            { label: 'Projetos Liderados', value: myProjects.length, icon: 'layers' as const, color: PURPLE },
            { label: 'Concluídos', value: completedProjects.length, icon: 'trophy' as const, color: colors.success },
            { label: 'Membros Totais', value: totalMembers, icon: 'people' as const, color: colors.primary },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.section, { color: colors.foreground }]}>Conquistas</Text>
        <View style={styles.badges}>
          {BADGES.map((b, i) => (
            <View key={i} style={[styles.badge, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.badgeIcon, { backgroundColor: b.color + '22' }]}>
                <Ionicons name={b.icon} size={20} color={b.color} />
              </View>
              <Text style={[styles.badgeLabel, { color: colors.foreground }]}>{b.label}</Text>
              <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]}>{b.desc}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'notifications-outline' as const, label: 'Notificações' },
            { icon: 'share-social-outline' as const, label: 'Compartilhar perfil' },
            { icon: 'help-circle-outline' as const, label: 'Suporte' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingsItem, i < 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={20} color={colors.mutedForeground} />
              <Text style={[styles.settingsLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.destructive }]} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingBottom: 28 },
  avatarRing: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3, fontFamily: 'Inter_400Regular' },
  ptsChip: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  ptsText: { fontSize: 15, fontWeight: '700', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1 },
  statVal: { fontSize: 20, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  section: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  badges: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  badge: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1 },
  badgeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center', fontFamily: 'Inter_700Bold' },
  badgeDesc: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  settingsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingsLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  logoutText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
