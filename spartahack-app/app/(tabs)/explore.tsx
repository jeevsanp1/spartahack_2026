import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Gift, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const REWARDS_CATALOG = [
  { id: '1', merchant: 'Spartan Coffee Co.', item: 'Free Latte', cost: 10, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=100' },
  { id: '2', merchant: 'Blue Owl Coffee', item: 'Free Pastry', cost: 5, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=100' },
  { id: '3', merchant: 'Foster Coffee', item: 'Bag of Beans', cost: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=100' },
  { id: '4', merchant: 'Spartan Coffee Co.', item: 'Espresso Shot', cost: 5, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=100' },
];

export default function ExploreScreen() {
  const router = useRouter();

  const handleRedeem = (id: string) => {
    if (id === '1') {
      router.push('/scan?mode=redeem');
    } else {
      Alert.alert('Insufficent Tokens', 'You need more tokens to claim this reward.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Redeem Rewards</Text>
      <Text style={styles.subtitle}>Use your tokens to claim these items</Text>

      <FlatList
        data={REWARDS_CATALOG}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.rewardCard}>
            <View style={styles.imagePlaceholder}>
              <Gift color="#64748B" size={24} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.merchantName}>{item.merchant}</Text>
              <Text style={styles.rewardTitle}>{item.item}</Text>
              <Text style={styles.cost}>{item.cost} Tokens</Text>
            </View>
            <TouchableOpacity
              style={[styles.redeemButton, item.id !== '1' && { backgroundColor: '#334155' }]}
              onPress={() => handleRedeem(item.id)}
            >
              <Text style={[styles.redeemText, item.id !== '1' && { color: '#94A3B8' }]}>Redeem</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark Slate
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: 'InstrumentSerif_400Regular',
    color: 'white',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rewardCard: {
    backgroundColor: '#1E293B', // Lighter Slate
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#334155', // Slate 700
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  merchantName: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  rewardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cost: {
    color: '#FF6D1F', // Orange Accent
    fontWeight: '700',
  },
  redeemButton: {
    backgroundColor: '#FF6D1F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#FF6D1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  redeemText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
