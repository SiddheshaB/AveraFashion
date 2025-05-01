import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";

const GradientButton = ({title, onPress, disabled, isLoading, loadingText = "Posting..."}:any) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[
                styles.button,
                disabled && styles.buttonDisabled
            ]}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.buttonText, styles.loadingText]}>{loadingText}</Text>
                </View>
            ) : (
                <Text style={[
                    styles.buttonText,
                    disabled && styles.buttonTextDisabled
                ]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
const styles= StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: "100%",
        alignItems: "center",
        backgroundColor:"#724C9D",
    },
    buttonDisabled: {
        backgroundColor: 'rgba(139, 68, 255, 0.5)',
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#fff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 8,
    }
})
export default GradientButton;