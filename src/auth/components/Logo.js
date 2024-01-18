import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image 
  source={{uri:'https://engineering.fb.com/wp-content/uploads/2016/04/yearinreview.jpg'}}
  style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
})
