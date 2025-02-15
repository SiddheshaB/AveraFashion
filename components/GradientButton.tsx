import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const GradientButton = ({title, onPress}:any) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
          {/*   <LinearGradient colors={['#F7F5FB', '#E5E5E5']} style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </LinearGradient> */}
            <Text style={styles.buttonText}>{title}</Text>
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
        backgroundColor:"#333",
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
export default GradientButton;