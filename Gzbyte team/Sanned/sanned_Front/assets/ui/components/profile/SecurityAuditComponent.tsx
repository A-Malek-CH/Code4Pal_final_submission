// Security Audit and Monitoring Component
import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { AuthenticationSecurity } from '~/services/AuthenticationSecurity';
import { SecureDatabaseService } from '~/services/SecureDatabaseService';

interface SecurityAuditProps {
  onClose: () => void;
}

interface SecurityStatus {
  sessionValid: boolean;
  lastSecurityCheck: Date;
  securityLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export default function SecurityAuditComponent({ onClose }: SecurityAuditProps) {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [dbHealthCheck, setDbHealthCheck] = useState<{ healthy: boolean; errors: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performSecurityAudit();
  }, []);

  const performSecurityAudit = async () => {
    setLoading(true);
    try {
      // Get security status
      const status = await AuthenticationSecurity.getSecurityStatus();
      setSecurityStatus(status);

      // Perform database health check
      const dbHealth = await SecureDatabaseService.performHealthCheck();
      setDbHealthCheck(dbHealth);

      // Log the security check
      await AuthenticationSecurity.logSecurityEvent('security_audit_performed', {
        securityLevel: status.securityLevel,
        dbHealthy: dbHealth.healthy,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Security audit failed:', error);
      Alert.alert('Error', 'Failed to perform security audit');
    } finally {
      setLoading(false);
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#10B981'; // Green
      case 'medium': return '#F59E0B'; // Orange
      case 'low': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return 'shield-checkmark';
      case 'medium': return 'shield-half';
      case 'low': return 'warning';
      default: return 'help';
    }
  };

  const handleCleanupOldData = async () => {
    Alert.alert(
      'Data Cleanup',
      'This will remove data older than 90 days. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureDatabaseService.cleanupOldData(90);
              Alert.alert('Success', 'Old data has been cleaned up');
              performSecurityAudit(); // Refresh status
            } catch (error) {
              Alert.alert('Error', 'Failed to cleanup old data');
            }
          }
        }
      ]
    );
  };

  const handleForceLogout = async () => {
    Alert.alert(
      'Force Logout',
      'This will clear all sessions and require re-authentication.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Force Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthenticationSecurity.clearSession();
              await AuthenticationSecurity.logSecurityEvent('force_logout', {
                reason: 'manual_security_action'
              });
              Alert.alert('Success', 'All sessions have been cleared');
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear sessions');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="white" p={20}>
        <Text fontSize={18} fontWeight="600">Performing Security Audit...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView f={1} bg="#f8f9fa" p={20}>
      <YStack gap={20}>
        {/* Header */}
        <XStack ai="center" jc="space-between" mb={10}>
          <Text fontSize={24} fontWeight="700" color="#1a1a1a">
            Security Audit
          </Text>
          <Button size="$3" variant="outlined" onPress={onClose}>
            <Text>Close</Text>
          </Button>
        </XStack>

        {/* Security Level Overview */}
        {securityStatus && (
          <Card bg="white" p={20} borderRadius={16} elevate>
            <XStack ai="center" gap={12} mb={16}>
              <Ionicons 
                name={getSecurityLevelIcon(securityStatus.securityLevel)} 
                size={32} 
                color={getSecurityLevelColor(securityStatus.securityLevel)} 
              />
              <YStack>
                <Text fontSize={20} fontWeight="700" color="#1a1a1a">
                  Security Level: {securityStatus.securityLevel.toUpperCase()}
                </Text>
                <Text fontSize={14} color="#6b7280">
                  Last check: {securityStatus.lastSecurityCheck.toLocaleString()}
                </Text>
              </YStack>
            </XStack>

            <YStack gap={8}>
              <XStack ai="center" gap={8}>
                <Ionicons 
                  name={securityStatus.sessionValid ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={securityStatus.sessionValid ? "#10B981" : "#EF4444"} 
                />
                <Text fontSize={16}>
                  Session: {securityStatus.sessionValid ? "Valid" : "Invalid"}
                </Text>
              </XStack>
            </YStack>
          </Card>
        )}

        {/* Database Health */}
        {dbHealthCheck && (
          <Card bg="white" p={20} borderRadius={16} elevate>
            <XStack ai="center" gap={12} mb={16}>
              <Ionicons 
                name={dbHealthCheck.healthy ? "server" : "warning"} 
                size={24} 
                color={dbHealthCheck.healthy ? "#10B981" : "#EF4444"} 
              />
              <Text fontSize={18} fontWeight="600" color="#1a1a1a">
                Database Health
              </Text>
            </XStack>

            <XStack ai="center" gap={8} mb={12}>
              <Ionicons 
                name={dbHealthCheck.healthy ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={dbHealthCheck.healthy ? "#10B981" : "#EF4444"} 
              />
              <Text fontSize={16}>
                Status: {dbHealthCheck.healthy ? "Healthy" : "Issues Detected"}
              </Text>
            </XStack>

            {dbHealthCheck.errors.length > 0 && (
              <YStack gap={8} mt={12}>
                <Text fontSize={16} fontWeight="600" color="#EF4444">
                  Issues Found:
                </Text>
                {dbHealthCheck.errors.map((error, index) => (
                  <XStack key={index} ai="center" gap={8}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text fontSize={14} color="#374151">{error}</Text>
                  </XStack>
                ))}
              </YStack>
            )}
          </Card>
        )}

        {/* Security Recommendations */}
        {securityStatus && securityStatus.recommendations.length > 0 && (
          <Card bg="white" p={20} borderRadius={16} elevate>
            <XStack ai="center" gap={12} mb={16}>
              <Ionicons name="bulb" size={24} color="#F59E0B" />
              <Text fontSize={18} fontWeight="600" color="#1a1a1a">
                Security Recommendations
              </Text>
            </XStack>

            <YStack gap={12}>
              {securityStatus.recommendations.map((recommendation, index) => (
                <XStack key={index} ai="center" gap={8}>
                  <Ionicons name="arrow-forward" size={16} color="#6b7280" />
                  <Text fontSize={14} color="#374151" flex={1}>
                    {recommendation}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </Card>
        )}

        {/* Security Actions */}
        <Card bg="white" p={20} borderRadius={16} elevate>
          <Text fontSize={18} fontWeight="600" color="#1a1a1a" mb={16}>
            Security Actions
          </Text>

          <YStack gap={12}>
            <Button
              bg="#3B82F6"
              onPress={performSecurityAudit}
              borderRadius={12}
              h={50}
            >
              <XStack ai="center" gap={8}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text color="white" fontWeight="600">Refresh Security Audit</Text>
              </XStack>
            </Button>

            <Button
              bg="#F59E0B"
              onPress={handleCleanupOldData}
              borderRadius={12}
              h={50}
            >
              <XStack ai="center" gap={8}>
                <Ionicons name="trash" size={20} color="white" />
                <Text color="white" fontWeight="600">Cleanup Old Data</Text>
              </XStack>
            </Button>

            <Button
              bg="#EF4444"
              onPress={handleForceLogout}
              borderRadius={12}
              h={50}
            >
              <XStack ai="center" gap={8}>
                <Ionicons name="log-out" size={20} color="white" />
                <Text color="white" fontWeight="600">Force Logout All Sessions</Text>
              </XStack>
            </Button>
          </YStack>
        </Card>

        {/* Privacy Notice */}
        <Card bg="#F3F4F6" p={20} borderRadius={16}>
          <XStack ai="center" gap={12} mb={12}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text fontSize={16} fontWeight="600" color="#1f2937">
              Your Privacy & Security
            </Text>
          </XStack>
          <Text fontSize={14} color="#4b5563" lineHeight={20}>
            This app implements multiple security layers including input sanitization, 
            secure data storage, session management, and regular security audits. 
            Your personal data is processed locally and only synchronized when necessary.
          </Text>
        </Card>
      </YStack>
    </ScrollView>
  );
}