/**
 * PwaInstallBanner
 *
 * Detecta OS + browser e exibe um tutorial contextual de instalação de PWA.
 * Todos os ícones usam Ionicons (@expo/vector-icons) — sem emojis.
 *
 * Casos cobertos:
 *   iOS     + Safari               → tutorial Share → Adicionar à Tela Inicial
 *   iOS     + Chrome / Edge / FF   → instrução para abrir no Safari
 *   Android + Chrome / Edge /      → botão "Instalar" via beforeinstallprompt
 *             Samsung / Opera      → ou tutorial manual se o evento não disparar
 *   Android + Firefox              → tutorial menu ellipsis → Instalar
 *   Desktop + Chrome / Edge        → botão "Instalar" ou ícone na barra de endereços
 *   Desktop + Safari (macOS 17+)   → tutorial Arquivo → Adicionar ao Dock
 *   Desktop + Firefox / outros     → aviso de não suporte
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ─── Capture beforeinstallprompt before React mounts ─────────────────────────
let deferredPrompt: any = null;
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

// ─── Device / browser detection ──────────────────────────────────────────────
type OSKind = 'ios' | 'android' | 'desktop';
type BrowserKind =
  | 'safari'
  | 'chrome'
  | 'firefox'
  | 'edge'
  | 'samsung'
  | 'opera'
  | 'other';

function detectOS(): OSKind {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

function detectBrowser(): BrowserKind {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  // Order matters – Edge includes "Chrome", Samsung includes "Chrome"
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/OPR|Opera/i.test(ua)) return 'opera';
  if (/Edg\//i.test(ua)) return 'edge';
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox';
  if (/CriOS|Chrome/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua)) return 'safari';
  return 'other';
}

// ─── Tutorial content ─────────────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Step {
  icon: IoniconName;
  text: string;
}

interface Scenario {
  title: string;
  subtitle: string;
  steps?: Step[];
  canInstall: boolean;
  unsupported?: boolean;
  openSafari?: boolean;
}

function getScenario(os: OSKind, browser: BrowserKind): Scenario {
  // ── iOS ──────────────────────────────────────────────────────────────────
  if (os === 'ios') {
    if (browser === 'safari') {
      return {
        title: 'Instale o Pilar no iPhone',
        subtitle: 'Siga os passos abaixo no Safari:',
        canInstall: false,
        steps: [
          {
            icon: 'share-outline',
            text: 'Toque no ícone de Compartilhar na barra inferior do Safari',
          },
          {
            icon: 'arrow-down-outline',
            text: 'Role a lista e toque em "Adicionar à Tela Início"',
          },
          {
            icon: 'checkmark-outline',
            text: 'Confirme tocando em "Adicionar" no canto superior direito',
          },
        ],
      };
    }
    const name = browser.charAt(0).toUpperCase() + browser.slice(1);
    return {
      title: 'Instale pelo Safari',
      subtitle: `O ${name} no iPhone não suporta instalação de apps. Abra esta página no Safari para instalar o Pilar.`,
      canInstall: false,
      openSafari: true,
    };
  }

  // ── Android ──────────────────────────────────────────────────────────────
  if (os === 'android') {
    if (browser === 'firefox') {
      return {
        title: 'Instale o Pilar',
        subtitle: 'Siga os passos no Firefox:',
        canInstall: false,
        steps: [
          {
            icon: 'ellipsis-vertical-outline',
            text: 'Toque no menu de três pontos no canto superior direito',
          },
          {
            icon: 'add-outline',
            text: 'Toque em "Instalar"',
          },
          {
            icon: 'checkmark-outline',
            text: 'Confirme tocando em "Adicionar"',
          },
        ],
      };
    }

    if (deferredPrompt) {
      return {
        title: 'Instale o Pilar',
        subtitle: 'Acesse como app nativo, sem precisar abrir o navegador.',
        canInstall: true,
      };
    }

    const browserName =
      browser === 'samsung'
        ? 'Samsung Internet'
        : browser === 'opera'
        ? 'Opera'
        : browser === 'edge'
        ? 'Edge'
        : 'Chrome';
    return {
      title: 'Instale o Pilar',
      subtitle: `Siga os passos no ${browserName}:`,
      canInstall: false,
      steps: [
        {
          icon: 'ellipsis-vertical-outline',
          text: 'Toque no menu de três pontos no canto superior direito',
        },
        {
          icon: 'add-circle-outline',
          text: 'Toque em "Adicionar à tela inicial" ou "Instalar app"',
        },
        {
          icon: 'checkmark-outline',
          text: 'Confirme tocando em "Adicionar"',
        },
      ],
    };
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  if (browser === 'safari') {
    return {
      title: 'Instale o Pilar no Mac',
      subtitle: 'Disponível no Safari 17 ou superior:',
      canInstall: false,
      steps: [
        {
          icon: 'menu-outline',
          text: 'Clique no menu "Arquivo" na barra superior',
        },
        {
          icon: 'add-outline',
          text: 'Clique em "Adicionar ao Dock…"',
        },
        {
          icon: 'checkmark-outline',
          text: 'Confirme clicando em "Adicionar"',
        },
      ],
    };
  }

  if (browser === 'firefox') {
    return {
      title: 'Navegador sem suporte a PWA',
      subtitle:
        'O Firefox para desktop não suporta instalação de PWA. Tente pelo Chrome ou Edge para instalar o Pilar como app.',
      canInstall: false,
      unsupported: true,
    };
  }

  // Chrome / Edge desktop
  if (deferredPrompt) {
    return {
      title: 'Instale o Pilar',
      subtitle: 'Acesse como app nativo diretamente no seu computador.',
      canInstall: true,
    };
  }

  return {
    title: 'Instale o Pilar',
    subtitle: 'Procure o ícone de instalação na barra de endereços do navegador.',
    canInstall: false,
    steps: [
      {
        icon: 'download-outline',
        text: 'Clique no ícone de instalar na barra de endereços',
      },
      {
        icon: 'add-outline',
        text: 'Clique em "Instalar Pilar"',
      },
      {
        icon: 'checkmark-outline',
        text: 'Confirme na janela que abrir',
      },
    ],
  };
}

// ─── OS icon map ─────────────────────────────────────────────────────────────
const OS_ICON: Record<OSKind, IoniconName> = {
  ios: 'logo-apple',
  android: 'logo-android',
  desktop: 'desktop-outline',
};

const OS_LABEL: Record<OSKind, string> = {
  ios: 'iOS',
  android: 'Android',
  desktop: 'Desktop',
};

// ─── Dismiss key ─────────────────────────────────────────────────────────────
const DISMISS_KEY = '@pilar:pwa_dismissed';

// ─── Component ───────────────────────────────────────────────────────────────
export default function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(display-mode: standalone)').matches) return;

    try {
      const ts = localStorage.getItem(DISMISS_KEY);
      if (ts && Date.now() - parseInt(ts, 10) < 24 * 60 * 60 * 1000) return;
    } catch {}

    const delay = deferredPrompt ? 2000 : 3500;
    const timer = setTimeout(() => {
      setVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 55,
          friction: 11,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));

    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
    dismiss();
  };

  const copiarLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {}
    dismiss();
  };

  if (Platform.OS !== 'web' || !visible) return null;

  const os = detectOS();
  const browser = detectBrowser();
  const scenario = getScenario(os, browser);
  const isDesktop = os === 'desktop';

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.container,
          isDesktop && styles.containerDesktop,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          {/* Handle (mobile only) */}
          {!isDesktop && <View style={styles.handle} />}

          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={8}>
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={[styles.icon, isDesktop && styles.iconDesktop]}
            />
            <View style={styles.headerText}>
              <Text style={styles.title}>{scenario.title}</Text>
              <Text style={styles.subtitle}>{scenario.subtitle}</Text>
            </View>
          </View>

          {/* Steps */}
          {scenario.steps && scenario.steps.length > 0 && (
            <View style={styles.stepsContainer}>
              {scenario.steps.map((step, i) => (
                <View key={i} style={styles.step}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{i + 1}</Text>
                  </View>
                  <View style={styles.stepIconPill}>
                    <Ionicons name={step.icon} size={16} color="#93B4FF" />
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {scenario.canInstall && (
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={install}>
                <Ionicons name="download-outline" size={17} color="#fff" style={styles.btnIcon} />
                <Text style={styles.btnPrimaryText}>Instalar agora</Text>
              </Pressable>
            )}

            {scenario.openSafari && (
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={copiarLink}>
                <Ionicons name="clipboard-outline" size={17} color="#fff" style={styles.btnIcon} />
                <Text style={styles.btnPrimaryText}>Copiar link para abrir no Safari</Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.btn,
                scenario.canInstall || scenario.openSafari
                  ? styles.btnSecondary
                  : styles.btnPrimary,
              ]}
              onPress={dismiss}
            >
              <Text
                style={
                  scenario.canInstall || scenario.openSafari
                    ? styles.btnSecondaryText
                    : styles.btnPrimaryText
                }
              >
                {scenario.unsupported ? 'Entendi' : 'Agora não'}
              </Text>
            </Pressable>
          </View>

          {/* Device badge */}
          <View style={styles.deviceBadge}>
            <Ionicons name={OS_ICON[os]} size={11} color="rgba(255,255,255,0.28)" />
            <Text style={styles.deviceBadgeText}>
              {OS_LABEL[os]} · {browser.charAt(0).toUpperCase() + browser.slice(1)}
            </Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute' as any,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 9998,
  },
  container: {
    position: 'absolute' as any,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  containerDesktop: {
    bottom: 24,
    left: 'auto' as any,
    right: 24,
    width: 380,
  },
  card: {
    backgroundColor: '#162448',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardDesktop: {
    borderRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 18,
  },
  closeBtn: {
    position: 'absolute' as any,
    top: 14,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
    paddingRight: 36,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 13,
  },
  iconDesktop: {
    width: 44,
    height: 44,
    borderRadius: 11,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  stepsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1A56DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepIconPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(26,86,219,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  actions: {
    gap: 9,
  },
  btn: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnIcon: {
    marginRight: 2,
  },
  btnPrimary: {
    backgroundColor: '#1A56DB',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  btnSecondaryText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    fontWeight: '500',
  },
  deviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 14,
  },
  deviceBadgeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
  },
});
