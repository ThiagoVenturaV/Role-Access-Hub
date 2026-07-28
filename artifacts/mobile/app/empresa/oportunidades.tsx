import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useData } from '@/contexts/DataContext';

const TEAL = '#0D9488';
const TEAL_LIGHT = '#F0FDFA';

const AREAS = ['Todas', 'Infraestrutura', 'Educação', 'Meio Ambiente', 'Saúde', 'Tecnologia'];

export default function EmpresaOportunidades() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { projetos } = useData();
  const [area, setArea] = useState('Todas');
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const available = projetos.filter((p) => ['proposta', 'prototipo', 'teste', 'aprovado'].includes(p.status));

  const ESG_BENEFITS = [
    { icon: 'leaf' as const, label: 'Impacto Ambiental', value: 'ESG Verificado' },
    { icon: 'people' as const, label: 'Impacto Social', value: 'Medido e Documentado' },
    { icon: 'shield-checkmark' as const, label: 'Credibilidade', value: 'Prefeitura Parceira' },
    { icon: 'star' as const, label: 'Visibilidade', value: 'Plataforma Pública' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Oportunidades</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{available.length} projetos disponíveis para parceria</Text>
      </View>

      {/* ESG Benefits */}
      <View style={styles.esgBanner}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingVertical: 14 }}>
          {ESG_BENEFITS.map((b) => (
            <View key={b.label} style={[styles.esgCard, { backgroundColor: TEAL_LIGHT, borderColor: TEAL + '33' }]}>
              <Ionicons name={b.icon} size={18} color={TEAL} />
              <Text style={[styles.esgLabel, { color: TEAL }]}>{b.label}</Text>
              <Text style={[styles.esgValue, { color: TEAL + 'AA' }]}>{b.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Area filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {AREAS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.filterChip, { backgroundColor: area === a ? TEAL : colors.muted }]}
            onPress={() => { Haptics.selectionAsync(); setArea(a); }}
          >
            <Text style={[styles.filterText, { color: area === a ? '#FFFFFF' : colors.mutedForeground }]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {available.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="briefcase-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhuma oportunidade disponível no momento</Text>
          </View>
        )}

        {available.map((p) => (
          <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <View style={[styles.cardBadge, { backgroundColor: TEAL_LIGHT }]}>
                <Ionicons name="handshake" size={12} color={TEAL} />
                <Text style={[styles.cardBadgeText, { color: TEAL }]}>Parceria Aberta</Text>
              </View>
              <View style={styles.votosChip}>
                <Ionicons name="people" size={12} color={colors.mutedForeground} />
                <Text style={[styles.votosText, { color: colors.mutedForeground }]}>{p.membros.length} membros</Text>
              </View>
            </View>

            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.titulo}</Text>
            <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={3}>{p.descricao}</Text>

            {/* What the company does */}
            <View style={[styles.roleBox, { backgroundColor: TEAL_LIGHT, borderColor: TEAL + '33' }]}>
              <Text style={[styles.roleTitle, { color: TEAL }]}>O que a empresa pode fazer:</Text>
              <Text style={[styles.roleText, { color: TEAL + 'CC' }]}>
                Investir em impacto social, encontrar talentos locais, apoiar projetos comunitários e desenvolver ações ESG com resultados mensuráveis.
              </Text>
            </View>

            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Ionicons name="person" size={13} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Líder: {p.lider}</Text>
              </View>
              {p.prazo && (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Prazo: {p.prazo}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={[styles.cta, { backgroundColor: TEAL }]} activeOpacity={0.85}>
              <Ionicons name="briefcase" size={15} color="#FFFFFF" />
              <Text style={styles.ctaText}>Manifestar Interesse</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* IES Section */}
        <View style={[styles.iesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.iesTitle, { color: colors.foreground }]}>Instituições de Ensino (IES)</Text>
          <Text style={[styles.iesText, { color: colors.mutedForeground }]}>
            O Pilar é um território vivo para projetos de extensão, pesquisa aplicada, residências, estágios e desenvolvimento de soluções com benefício concreto para a comunidade.
          </Text>
          <View style={styles.iesBenefits}>
            {['Pesquisa aplicada', 'Estágios supervisionados', 'Projetos de extensão', 'Publicações científicas'].map((b, i) => (
              <View key={i} style={[styles.iesBenefit, { backgroundColor: TEAL_LIGHT }]}>
                <Ionicons name="checkmark" size={12} color={TEAL} />
                <Text style={[styles.iesBenefitText, { color: TEAL }]}>{b}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.iesBtn, { borderColor: TEAL }]} activeOpacity={0.8}>
            <Ionicons name="school" size={16} color={TEAL} />
            <Text style={[styles.iesBtnText, { color: TEAL }]}>Saiba mais sobre parcerias IES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, marginTop: 2, fontFamily: 'Inter_400Regular' },
  esgBanner: {},
  esgCard: { borderRadius: 12, padding: 12, gap: 4, borderWidth: 1, width: 140 },
  esgLabel: { fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  esgValue: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  filters: { paddingHorizontal: 20, paddingBottom: 14, gap: 8 },
  filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  empty: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  cardBadgeText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  votosChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  votosText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, fontFamily: 'Inter_700Bold' },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: 'Inter_400Regular' },
  roleBox: { borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1 },
  roleTitle: { fontSize: 12, fontWeight: '700', marginBottom: 3, fontFamily: 'Inter_700Bold' },
  roleText: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  meta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  cta: { borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  iesCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 4 },
  iesTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, fontFamily: 'Inter_700Bold' },
  iesText: { fontSize: 13, lineHeight: 18, marginBottom: 12, fontFamily: 'Inter_400Regular' },
  iesBenefits: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  iesBenefit: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  iesBenefitText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  iesBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1.5, borderRadius: 12, paddingVertical: 10 },
  iesBtnText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
});
