import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const TEAL = '#0D9488';
const TEAL_LIGHT = '#F0FDFA';

export default function EmpresaHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { projetos } = useData();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const myPartnerships = projetos.filter((p) => p.empresa === user?.name || p.empresa);
  const openProjects = projetos.filter((p) => !p.empresa && ['proposta', 'prototipo'].includes(p.status));

  const IMPACT = [
    { icon: 'people' as const, value: '1.2k', label: 'Pessoas Impactadas' },
    { icon: 'layers' as const, value: myPartnerships.length.toString(), label: 'Parcerias Ativas' },
    { icon: 'star' as const, value: '95%', label: 'Satisfação' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#042F2E', '#0D9488']} style={[styles.header, { paddingTop: insets.top + webTopPad + 20 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bem-vindo, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.sub}>Empresa / IES · Pilar</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
            <Ionicons name="business" size={14} color="#FFFFFF" />
            <Text style={styles.chipText}>Parceiro</Text>
          </View>
        </View>

        <View style={styles.impactRow}>
          {IMPACT.map((i) => (
            <View key={i.label} style={styles.impactItem}>
              <Ionicons name={i.icon} size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.impactValue}>{i.value}</Text>
              <Text style={styles.impactLabel}>{i.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Why partner */}
        <View style={[styles.whyCard, { backgroundColor: TEAL_LIGHT, borderColor: TEAL + '44' }]}>
          <Ionicons name="flash" size={20} color={TEAL} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.whyTitle, { color: TEAL }]}>Por que se tornar parceiro?</Text>
            <Text style={[styles.whyText, { color: TEAL + 'CC' }]}>
              Co-crie soluções com impacto social medido, ganhe visibilidade na comunidade, acesse talentos locais e desenvolva ações ESG com resultados concretos.
            </Text>
          </View>
        </View>

        {/* Open opportunities */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Oportunidades Abertas</Text>
          <TouchableOpacity onPress={() => router.navigate('/empresa/oportunidades')}>
            <Text style={[styles.seeAll, { color: TEAL }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {openProjects.slice(0, 2).map((p) => (
          <View key={p.id} style={[styles.projCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.projTag, { backgroundColor: TEAL_LIGHT }]}>
              <Text style={[styles.projTagText, { color: TEAL }]}>Co-criação disponível</Text>
            </View>
            <Text style={[styles.projTitle, { color: colors.foreground }]}>{p.titulo}</Text>
            <Text style={[styles.projDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{p.descricao}</Text>
            <View style={styles.projMeta}>
              <Ionicons name="people" size={13} color={colors.mutedForeground} />
              <Text style={[styles.projMetaText, { color: colors.mutedForeground }]}>{p.membros.length} membros · {p.bairro}</Text>
            </View>
            <TouchableOpacity style={[styles.partnerBtn, { backgroundColor: TEAL }]} activeOpacity={0.85}>
              <Ionicons name="people" size={15} color="#FFFFFF" />
              <Text style={styles.partnerBtnText}>Quero Parcerizar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {openProjects.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="briefcase-outline" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhuma oportunidade aberta no momento</Text>
          </View>
        )}

        {/* My partnerships */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>Parcerias da Plataforma</Text>
        {myPartnerships.slice(0, 2).map((p) => (
          <View key={p.id} style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.partnerIcon, { backgroundColor: TEAL_LIGHT }]}>
              <Ionicons name="layers" size={18} color={TEAL} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.partnerTitle, { color: colors.foreground }]}>{p.titulo}</Text>
              <Text style={[styles.partnerSub, { color: colors.mutedForeground }]}>
                {p.status === 'concluido' ? 'Concluído' : p.status === 'execucao' ? 'Em execução' : 'Em andamento'} · {p.empresa ?? 'Empresa'}
              </Text>
            </View>
            <Ionicons name={p.status === 'concluido' ? 'checkmark-circle' : 'time'} size={20} color={p.status === 'concluido' ? colors.success : TEAL} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontFamily: 'Inter_400Regular' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },
  impactRow: { flexDirection: 'row', justifyContent: 'space-around' },
  impactItem: { alignItems: 'center', gap: 4 },
  impactValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  impactLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_400Regular', textAlign: 'center' },
  content: { padding: 20 },
  whyCard: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1 },
  whyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  whyText: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  projCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  projTag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8 },
  projTagText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  projTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, fontFamily: 'Inter_700Bold' },
  projDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: 'Inter_400Regular' },
  projMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12 },
  projMetaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  partnerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 10 },
  partnerBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10, marginBottom: 20 },
  emptyText: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  partnerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1 },
  partnerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  partnerTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  partnerSub: { fontSize: 12, marginTop: 2, fontFamily: 'Inter_400Regular' },
});
