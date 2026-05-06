import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { FlatList, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type GameKey = "fifa" | "gta" | "warzone";

type Post = {
  id: string;
  game: GameKey;
  title: string;
  body: string;
  meta: string;
  replies: number;
};

type Squad = {
  id: string;
  game: GameKey;
  name: string;
  need: string;
  region: string;
  vibe: string;
};

const games: Record<GameKey, { label: string; accent: string; image: string }> = {
  fifa: {
    label: "FIFA",
    accent: "#38d26f",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"
  },
  gta: {
    label: "GTA",
    accent: "#ffb84d",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
  },
  warzone: {
    label: "Warzone",
    accent: "#57a6ff",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
  }
};

const posts: Post[] = [
  {
    id: "1",
    game: "warzone",
    title: "Ranked resurgence squad tonight",
    body: "Need two players who communicate, rotate early, and can play after 8 PM.",
    meta: "NA East - Mic required - Diamond push",
    replies: 18
  },
  {
    id: "2",
    game: "fifa",
    title: "Weekend league tactics thread",
    body: "Drop your formation, depth, and one adjustment that saved your weekend.",
    meta: "Ultimate Team - Competitive",
    replies: 42
  },
  {
    id: "3",
    game: "gta",
    title: "Clean car meet and cruise",
    body: "No griefing, no rockets, just builds, photos, and a coast run.",
    meta: "Los Santos - Casual lobby",
    replies: 27
  }
];

const squads: Squad[] = [
  {
    id: "s1",
    game: "warzone",
    name: "Harbor Rotate",
    need: "2 slayers",
    region: "NA East",
    vibe: "Competitive"
  },
  {
    id: "s2",
    game: "fifa",
    name: "Elite XI Lab",
    need: "Friendly grinders",
    region: "UK/EU",
    vibe: "Tactics"
  },
  {
    id: "s3",
    game: "gta",
    name: "Midnight Motors",
    need: "Hosts and photographers",
    region: "Global",
    vibe: "Creative"
  }
];

const events = [
  { id: "e1", title: "Warzone Customs", game: "warzone" as GameKey, time: "Fri 9:00 PM", spots: "8 spots" },
  { id: "e2", title: "FIFA Draft Night", game: "fifa" as GameKey, time: "Sat 6:30 PM", spots: "12 spots" },
  { id: "e3", title: "GTA Heist Chain", game: "gta" as GameKey, time: "Sun 7:00 PM", spots: "4 crews" }
];

const Tab = createBottomTabNavigator();

function Shell({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safe}>{children}</SafeAreaView>;
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <Shell>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.page}
        ListHeaderComponent={
          <>
            <ImageBackground source={{ uri: games.warzone.image }} imageStyle={styles.heroImage} style={styles.hero}>
              <View style={styles.heroShade}>
                <Text style={styles.kicker}>SquadLink</Text>
                <Text style={styles.heroTitle}>Find players, crews, and matches without the chaos.</Text>
                <View style={styles.heroActions}>
                  <Pressable style={styles.primaryButton}>
                    <Ionicons name="add" size={18} color="#101217" />
                    <Text style={styles.primaryButtonText}>Create post</Text>
                  </Pressable>
                  <Pressable style={styles.iconButton}>
                    <Ionicons name="search" size={20} color="#f4f7fb" />
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.gameRail}>
              {(Object.keys(games) as GameKey[]).map((key) => (
                <ImageBackground key={key} source={{ uri: games[key].image }} imageStyle={styles.gameImage} style={styles.gameTile}>
                  <View style={styles.gameShade}>
                    <Chip label={games[key].label} color={games[key].accent} />
                  </View>
                </ImageBackground>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Live Feed</Text>
          </>
        }
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </Shell>
  );
}

function PostCard({ post }: { post: Post }) {
  const game = games[post.game];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Chip label={game.label} color={game.accent} />
        <Text style={styles.meta}>{post.meta}</Text>
      </View>
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.row}>
          <Ionicons name="chatbubble-outline" size={16} color="#9aa4b2" />
          <Text style={styles.meta}>{post.replies} replies</Text>
        </View>
        <Pressable style={styles.joinButton}>
          <Text style={styles.joinText}>Join</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SquadsScreen() {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Squads</Text>
            <Text style={styles.subtle}>Match with players by game, region, and vibe.</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <Ionicons name="options-outline" size={20} color="#f4f7fb" />
          </Pressable>
        </View>
        {squads.map((squad) => (
          <View key={squad.id} style={styles.squadCard}>
            <View style={[styles.sideAccent, { backgroundColor: games[squad.game].accent }]} />
            <View style={styles.squadContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{squad.name}</Text>
                <Chip label={games[squad.game].label} color={games[squad.game].accent} />
              </View>
              <View style={styles.statGrid}>
                <Info label="Looking for" value={squad.need} />
                <Info label="Region" value={squad.region} />
                <Info label="Style" value={squad.vibe} />
              </View>
              <Pressable style={styles.fullButton}>
                <Text style={styles.fullButtonText}>Request invite</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </Shell>
  );
}

function EventsScreen() {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.screenTitle}>Events</Text>
        <Text style={styles.subtle}>Custom lobbies, tournaments, car meets, and co-op sessions.</Text>
        {events.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <View style={[styles.eventDate, { borderColor: games[event.game].accent }]}>
              <Ionicons name="calendar-outline" size={22} color={games[event.game].accent} />
            </View>
            <View style={styles.eventCopy}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.meta}>{event.time} - {event.spots}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa4b2" />
          </View>
        ))}
      </ScrollView>
    </Shell>
  );
}

function ProfileScreen() {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SL</Text>
          </View>
          <Text style={styles.screenTitle}>Your Hub</Text>
          <Text style={styles.subtleCenter}>Build a card with your games, rank, platforms, mic preference, and availability.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Player Tags</Text>
          <View style={styles.tagWrap}>
            <Chip label="PS5" color="#57a6ff" />
            <Chip label="Xbox" color="#38d26f" />
            <Chip label="PC" color="#ffb84d" />
            <Chip label="Mic on" color="#f06292" />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Next features</Text>
          <Text style={styles.body}>Account sign-in, direct messages, squad invites, moderation tools, push notifications, and real backend storage.</Text>
        </View>
      </ScrollView>
    </Shell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#f4f7fb",
        tabBarInactiveTintColor: "#7d8794",
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Feed: "planet-outline",
            Squads: "people-outline",
            Events: "calendar-outline",
            Profile: "person-circle-outline"
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Feed" component={HomeScreen} />
      <Tab.Screen name="Squads" component={SquadsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#101217"
  },
  page: {
    padding: 18,
    paddingBottom: 110,
    gap: 16
  },
  hero: {
    minHeight: 310,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#1c2028"
  },
  heroImage: {
    borderRadius: 8
  },
  heroShade: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(16, 18, 23, 0.42)"
  },
  kicker: {
    color: "#d9ff66",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: "#f4f7fb",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    marginTop: 8
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18
  },
  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#d9ff66",
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  primaryButtonText: {
    color: "#101217",
    fontWeight: "900"
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202530"
  },
  gameRail: {
    flexDirection: "row",
    gap: 10
  },
  gameTile: {
    flex: 1,
    aspectRatio: 0.9,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#1c2028"
  },
  gameImage: {
    borderRadius: 8
  },
  gameShade: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "rgba(16, 18, 23, 0.28)"
  },
  sectionTitle: {
    color: "#f4f7fb",
    fontSize: 18,
    fontWeight: "900"
  },
  screenTitle: {
    color: "#f4f7fb",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900"
  },
  subtle: {
    color: "#9aa4b2",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  subtleCenter: {
    color: "#9aa4b2",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#181c24",
    borderWidth: 1,
    borderColor: "#252b36"
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900"
  },
  cardTitle: {
    color: "#f4f7fb",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  body: {
    color: "#c9d1db",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  meta: {
    color: "#9aa4b2",
    fontSize: 12,
    lineHeight: 18
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  joinButton: {
    minHeight: 38,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#252b36"
  },
  joinText: {
    color: "#f4f7fb",
    fontWeight: "800"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start"
  },
  squadCard: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#181c24",
    borderWidth: 1,
    borderColor: "#252b36"
  },
  sideAccent: {
    width: 5
  },
  squadContent: {
    flex: 1,
    padding: 16
  },
  statGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  infoBox: {
    flex: 1,
    minHeight: 66,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#202530"
  },
  infoLabel: {
    color: "#9aa4b2",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  infoValue: {
    color: "#f4f7fb",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    marginTop: 5
  },
  fullButton: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 14,
    backgroundColor: "#d9ff66"
  },
  fullButtonText: {
    color: "#101217",
    fontWeight: "900"
  },
  eventRow: {
    minHeight: 82,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#181c24",
    borderWidth: 1,
    borderColor: "#252b36",
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  eventDate: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202530"
  },
  eventCopy: {
    flex: 1
  },
  profileTop: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 12
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#d9ff66",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  avatarText: {
    color: "#101217",
    fontSize: 30,
    fontWeight: "900"
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  tabBar: {
    position: "absolute",
    height: 72,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#181c24",
    borderTopColor: "#252b36"
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "800"
  }
});
