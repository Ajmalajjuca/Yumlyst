import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import {authStyles} from '../../assets/style/auth.styles'
import { COLORS } from '@/constants/colors'
import {Ionicons} from '@expo/vector-icons'

const SignIn = () => {
  const router = useRouter()
  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loding, setLoading] = useState(false)

  const handelSignInPress = async () => {
    if(!emailAddress || !password) {
      Alert.alert("Error", "Please enter email and password")
      return 
    }
    if (!isLoaded) return
    setLoading(true)
    try {
      const response = await signIn.create({
        identifier: emailAddress,
        password
      })
      if (response.status === 'complete') {
        await setActive({ session: response.createdSessionId })
      }else {
        Alert.alert("Error", "Invalid email or password")
        console.error(JSON.stringify(response, null, 2))
      }
    } catch (error) {
      Alert.alert("Error", (error as any).errors?.[0]?.message||'sign In failed')
      console.error(JSON.stringify(error,null,2))
    }finally {
      setLoading(false)
    }
  }

  if (!isLoaded) return null 
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require('../../assets/images/i1.png')}
              style={authStyles.image}
              resizeMode="contain"
              />
          </View>
          <Text style={authStyles.title}>Welcome Back</Text>
          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.textLight}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType='email-address'
                autoCapitalize='none'
                />
            </View>
            {/* PASSWORD INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
                />
                <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    colors={COLORS.textLight}
                    />
                </TouchableOpacity>
            </View>
            {/* SIGN IN BUTTON */}
            <TouchableOpacity
            style={[authStyles.authButton, loding && authStyles.buttonDisabled]}
            onPress={handelSignInPress}
            disabled={loding}
            activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loding ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>
            {/* SIGN UP LINK */}
            <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={authStyles.linkText}>
                Don't have an account? 
                <Text style={authStyles.link}> Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignIn