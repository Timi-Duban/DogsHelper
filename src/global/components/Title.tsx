import { StyleSheet, Text } from "react-native";
import { theme } from "../theme";

type TitleProps = {
    children: string | string[];
}

const Title = (props: TitleProps) => {
    const {children} = props;
    return (
        <Text
            allowFontScaling={false}
            style={styles.title}
        >
            {children}
        </Text>
    )
};

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: 28,
        fontWeight: "bold",
        margin: 20,
        color: theme.colors.primary,
    }
})

export default Title;