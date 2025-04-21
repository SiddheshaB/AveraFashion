import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const GradientButton = ({title, onPress, disabled}:any) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[
                styles.button,
                disabled && styles.buttonDisabled
            ]}
            disabled={disabled}
        >
            <Text style={[
                styles.buttonText,
                disabled && styles.buttonTextDisabled
            ]}>{title}</Text>
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
    }
})
export default GradientButton;