import React from 'react';
import { YStack, XStack, Text, Button, Switch } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export interface SettingsItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  type: 'toggle' | 'navigation' | 'button' | 'destructive';
  value?: boolean;
  action?: () => void;
  route?: string;
  color?: string;
  disabled?: boolean;
}

export interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsSectionComponentProps {
  section: SettingsSection;
  onItemPress: (item: SettingsItem) => void;
}

export default function SettingsSectionComponent({ 
  section, 
  onItemPress 
}: SettingsSectionComponentProps) {
  
  const renderSettingItem = (item: SettingsItem, index: number) => {
    const itemColor = item.color || (item.type === 'destructive' ? '#dc3545' : '#333');
    const isLastItem = index === section.items.length - 1;
    
    return (
      <Button 
        key={item.id} 
        unstyled 
        onPress={() => onItemPress(item)}
        disabled={item.disabled}
        opacity={item.disabled ? 0.5 : 1}
      >
        <XStack 
          ai="center" 
          jc="space-between" 
          py={16} 
          px={20} 
          borderBottomWidth={isLastItem ? 0 : 1} 
          borderBottomColor="#f0f0f0"
        >
          <XStack ai="center" f={1} gap={16}>
            <YStack 
              w={36} 
              h={36} 
              br={18} 
              bg={item.type === 'destructive' ? `${itemColor}20` : '#f8f9fa'} 
              ai="center" 
              jc="center"
            >
              <Ionicons 
                name={item.icon as any} 
                size={18} 
                color={item.type === 'destructive' ? itemColor : '#4a8a28'} 
              />
            </YStack>

            <YStack f={1}>
              <Text 
                fontSize={14} 
                fontWeight="500" 
                color={itemColor} 
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text 
                  fontSize={12} 
                  color="#6c757d" 
                  mt={2} 
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              )}
            </YStack>
          </XStack>

          <XStack ai="center" gap={12}>
            {item.type === 'toggle' && (
              <Switch 
                size="$3" 
                checked={item.value || false} 
                onCheckedChange={() => onItemPress(item)}
                disabled={item.disabled}
              >
                <Switch.Thumb animation="bouncy" />
              </Switch>
            )}
            {(item.type === 'navigation' || item.type === 'button') && (
              <Ionicons name="chevron-forward" size={16} color="#6c757d" />
            )}
          </XStack>
        </XStack>
      </Button>
    );
  };

  return (
    <YStack bg="white" br={16} overflow="hidden">
      <YStack px={20} py={16} bg="#f8f9fa">
        <Text 
          fontSize={12} 
          fontWeight="600" 
          color="#6c757d" 
          textTransform="uppercase"
        >
          {section.title}
        </Text>
      </YStack>
      
      <YStack>
        {section.items.map((item, index) => renderSettingItem(item, index))}
      </YStack>
    </YStack>
  );
}