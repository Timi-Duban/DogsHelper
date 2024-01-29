import { Link as ExpoLink } from "expo-router";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { theme } from "../theme";

type LinkProps = {
    href: string | object;
    children: string | ReactNode;
    asChild?: boolean;
    customStyle?: StyleProp<TextStyle>;
}

const Link = (props: LinkProps) => {
    const { asChild, children, customStyle, href } = props;
    return (
        <ExpoLink
            href={href}
            style={customStyle ?? styles.linkStyle}
            asChild={asChild}
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
