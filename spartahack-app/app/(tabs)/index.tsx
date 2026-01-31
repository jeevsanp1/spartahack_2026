import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Scan, Coffee, Plus, ArrowRight, ShoppingBasket } from 'lucide-react-native';

// Type definition for Merchant Data
type Merchant = {
  id: string;
  name: string;
  balance: number;
  color: string;
  lastVisit: string;
  type: 'coffee' | 'grocery';
};

// Mock Data for User's "Wallet" of Merchant Cards
const MERCHANTS: Merchant[] = [
  { id: '1', name: 'Spartan Coffee Co.', balance: 4, color: '#FF853E', lastVisit: 'Today', type: 'coffee' },
  { id: '2', name: 'Blue Owl Coffee', balance: 8, color: '#0EA5E9', lastVisit: 'Yesterday', type: 'coffee' },
  { id: '3', name: 'Metropolis Grocers', balance: 3, color: '#10B981', lastVisit: '2 days ago', type: 'grocery' },
  { id: '4', name: 'Foster Coffee', balance: 1, color: '#D946EF', lastVisit: 'Last Week', type: 'coffee' },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function HomeScreen() {
  const router = useRouter();

  const renderCard = (merchant: Merchant) => {
    const isClickable = merchant.id === '1'; // Currently only Spartan is clickable as requested

    const CardContent = (
      <View key={merchant.id} style={[styles.card, { backgroundColor: merchant.color }]}>
        <View style={styles.cardHeader}>
          <View style={styles.merchantIconBg}>
            {merchant.type === 'grocery' ? (
              <ShoppingBasket color={merchant.color} size={20} />
            ) : (
              <Coffee color={merchant.color} size={20} />
            )}
          </View>
          <Text style={styles.cardLastVisit}>{merchant.lastVisit}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.merchantName}>{merchant.name}</Text>
          <Text style={styles.tokenCount}>
            {merchant.balance} <Text style={styles.tokenLabel}>TOKENS</Text>
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(merchant.balance / 10) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {merchant.balance}/10 for Free {merchant.type === 'grocery' ? 'Produce' : 'Coffee'}
          </Text>
        </View>
      </View>
    );

    if (isClickable) {
      return (
        <TouchableOpacity key={merchant.id} onPress={() => router.push(`/merchant/${merchant.id}`)} activeOpacity={0.9}>
          {CardContent}
        </TouchableOpacity>
      );
    }

    return CardContent;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>STAMPD</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Quick Scan Action */}
        <TouchableOpacity style={styles.scanParams} onPress={() => router.push("/scan")}>
          <View style={styles.scanIconBg}>
            <Scan color="#10B981" size={28} />
          </View>
          <View style={styles.scanTextContainer}>
            <Text style={styles.scanTitle}>Scan & Earn</Text>
            <Text style={styles.scanSubtitle}>Collect tokens from merchants</Text>
          </View>
          <ArrowRight color="#94A3B8" size={24} />
        </TouchableOpacity>

        {/* My Cards Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Cards</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {MERCHANTS.map(renderCard)}
          <TouchableOpacity style={[styles.card, styles.addCard]}>
            <Plus color="#475569" size={40} />
            <Text style={styles.addCardText}>Find Store</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recent Activity Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityList}>
          {/* Simple list of recent actions */}
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Coffee color="#94A3B8" size={18} />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Earned 1 Token</Text>
                <Text style={styles.activityMerchant}>Spartan Coffee Co.</Text>
              </View>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E1', // Light Cream
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  appTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#222222', // Dark Gray
    fontSize: 42,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222222', // Dark contrast
    alignItems: 'center',
    justifyContent: 'center',
    // Removed border for cleaner look, or keep subtle
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scanParams: {
    marginHorizontal: 24,
    backgroundColor: '#FF6D1F', // Bright Orange
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF6D1F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  scanSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '700',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: '#222222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, // Softer shadow
    shadowRadius: 12,
    elevation: 4,
    // Removed border
  },
  addCard: {
    backgroundColor: '#F5E7C6',
    borderWidth: 2,
    borderColor: '#E2D5B5', // Softer border for dashed area
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#666666',
    marginTop: 8,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  merchantIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FAF3E1',
    alignItems: 'center',
    justifyContent: 'center',
    // Removed border
  },
  cardLastVisit: {
    color: '#666666',
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 12,
  },
  merchantName: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tokenCount: {
    color: '#222222',
    fontSize: 32,
    fontWeight: '800',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  cardFooter: {
    marginTop: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(34,34,34,0.05)',
    borderRadius: 3,
    marginBottom: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#222222',
    borderRadius: 3,
  },
  progressText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  activityList: {
    paddingHorizontal: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE4CB', // Very soft divider
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5E7C6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '500',
  },
  activityMerchant: {
    color: '#666',
    fontSize: 14,
  },
  activityTime: {
    color: '#999',
    fontSize: 12,
  },
});
