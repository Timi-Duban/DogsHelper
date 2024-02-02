import { DogData, Gender } from "@/dogs/DogsService";
import globalStyles from "@/global/GlobalStyle";
import { theme } from "@/global/theme";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Switch } from 'react-native-paper';
//@ts-ignore
import SwitchSelector from "react-native-switch-selector";
import { Dog } from "../DogsStore";

type DogFieldsProps = {
    addOnPress: (newData: DogData, initialDog?: Dog) => Promise<void>;
    buttonTitle: string;
    existingDog?: Dog;
}

const DogFields = (props: DogFieldsProps) => {
    const { addOnPress, buttonTitle, existingDog } = props;

    const genderOptions = [
        { label: 'Male', value: 'male', accessibilityLabel: 'male' },
        { label: 'Female', value: 'female', accessibilityLabel: 'female' },
    ]

    const [name, setName] = useState(existingDog?.name ?? '');
    const [notes, setNotes] = useState(existingDog?.notes ?? '');
    const [temporaryNotes, setTemporaryNotes] = useState(existingDog?.temporaryNotes ?? '');
    const [gender, setGender] = useState<Gender>(existingDog?.gender ?? 'male');
    const [heat, setHeat] = useState(existingDog?.heat ?? false);

    useEffect(() => {
        if (gender === 'male' && heat) {
            setHeat(false);
        }
    }, [gender])


    const onPress = async () => {
        const dog: DogData = {name, notes, temporaryNotes, gender, heat};
        await addOnPress(dog, existingDog);
    }

    return (
        <View>
            <TextInput
                onChangeText={setName}
                value={name}
                placeholder="Name"
                autoCapitalize="words"
                style={{ ...globalStyles.input, marginBottom: 10 }}
            />
            <TextInput
                onChangeText={setNotes}
                value={notes}
                placeholder="Notes"
                autoCapitalize="none"
                style={{ ...globalStyles.input, marginBottom: 10 }}
            />
            <TextInput
                onChangeText={setTemporaryNotes}
                value={temporaryNotes}
                placeholder="Temporary Notes"
                autoCapitalize="none"
                style={{ ...globalStyles.input }}
            />
            <View style={styles.switchView}>
                <SwitchSelector
                    options={genderOptions}
                    initial={gender === 'male' ? 0 : 1}
                    onPress={(value: Gender) => { setGender(value) }}
                    buttonColor={theme.colors.primary}
                    accessibilityLabel="gender-switch-selector"
                />
            </View>
            {gender === 'female' &&
                <View style={styles.row}>
                    <Text>In heat?</Text>
                    <Switch
                        value={heat}
                        onValueChange={() => setHeat(heat => !heat)}
                        style={{ marginLeft: 10 }}
                    />
                </View>
            }
            <Button title={buttonTitle} onPress={onPress} disabled={name === ""} />
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    switchView: {
        padding: 10,
    },
})

export default DogFields;
