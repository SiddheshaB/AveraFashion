import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const GradientButton = ({title, onPress}:any) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient colors={['#F7F5FB', '#E5E5E5']} style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </LinearGradient>
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
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
export default GradientButton;