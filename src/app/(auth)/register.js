import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router';
import Background from '@/auth/components/Background'
import Logo from '@/auth/components/Logo'
import Header from '@/auth/components/Header'
import Button from '@/auth/components/Button'
import TextInput from '@/auth/components/TextInput'
import BackButton from '@/auth/components/BackButton'
import { theme } from '@/global/theme'
import { emailValidator } from '@/auth/helpers/emailValidator'
import { passwordValidator } from '@/auth/helpers/passwordValidator'
import { registerWithPassword } from '@/auth/AuthService';

export default function RegisterScreen() {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    await registerWithPassword(email.value, password.value);
    router.replace('/');
  }

  return (
    <Background>
      <BackButton />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <Link href="/login" asChild>
            <TouchableOpacity>
            <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
