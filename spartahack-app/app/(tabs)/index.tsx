import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Scan, Coffee, Plus, ArrowRight, ShoppingBasket } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

import { Merchant } from '@/constants/MockStore';

import { MockStore } from '@/constants/MockStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function HomeScreen() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>(MockStore.merchants);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Force use of Mock Store for demo purposes
    // This bypasses the backend API completely
    console.log('Using local Mock Store');
    const mockData = [...MockStore.merchants];
    setMerchants(mockData);

    /* 
    // API Call Logic - Disabled for reliable demo
    // TODO: Use real user key from wallet
    const DEMO_USER_KEY = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
    try {
      const balances = await ApiService.getUserBalances(DEMO_USER_KEY);
      if (balances.length > 0) {
        const mappedMerchants: Merchant[] = balances.map(b => ({
          id: b.merchantId,
          name: b.merchantName,
          balance: b.balance,
          color: b.color || '#64748B',
          type: (b.type as 'coffee' | 'grocery') || 'coffee',
          lastVisit: 'Recently', // Backend doesn't support this yet
        }));
        setMerchants(mappedMerchants);
      }
    } catch (error) {
      console.log('Using mock data due to API error');
      // Sync with local mock store
      setMerchants([...MockStore.merchants]);
    }
    */
  };

  const renderCard = (merchant: Merchant) => {
    const isClickable = true; // Make all cards clickable if they come from API potentially

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
            <View style={[styles.progressBarFill, { width: `${Math.min((merchant.balance / 10) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {merchant.balance}/10 for Free {merchant.type === 'grocery' ? 'Produce' : 'Coffee'}
          </Text>
        </View>
      </View>
    );

    if (isClickable) {
      // Use push with params, handling the ID correctly
      return (
        <TouchableOpacity
          key={merchant.id}
          onPress={() => router.push({
            pathname: "/merchant/[id]",
            params: {
              id: merchant.id,
              name: merchant.name,
              balance: merchant.balance,
              color: merchant.color,
              type: merchant.type
            }
          })}
          activeOpacity={0.9}
        >
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
        <TouchableOpacity style={styles.addButton} onPress={fetchData}>
          {/* Use Plus button to refresh for now since it's a prototype */}
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
          {merchants.map(renderCard)}
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
          {/* Simple list of recent actions - static for now */}
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
    backgroundColor: '#0F172A', // Dark Slate
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
    color: 'white',
    fontSize: 42,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6D1F', // Orange Accent
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scanParams: {
    marginHorizontal: 24,
    backgroundColor: '#1E293B', // Dark Slate (Chill)
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 109, 31, 0.5)', // Subtle Orange Border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 109, 31, 0.15)', // Subtle Orange Tint
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    color: '#FF6D1F', // Orange Text
    fontSize: 18,
    fontWeight: '600',
  },
  scanSubtitle: {
    color: '#94A3B8', // Muted Slate
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addCard: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#64748B',
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLastVisit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tokenCount: {
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  cardFooter: {
    marginTop: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    marginBottom: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
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
    borderBottomColor: '#1E293B',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activityMerchant: {
    color: '#64748B',
    fontSize: 14,
  },
  activityTime: {
    color: '#475569',
    fontSize: 12,
  },
});
