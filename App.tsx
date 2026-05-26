import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation, type WebViewProps } from "react-native-webview";

const APP_URL = "https://mka007-dev.github.io/squad-link/preview.html?ios=1";
const TRUSTED_HOSTS = new Set(["mka007-dev.github.io"]);

function hostnameFrom(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function LoadingView() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#baff29" />
      <Text style={styles.overlayText}>Loading LobbyRush</Text>
    </View>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.errorWrap}>
      <View style={styles.errorIcon}>
        <Ionicons name="cloud-offline-outline" size={34} color="#baff29" />
      </View>
      <Text style={styles.errorTitle}>Connection lost</Text>
      <Text style={styles.errorBody}>Check your internet connection, then reload the app.</Text>
      <Pressable style={styles.primaryButton} onPress={onRetry}>
        <Ionicons name="refresh" size={18} color="#07100b" />
        <Text style={styles.primaryButtonText}>Reload</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const reload = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };

  const handleShouldStartLoad: NonNullable<WebViewProps["onShouldStartLoadWithRequest"]> = (request) => {
    const host = hostnameFrom(request.url);
    if (!request.url.startsWith("http")) return true;
    if (TRUSTED_HOSTS.has(host)) return true;

    Linking.openURL(request.url).catch(() => undefined);
    return false;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Ionicons name="game-controller" size={18} color="#07100b" />
            </View>
            <View>
              <Text style={styles.brandName}>LobbyRush</Text>
              <Text style={styles.brandStatus}>iPhone preview</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Go back"
              disabled={!canGoBack}
              style={[styles.iconButton, !canGoBack && styles.iconDisabled]}
              onPress={() => webViewRef.current?.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#eef7ee" />
            </Pressable>
            <Pressable accessibilityLabel="Reload" style={styles.iconButton} onPress={reload}>
              <Ionicons name="refresh" size={19} color="#eef7ee" />
            </Pressable>
          </View>
        </View>
        <View style={styles.webWrap}>
          {hasError ? (
            <ErrorView onRetry={reload} />
          ) : (
            <>
              <WebView
                ref={webViewRef}
                source={{ uri: APP_URL }}
                style={styles.webView}
                originWhitelist={["https://*", "http://*"]}
                javaScriptEnabled
                domStorageEnabled
                sharedCookiesEnabled
                thirdPartyCookiesEnabled
                allowsInlineMediaPlayback
                allowsBackForwardNavigationGestures
                mediaPlaybackRequiresUserAction={false}
                pullToRefreshEnabled={Platform.OS === "android"}
                setSupportMultipleWindows={false}
                applicationNameForUserAgent="LobbyRush iOS"
                onShouldStartLoadWithRequest={handleShouldStartLoad}
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
                renderLoading={LoadingView}
                startInLoadingState
              />
              {isLoading && <LoadingView />}
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#07090d"
  },
  topBar: {
    minHeight: 66,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "#07090d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  brand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#baff29",
    alignItems: "center",
    justifyContent: "center"
  },
  brandName: {
    color: "#f7fff5",
    fontSize: 17,
    fontWeight: "900"
  },
  brandStatus: {
    color: "#8e9a8e",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 1
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#11161d",
    alignItems: "center",
    justifyContent: "center"
  },
  iconDisabled: {
    opacity: 0.38
  },
  webWrap: {
    flex: 1,
    backgroundColor: "#080a0f"
  },
  webView: {
    flex: 1,
    backgroundColor: "#080a0f"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    backgroundColor: "#080a0f",
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  overlayText: {
    color: "#dfe9df",
    fontSize: 13,
    fontWeight: "800"
  },
  errorWrap: {
    flex: 1,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080a0f"
  },
  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#11161d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18
  },
  errorTitle: {
    color: "#f7fff5",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center"
  },
  errorBody: {
    maxWidth: 270,
    color: "#9aa59a",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18
  },
  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#baff29",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  primaryButtonText: {
    color: "#07100b",
    fontSize: 14,
    fontWeight: "900"
  }
});
