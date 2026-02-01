import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ArrowLeft, Coffee, Calendar } from 'lucide-react-native';

const MOCK_HISTORY = [
    { id: '1', action: 'Earned 1 Token', date: 'Today, 9:41 AM', amount: '+1' },
    { id: '2', action: 'Earned 1 Token', date: 'Jan 29, 2:30 PM', amount: '+1' },
    { id: '3', action: 'Redeemed Free Coffee', date: 'Jan 25, 10:00 AM', amount: '-10', type: 'redeem' },
    { id: '4', action: 'Earned 1 Token', date: 'Jan 20, 8:15 AM', amount: '+1' },
];

export default function MerchantDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const id = typeof params.id === 'string' ? params.id : '';
    const name = typeof params.name === 'string' ? params.name : 'Spartan Coffee Co.';
    const balance = params.balance ? Number(params.balance) : 4;
    const color = typeof params.color === 'string' ? params.color : '#FF853E';

    // In a real app, fetch merchant data by ID. 
    // For this demo, we use params passed from home, or fallback to Spartan defaults.
    const isSpartan = id === '1';
    const themeColor = color;
    const merchantName = name;
    const currentBalance = balance;
    const targetbalance = 10;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Merchant Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColor }]}>
                        <Coffee color="white" size={32} />
                    </View>
                    <Text style={styles.merchantName}>{merchantName}</Text>
                    <Text style={styles.location}>East Lansing, MI</Text>
                </View>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Your Progress</Text>
                        <Text style={[styles.progressCount, { color: themeColor }]}>
                            {currentBalance} <Text style={styles.totalTokens}>/ {targetbalance}</Text>
                        </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${Math.min((currentBalance / targetbalance) * 100, 100)}%`, backgroundColor: themeColor }]} />
                    </View>

                    <TouchableOpacity
                        style={[styles.redeemButton, { backgroundColor: themeColor }]}
                        onPress={() => router.push('/scan?mode=redeem')}
                    >
                        <Text style={styles.redeemButtonText}>Redeem Free Coffee</Text>
                    </TouchableOpacity>
                </View>

                {/* History Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>History</Text>
                </View>

                <View style={styles.historyList}>
                    {MOCK_HISTORY.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                            <View style={[styles.historyIcon, item.type === 'redeem' ? { backgroundColor: 'rgba(239, 68, 68, 0.2)' } : { backgroundColor: 'rgba(255, 133, 62, 0.2)' }]}>
                                <Coffee color={item.type === 'redeem' ? '#EF4444' : themeColor} size={18} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyAction}>{item.action}</Text>
                                <Text style={styles.historyDate}>{item.date}</Text>
                            </View>
                            <Text style={[styles.historyAmount, item.type === 'redeem' ? { color: '#EF4444' } : { color: '#10B981' }]}>
                                {item.amount}
                            </Text>
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
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#FF6D1F', // Orange Glow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    merchantName: {
        fontFamily: 'InstrumentSerif_400Regular',
        color: 'white',
        fontSize: 32,
        textAlign: 'center',
    },
    location: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 4,
    },
    progressCard: {
        backgroundColor: '#1E293B',
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, // Subtle dark shadow
        shadowRadius: 10,
        elevation: 4,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    progressLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    progressCount: {
        fontSize: 24,
        fontWeight: '700',
    },
    totalTokens: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    progressBarBg: {
        height: 12,
        backgroundColor: '#334155',
        borderRadius: 6,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    progressFooter: {
        color: '#94A3B8',
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
        fontFamily: 'InstrumentSerif_400Regular',
    },
    historyList: {
        marginHorizontal: 24,
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 8,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    historyInfo: {
        flex: 1,
    },
    historyAction: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    historyDate: {
        color: '#94A3B8',
        fontSize: 12,
    },
    historyAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    redeemButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    redeemButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});
