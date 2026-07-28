import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth, UserRole } from '@/contexts/AuthContext';

const ROLES: { key: UserRole; label: string; sublabel: string; icon: keyof typeof Ionicons.glyphMap; color: string; gradient: [string, string] }[] = [
  { key: 'morador', label: 'Morador', sublabel: 'Reporte problemas e acompanhe projetos', icon: 'home', color: '#1A56DB', gradient: ['#1A56DB', '#2563EB'] },
  { key: 'lider', label: 'Líder Comunitário', sublabel: 'Lidere projetos e mobilize sua comunidade', icon: 'people', color: '#7C3AED', gradient: ['#7C3AED', '#8B5CF6'] },
  { key: 'empresa', label: 'Empresa / IES', sublabel: 'Co-crie soluções com impacto social', icon: 'business', color: '#0D9488', gradient: ['#0D9488', '#0F9B8E'] },
  { key: 'prefeitura', label: 'Prefeitura', sublabel: 'Gerencie demandas e aprove projetos', icon: 'shield-checkmark', color: '#B45309', gradient: ['#B45309', '#D97706'] },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    Haptics.selectionAsync();
    setSelectedRole(role);
  };

  const handleLogin = async () => {
    if (!selectedRole || !name.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await login(name.trim(), selectedRole);
    router.replace(`/${selectedRole}` as any);
    setLoading(false);
  };

  const canLogin = !!selectedRole && name.trim().length > 1;
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <LinearGradient colors={['#0F1F45', '#1A3A7A', '#0F2D6B']} style={styles.gradient}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40 + webTopPad, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Ionicons name="business" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>PILAR</Text>
            <Text style={styles.appTagline}>Plataforma de Inovação Local Articulada em Recife</Text>
          </View>

          {/* Role Selection */}
          <Text style={styles.sectionLabel}>Selecione seu perfil</Text>
          <View style={styles.rolesGrid}>
            {ROLES.map((r) => {
              const selected = selectedRole === r.key;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.roleCard, selected && { borderColor: r.color, borderWidth: 2 }]}
                  onPress={() => handleRoleSelect(r.key)}
                  activeOpacity={0.8}
                >
                  {selected && (
                    <View style={[styles.roleCardSelected, { backgroundColor: r.color }]} />
                  )}
                  <LinearGradient
                    colors={selected ? r.gradient : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={styles.roleCardGradient}
                  >
                    <View style={[styles.roleIcon, { backgroundColor: selected ? 'rgba(255,255,255,0.2)' : r.color + '22' }]}>
                      <Ionicons name={r.icon} size={22} color={selected ? '#FFFFFF' : r.color} />
                    </View>
                    <Text style={[styles.roleLabel, selected && styles.roleLabelSelected]}>{r.label}</Text>
                    <Text style={[styles.roleSub, selected && styles.roleSubSelected]} numberOfLines={2}>{r.sublabel}</Text>
                  </LinearGradient>
                  {selected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={20} color={r.color} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seu nome</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Como posso te chamar?"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, !canLogin && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={!canLogin || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Entrar na plataforma</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.footer}>Pilar · Prefeitura do Recife · 2025</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appName: { fontSize: 38, fontWeight: '800', color: '#FFFFFF', letterSpacing: 8, fontFamily: 'Inter_700Bold' },
  appTagline: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 6, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Inter_600SemiBold' },
  rolesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  roleCard: {
    width: '47.5%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  roleCardSelected: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 1 },
  roleCardGradient: { padding: 14, minHeight: 110 },
  roleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  roleLabel: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  roleLabelSelected: { color: '#FFFFFF' },
  roleSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 15, fontFamily: 'Inter_400Regular' },
  roleSubSelected: { color: 'rgba(255,255,255,0.75)' },
  checkmark: { position: 'absolute', top: 8, right: 8 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontFamily: 'Inter_600SemiBold' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 52, color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_400Regular' },
  loginBtn: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)', shadowOpacity: 0 },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter_400Regular' },
});
