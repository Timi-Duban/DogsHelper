import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router';

export default function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => {router.back()}}
      style={styles.container}
    >
      <Text>Back</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
})
