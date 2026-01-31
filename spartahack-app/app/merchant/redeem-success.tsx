import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ArrowLeft } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    runOnJS
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function RedeemSuccessScreen() {
    const router = useRouter();
    const scale = useSharedValue(0.3);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);

    useEffect(() => {
        // Trigger haptics
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Start animations
        scale.value = withSpring(1, { damping: 10 });
        opacity.value = withDelay(200, withSpring(1));
        translateY.value = withDelay(300, withSpring(0));
    }, []);

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circleContainer, circleStyle]}>
                <View style={styles.circle}>
                    <Check color="#fff" size={64} strokeWidth={4} />
                </View>

                {/* Decorative rings */}
                <View style={[styles.ring, styles.ring1]} />
                <View style={[styles.ring, styles.ring2]} />
            </Animated.View>

            <Animated.View style={[styles.content, textStyle]}>
                <Text style={styles.title}>Reward Redeemed!</Text>
                <Text style={styles.subtitle}>Enjoy your free coffee. Show this screen to the barista.</Text>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Spartan Coffee Co.</Text>
                    <Text style={styles.detailsTime}>Just now</Text>
                    <View style={styles.ticketStub}>
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark Slate
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FF6D1F', // Orange Success
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#FF6D1F',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    ring: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#FF6D1F',
        opacity: 0.3,
    },
    ring1: {
        width: 160,
        height: 160,
    },
    ring2: {
        width: 220,
        height: 220,
        opacity: 0.15,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontFamily: 'InstrumentSerif_400Regular',
        color: 'white',
        fontSize: 36,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: '80%',
        lineHeight: 24,
    },
    detailsCard: {
        backgroundColor: '#1E293B', // Lighter Slate
        borderRadius: 20,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    detailsTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    detailsTime: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 16,
    },
    ticketStub: {
        width: '100%',
        height: 1,
        backgroundColor: 'transparent',
        marginVertical: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 1,
    },
    verifiedBadge: {
        position: 'absolute',
        top: -14,
        alignSelf: 'center',
        backgroundColor: '#FF6D1F',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    verifiedText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 10,
        letterSpacing: 1,
    },
    button: {
        backgroundColor: '#FF6D1F', // Orange Button
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
    },
});
