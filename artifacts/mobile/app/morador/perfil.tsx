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

export default function MoradorPerfil() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { problemas, projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const myProblemas = problemas.filter(p => p.criadoPor === user?.name);
  const resolvedProblemas = myProblemas.filter(p => p.status === 'resolvido');

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/');
  };

  const HISTORY = [
    { action: 'Relato enviado', pts: '+50', date: '10/06/2025', icon: 'warning' as const },
    { action: 'Relato validado', pts: '+50', date: '10/06/2025', icon: 'shield-checkmark' as const },
    { action: 'Cadastro na plataforma', pts: '+50', date: '01/06/2025', icon: 'person-add' as const },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#1A3A7A', '#0F2D6B']} style={[styles.header, { paddingTop: insets.top + webTopPad + 24 }]}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Morador · {user?.bairro}</Text>
        <View style={styles.pontosRow}>
          <Ionicons name="star" size={16} color="#FCD34D" />
          <Text style={styles.pontosVal}>{user?.pontos} pontos</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Relatos', value: myProblemas.length, icon: 'warning' as const, color: colors.primary },
            { label: 'Resolvidos', value: resolvedProblemas.length, icon: 'checkmark-circle' as const, color: colors.success },
            { label: 'Pontos', value: user?.pontos ?? 0, icon: 'star' as const, color: '#D97706' },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Histórico de Pontos</Text>
        <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {HISTORY.map((h, i) => (
            <View key={i} style={[styles.historyItem, i < HISTORY.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={[styles.histIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={h.icon} size={14} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.histAction, { color: colors.foreground }]}>{h.action}</Text>
                <Text style={[styles.histDate, { color: colors.mutedForeground }]}>{h.date}</Text>
              </View>
              <Text style={[styles.histPts, { color: colors.success }]}>{h.pts}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Configurações</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'notifications-outline' as const, label: 'Notificações' },
            { icon: 'location-outline' as const, label: 'Bairro' },
            { icon: 'help-circle-outline' as const, label: 'Ajuda e Suporte' },
            { icon: 'document-text-outline' as const, label: 'Termos de Uso' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingsItem, i < 3 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]} activeOpacity={0.7}>
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
  header: { alignItems: 'center', paddingBottom: 28, paddingHorizontal: 20 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3, fontFamily: 'Inter_400Regular' },
  pontosRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  pontosVal: { fontSize: 15, fontWeight: '700', color: '#FCD34D', fontFamily: 'Inter_700Bold' },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 5, borderWidth: 1 },
  statValue: { fontSize: 20, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  historyCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  histIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  histAction: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  histDate: { fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
  histPts: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  settingsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingsLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  logoutText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
