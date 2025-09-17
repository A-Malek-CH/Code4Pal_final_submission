import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { YStack, XStack, ScrollView, Text, Button } from 'tamagui';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    
    try {
      // Here you would call your API to change the password
      // const response = await updatePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success', 
        'Your password has been updated successfully', 
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ 
    label, 
    value, 
    onChangeText, 
    showPassword, 
    onToggleVisibility, 
    placeholder 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    showPassword: boolean;
    onToggleVisibility: () => void;
    placeholder: string;
  }) => (
    <YStack gap={8}>
      <Text fontSize={16} fontWeight="600" color="#333">
        {label}
      </Text>
      <XStack 
        bg="white" 
        borderWidth={1} 
        borderColor="#e5e5e5" 
        borderRadius={12} 
        paddingHorizontal={16}
        paddingVertical={2}
        alignItems="center"
        gap={8}
      >
        <TextInput
          style={{
            flex: 1,
            height: 44,
            fontSize: 16,
            color: '#333',
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onToggleVisibility}>
          <Ionicons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={20} 
            color="#666"
          />
        </TouchableOpacity>
      </XStack>
    </YStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <XStack 
        bg="white"
        h={60}
        ai="center" 
        jc="space-between" 
        px={20}
        borderBottomWidth={1}
        borderBottomColor="#e5e5e5"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text fontSize={18} fontWeight="600" color="#333">
          Change Password
        </Text>
        
        <YStack w={24} /> {/* Spacer for center alignment */}
      </XStack>

      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack px={20} py={30} gap={24}>
          
          {/* Security Notice */}
          <XStack
            bg="#fff3cd"
            p={16}
            borderRadius={12}
            borderWidth={1}
            borderColor="#ffeaa7"
            gap={12}
            ai="flex-start"
          >
            <Ionicons name="shield-checkmark" size={20} color="#856404" />
            <YStack f={1} gap={4}>
              <Text fontSize={14} fontWeight="600" color="#856404">
                Password Security
              </Text>
              <Text fontSize={13} color="#856404" lineHeight={18}>
                Choose a strong password with at least 8 characters, including uppercase letters, numbers, and special characters.
              </Text>
            </YStack>
          </XStack>

          {/* Form */}
          <YStack gap={20}>
            <PasswordInput
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
              showPassword={showPasswords.current}
              onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              placeholder="Enter your current password"
            />

            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
              showPassword={showPasswords.new}
              onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              placeholder="Enter your new password"
            />

            <PasswordInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
              showPassword={showPasswords.confirm}
              onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              placeholder="Confirm your new password"
            />
          </YStack>

          {/* Password Requirements */}
          <YStack gap={8}>
            <Text fontSize={14} fontWeight="600" color="#666">
              Password Requirements:
            </Text>
            <YStack gap={4} pl={16}>
              <XStack gap={8} ai="center">
                <Ionicons 
                  name={formData.newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={formData.newPassword.length >= 8 ? '#4a8a28' : '#ccc'} 
                />
                <Text fontSize={13} color="#666">At least 8 characters</Text>
              </XStack>
              <XStack gap={8} ai="center">
                <Ionicons 
                  name={/[A-Z]/.test(formData.newPassword) ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={/[A-Z]/.test(formData.newPassword) ? '#4a8a28' : '#ccc'} 
                />
                <Text fontSize={13} color="#666">One uppercase letter</Text>
              </XStack>
              <XStack gap={8} ai="center">
                <Ionicons 
                  name={/[0-9]/.test(formData.newPassword) ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={/[0-9]/.test(formData.newPassword) ? '#4a8a28' : '#ccc'} 
                />
                <Text fontSize={13} color="#666">One number</Text>
              </XStack>
            </YStack>
          </YStack>

          {/* Update Button */}
          <Button
            bg="#4a8a28"
            color="white"
            h={50}
            br={12}
            fontSize={16}
            fontWeight="600"
            onPress={handleUpdatePassword}
            opacity={loading ? 0.7 : 1}
            pressStyle={{ opacity: 0.8 }}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}