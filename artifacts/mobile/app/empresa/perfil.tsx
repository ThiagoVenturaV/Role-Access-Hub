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

const TEAL = '#0D9488';
const TEAL_LIGHT = '#F0FDFA';

export default function EmpresaPerfil() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const partnerships = projetos.filter(p => p.empresa);
  const active = partnerships.filter(p => p.status !== 'concluido');
  const completed = partnerships.filter(p => p.status === 'concluido');

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
      <LinearGradient colors={['#042F2E', '#0D9488']} style={[styles.header, { paddingTop: insets.top + webTopPad + 24 }]}>
        <View style={styles.avatar}>
          <Ionicons name="business" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Empresa / IES · Parceiro Pilar</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          {[
            { label: 'Parcerias Ativas', value: active.length, icon: 'layers' as const, color: TEAL },
            { label: 'Concluídas', value: completed.length, icon: 'checkmark-circle' as const, color: colors.success },
            { label: 'Pessoas Impactadas', value: '1.2k', icon: 'people' as const, color: colors.primary },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.esgCard, { backgroundColor: TEAL_LIGHT, borderColor: TEAL + '44' }]}>
          <Ionicons name="leaf" size={20} color={TEAL} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.esgTitle, { color: TEAL }]}>Relatório ESG</Text>
            <Text style={[styles.esgText, { color: TEAL + 'AA' }]}>Acesse o relatório de impacto social das suas parcerias no Pilar.</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={TEAL} />
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'document-text-outline' as const, label: 'Relatório de Impacto' },
            { icon: 'notifications-outline' as const, label: 'Notificações' },
            { icon: 'people-outline' as const, label: 'Gerenciar Parcerias' },
            { icon: 'help-circle-outline' as const, label: 'Suporte Empresarial' },
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
  header: { alignItems: 'center', paddingBottom: 28, gap: 6 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular' },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1 },
  statVal: { fontSize: 18, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  esgCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1 },
  esgTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2, fontFamily: 'Inter_700Bold' },
  esgText: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  settingsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingsLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  logoutText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
