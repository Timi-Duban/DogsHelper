import React, { useState } from 'react'
import Background from '@/auth/components/Background'
import BackButton from '@/auth/components/BackButton'
import Logo from '@/auth/components/Logo'
import Header from '@/auth/components/Header'
import TextInput from '@/auth/components/TextInput'
import Button from '@/auth/components/Button'
import { emailValidator } from '@/auth/helpers/emailValidator'
import { router } from 'expo-router';
import { sendResetPassword } from '@/auth/services/AuthService'

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    await sendResetPassword(email.value);
    router.replace('/login')
  }

  return (
    <Background>
      <BackButton />
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
    </Background>
  )
}
