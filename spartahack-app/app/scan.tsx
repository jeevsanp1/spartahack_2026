import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { mode } = useLocalSearchParams();
    const isRedeem = mode === 'redeem';

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned || loading) return;
        setScanned(true);
        setLoading(true);

        try {
            console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (isRedeem) {
                // Navigate to redemption success
                router.replace("/merchant/redeem-success");
            } else {
                // Default Earning Logic
                const merchantData = JSON.parse(data);
                Alert.alert(
                    "Reward Claimed!",
                    `You earned 1 Token at ${merchantData.name || 'Merchant'}!`,
                    [{
                        text: "OK",
                        onPress: () => {
                            router.dismissAll();
                            router.replace("/(tabs)");
                        }
                    }]
                );
            }

        } catch (error) {
            Alert.alert("Error", "Invalid QR Code", [{
                text: "OK", onPress: () => {
                    setScanned(false);
                    setLoading(false);
                }
            }]);
        } finally {
            if (!isRedeem) {
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft color="white" size={28} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {isRedeem ? 'Scan to Redeem' : 'Scan to Earn'}
                        </Text>
                    </View>

                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.tl]} />
                        <View style={[styles.corner, styles.tr]} />
                        <View style={[styles.corner, styles.bl]} />
                        <View style={[styles.corner, styles.br]} />
                    </View>

                    <Text style={styles.instructionText}>Align QR code within the frame</Text>

                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#FF853E" />
                            <Text style={styles.loadingText}>Verifying...</Text>
                        </View>
                    )}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 20,
    },
    scanFrame: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#FF6D1F', // New Orange
        borderWidth: 4,
    },
    tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

    instructionText: {
        color: 'white',
        marginTop: 40,
        fontSize: 16,
        opacity: 0.8,
    },
    loadingOverlay: {
        position: 'absolute',
        backgroundColor: '#1E293B', // Dark Slate
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
