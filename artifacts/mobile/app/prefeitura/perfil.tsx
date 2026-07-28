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

const AMBER = '#B45309';

export default function PrefeituraPerfil() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { problemas, projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const approvedProjects = projetos.filter(p => p.status === 'aprovado' || p.status === 'execucao' || p.status === 'concluido');
  const validated = problemas.filter(p => p.validado);

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
      <LinearGradient colors={['#451A03', '#B45309']} style={[styles.header, { paddingTop: insets.top + webTopPad + 24 }]}>
        <View style={styles.shield}>
          <Ionicons name="shield" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Gestão Municipal · Prefeitura do Recife</Text>
        <Text style={styles.cargo}>Bairro do Pilar</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          {[
            { label: 'Demandas Gerenciadas', value: problemas.length, icon: 'warning' as const, color: AMBER },
            { label: 'Projetos Aprovados', value: approvedProjects.length, icon: 'checkmark-circle' as const, color: colors.success },
            { label: 'Relatos Validados', value: validated.length, icon: 'shield-checkmark' as const, color: colors.primary },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: '#FFFBEB', borderColor: AMBER + '44' }]}>
          <Ionicons name="information-circle" size={18} color={AMBER} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: AMBER }]}>Sobre a plataforma</Text>
            <Text style={[styles.infoText, { color: AMBER + 'BB' }]}>
              O Pilar transforma demandas comunitárias em soluções colaborativas. A Prefeitura usa inteligência territorial exclusiva para identificar prioridades e planejar ações.
            </Text>
          </View>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'notifications-outline' as const, label: 'Notificações e Alertas' },
            { icon: 'people-outline' as const, label: 'Gerenciar Equipe' },
            { icon: 'document-text-outline' as const, label: 'Relatório Semestral' },
            { icon: 'shield-outline' as const, label: 'Configurações de Acesso' },
            { icon: 'help-circle-outline' as const, label: 'Suporte Técnico' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.settingsItem, i < 4 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]} activeOpacity={0.7}>
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
  shield: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  cargo: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter_400Regular' },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1 },
  statVal: { fontSize: 18, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1 },
  infoTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  infoText: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  settingsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingsLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  logoutText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
