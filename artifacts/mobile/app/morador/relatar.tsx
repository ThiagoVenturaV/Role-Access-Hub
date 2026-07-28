import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Platform, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const CATEGORIAS = ['Infraestrutura', 'Iluminação', 'Saneamento', 'Espaços Públicos', 'Acessibilidade', 'Segurança', 'Saúde', 'Educação'];
const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Infraestrutura': 'construct', 'Iluminação': 'flashlight', 'Saneamento': 'water',
  'Espaços Públicos': 'leaf', 'Acessibilidade': 'accessibility', 'Segurança': 'shield',
  'Saúde': 'medkit', 'Educação': 'book',
};

export default function RelatarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, addPontos } = useAuth();
  const { addProblema } = useData();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const tabBarH = Platform.OS === 'web' ? 84 : 60;

  const canSubmit = titulo.trim().length > 3 && descricao.trim().length > 10 && !!categoria;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await addProblema({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria,
      status: 'pendente',
      criadoPor: user.name,
      bairro: user.bairro,
    });
    await addPontos(50);
    setLoading(false);
    setSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setSuccess(false);
      setTitulo('');
      setDescricao('');
      setCategoria('');
    }, 3000);
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarH + 20 }}
      keyboardShouldPersistTaps="handled"
      bottomOffset={20}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Relatar Problema</Text>
        <View style={styles.pointsHint}>
          <Ionicons name="star" size={14} color="#D97706" />
          <Text style={[styles.pointsHintText, { color: colors.warning }]}>+50 pts ao enviar</Text>
        </View>
      </View>

      {success ? (
        <View style={[styles.successBox, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
          <Ionicons name="checkmark-circle" size={40} color={colors.success} />
          <Text style={[styles.successTitle, { color: colors.success }]}>Relato enviado!</Text>
          <Text style={[styles.successSub, { color: colors.success }]}>Você ganhou +50 pontos. Obrigado pela sua participação!</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Category */}
          <Text style={[styles.label, { color: colors.foreground }]}>Categoria</Text>
          <View style={styles.categorias}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, { borderColor: categoria === cat ? colors.primary : colors.border, backgroundColor: categoria === cat ? colors.primaryLight : colors.card }]}
                onPress={() => { Haptics.selectionAsync(); setCategoria(cat); }}
                activeOpacity={0.7}
              >
                <Ionicons name={ICONS[cat] ?? 'alert-circle'} size={14} color={categoria === cat ? colors.primary : colors.mutedForeground} />
                <Text style={[styles.catText, { color: categoria === cat ? colors.primary : colors.mutedForeground }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text style={[styles.label, { color: colors.foreground }]}>Título do problema</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Ex: Buraco na Rua das Flores"
            placeholderTextColor={colors.mutedForeground}
            value={titulo}
            onChangeText={setTitulo}
            maxLength={80}
            returnKeyType="next"
          />

          {/* Description */}
          <Text style={[styles.label, { color: colors.foreground }]}>Descrição detalhada</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Descreva o problema com detalhes: onde fica, há quanto tempo existe, quem é afetado..."
            placeholderTextColor={colors.mutedForeground}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>{descricao.length}/500</Text>

          {/* Photo hint */}
          <View style={[styles.photoHint, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={[styles.photoHintText, { color: colors.primary }]}>
              Dica: Adicionar fotos aumenta a credibilidade do seu relato
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: canSubmit ? colors.primary : colors.muted }]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send" size={18} color={canSubmit ? '#FFFFFF' : colors.mutedForeground} />
                <Text style={[styles.submitText, { color: canSubmit ? '#FFFFFF' : colors.mutedForeground }]}>Enviar Relato</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  pointsHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  pointsHintText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, marginTop: 4, fontFamily: 'Inter_700Bold' },
  categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  catText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  input: { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 16, fontFamily: 'Inter_400Regular' },
  textArea: { height: 120, paddingTop: 12 },
  charCount: { fontSize: 12, textAlign: 'right', marginTop: -12, marginBottom: 16, fontFamily: 'Inter_400Regular' },
  photoHint: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  photoHintText: { flex: 1, fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  submitBtn: { borderRadius: 16, height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitText: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  successBox: { margin: 20, padding: 32, borderRadius: 20, alignItems: 'center', borderWidth: 1.5, gap: 12, marginTop: 60 },
  successTitle: { fontSize: 22, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  successSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, fontFamily: 'Inter_400Regular' },
});
