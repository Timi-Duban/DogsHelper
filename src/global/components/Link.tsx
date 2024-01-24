import { Link as ExpoLink } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "../theme";

type LinkProps = {
    href: string;
    children: string;
}

const Link = (props: LinkProps) => {
    const { href, children } = props;
    return (
        <ExpoLink
            href={href}
            style={styles.linkStyle}
        >
            {children}
        </ExpoLink>
    )
};

const styles = StyleSheet.create({
    linkStyle: {
        alignSelf: 'center',
        color: theme.colors.surface,
        backgroundColor: theme.colors.secondary,
        borderRadius: 4,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        padding: 10,
    },
})

export default Link;
