import React from 'react';
import { Alert, Platform, Share, Linking } from 'react-native';
import { YStack, ScrollView } from 'tamagui';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '~/store/index';

// Components
import SettingsHeader from '~/assets/ui/components/settings/SettingsHeader';
import UserProfileCard from '~/assets/ui/components/settings/UserProfileCard';
import SettingsSectionComponent, { SettingsSection, SettingsItem } from '~/assets/ui/components/settings/SettingsSection';
import SettingsFooter from '~/assets/ui/components/settings/SettingsFooter';

export default function SettingsScreen() {
  const { 
    settings, 
    updateSettings, 
    logout, 
    resetApp 
  } = useAppStore();

  const handleUpdateSetting = async (key: keyof typeof settings, value: boolean) => {
    updateSettings(key, value);

    if (key === 'darkMode') {
      // Here you'd hook into your theme provider / context
      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (key === 'hapticFeedback') {
      if (value) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app for helping your community! Download it now and start making a difference.',
        title: 'Community Helper App',
        url: Platform.OS === 'ios' 
          ? 'https://apps.apple.com/app/community-helper' 
          : 'https://play.google.com/store/apps/details?id=com.communityhelper',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share app');
    }
  };

  const handleRateApp = async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        const storeUrl = Platform.OS === 'ios' 
          ? 'https://apps.apple.com/app/community-helper' 
          : 'https://play.google.com/store/apps/details?id=com.communityhelper';
        Linking.openURL(storeUrl).catch(() => 
          Alert.alert('Error', 'Could not open the store')
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open store for rating');
    }
  };

  const handleCheckUpdates = async () => {
    try {
      if (__DEV__) {
        Alert.alert('Development Mode', 'Updates are not available in development mode');
        return;
      }

      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Update Available', 
          'A new version of the app is available. Would you like to update now?', 
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Update', 
              onPress: async () => { 
                await Updates.fetchUpdateAsync(); 
                await Updates.reloadAsync(); 
              } 
            }
          ]
        );
      } else {
        Alert.alert('No Updates', 'You are using the latest version of the app');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache', 
      'This will clear all cached data including images and temporary files. Are you sure?', 
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Clear specific cache items but preserve user settings
              await AsyncStorage.multiRemove([
                '@app_notifications_v1',
                // Add other cache keys here
              ]);
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          } 
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account', 
      'This will permanently delete your account and all associated data. This action cannot be undone.', 
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.prompt(
              'Final Confirmation', 
              'Type DELETE to confirm', 
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive', 
                  onPress: (value?: string) => {
                    if (value === 'DELETE') {
                      resetApp();
                      router.replace('/login');
                    } else {
                      Alert.alert('Aborted', 'You did not type DELETE');
                    }
                  } 
                }
              ] as any
            );
          } 
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: () => {
          logout();
          router.replace('/login');
        } 
      }
    ]);
  };

  const handleExportData = async () => {
    const payload = JSON.stringify({ settings }, null, 2);
    await Share.share({ 
      message: payload, 
      title: 'My Settings JSON' 
    });
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Preferences',
      items: [
        { 
          id: 'darkMode', 
          icon: 'moon', 
          title: 'Dark Mode', 
          subtitle: 'Switch between light and dark themes', 
          type: 'toggle', 
          value: settings.darkMode, 
          action: () => handleUpdateSetting('darkMode', !settings.darkMode) 
        },
        { 
          id: 'locationServices', 
          icon: 'location', 
          title: 'Location Services', 
          subtitle: 'Allow app to access your location', 
          type: 'toggle', 
          value: settings.locationServices, 
          action: () => handleUpdateSetting('locationServices', !settings.locationServices) 
        },
        { 
          id: 'hapticFeedback', 
          icon: 'phone-portrait', 
          title: 'Haptic Feedback', 
          subtitle: 'Vibration feedback for interactions', 
          type: 'toggle', 
          value: settings.hapticFeedback, 
          action: () => handleUpdateSetting('hapticFeedback', !settings.hapticFeedback) 
        },
        { 
          id: 'notifications', 
          icon: 'notifications', 
          title: 'Notifications', 
          subtitle: 'Manage notification preferences', 
          type: 'navigation', 
          route: '/(profileScreens)/Notification',
          action: () => router.push('/(profileScreens)/Notification')
        },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { 
          id: 'twoFactor', 
          icon: 'shield-checkmark', 
          title: 'Two-Factor Authentication', 
          subtitle: 'Add extra security to your account', 
          type: 'toggle', 
          value: settings.twoFactor, 
          action: () => handleUpdateSetting('twoFactor', !settings.twoFactor) 
        },
        { 
          id: 'autoBackup', 
          icon: 'cloud-upload', 
          title: 'Auto Backup', 
          subtitle: 'Automatically backup your data', 
          type: 'toggle', 
          value: settings.autoBackup, 
          action: () => handleUpdateSetting('autoBackup', !settings.autoBackup) 
        }
      ]
    },
    {
      title: 'Account',
      items: [
        { 
          id: 'changePassword', 
          icon: 'key', 
          title: 'Change Password', 
          subtitle: 'Update your account password', 
          type: 'navigation', 
          route: '/(profileScreens)/change-password',
          action: () => router.push('/(profileScreens)/change-password' as any)
        }
      ]
    },
    {
      title: 'Support & About',
      items: [
        { 
          id: 'helpSupport', 
          icon: 'help-circle', 
          title: 'Help & Support', 
          subtitle: 'Get help and contact support', 
          type: 'navigation', 
          route: '/(profileScreens)/Support',
          action: () => router.push('/(profileScreens)/Support')
        },
        { 
          id: 'shareApp', 
          icon: 'share', 
          title: 'Share App', 
          subtitle: 'Tell friends about this app', 
          type: 'button', 
          action: handleShareApp 
        },
        { 
          id: 'rateApp', 
          icon: 'star', 
          title: 'Rate App', 
          subtitle: 'Rate us in the app store', 
          type: 'button', 
          action: handleRateApp 
        },
        { 
          id: 'checkUpdates', 
          icon: 'download', 
          title: 'Check for Updates', 
          subtitle: 'Download the latest version', 
          type: 'button', 
          action: handleCheckUpdates 
        }
      ]
    },
    {
      title: 'Advanced',
      items: [
        { 
          id: 'backgroundRefresh', 
          icon: 'refresh', 
          title: 'Background App Refresh', 
          subtitle: 'Allow app to refresh in background', 
          type: 'toggle', 
          value: settings.backgroundAppRefresh, 
          action: () => handleUpdateSetting('backgroundAppRefresh', !settings.backgroundAppRefresh) 
        },
        { 
          id: 'clearCache', 
          icon: 'trash', 
          title: 'Clear Cache', 
          subtitle: 'Free up storage space', 
          type: 'button', 
          action: handleClearCache 
        },
        { 
          id: 'exportData', 
          icon: 'download-outline', 
          title: 'Export Data', 
          subtitle: 'Download your personal data', 
          type: 'button', 
          action: handleExportData 
        }
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        { 
          id: 'logout', 
          icon: 'log-out', 
          title: 'Logout', 
          subtitle: 'Sign out of your account', 
          type: 'destructive', 
          action: handleLogout, 
          color: '#ff6b6b' 
        },
        { 
          id: 'deleteAccount', 
          icon: 'trash', 
          title: 'Delete Account', 
          subtitle: 'Permanently delete your account', 
          type: 'destructive', 
          action: handleDeleteAccount, 
          color: '#dc3545' 
        }
      ]
    }
  ];

  const handleItemPress = (item: SettingsItem) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <ScrollView f={1} bg="#f8f9fa" showsVerticalScrollIndicator={false}>
      <SettingsHeader onGoBack={() => router.back()} />
      
      <UserProfileCard 
        onEditProfile={() => router.push('/(profileScreens)/EditProfile')} 
      />

      <YStack px={20} pb={30} gap={20}>
        {settingsSections.map((section, idx) => (
          <SettingsSectionComponent
            key={idx}
            section={section}
            onItemPress={handleItemPress}
          />
        ))}

        <SettingsFooter />
      </YStack>
    </ScrollView>
  );
}