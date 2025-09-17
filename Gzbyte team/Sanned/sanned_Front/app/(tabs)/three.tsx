import { YStack, XStack, Text, ScrollView, Card, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "~/store/index";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";

export default function Notifications() {
  const { notifications, user, loadNotifications, markNotificationAsRead } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user]);

  const onRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await loadNotifications(user.id);
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <YStack f={1} bg="white" px={20} py={20} jc="center" ai="center">
        <Text fontSize={18} color="#666" textAlign="center">
          Please log in to view notifications
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView 
      f={1} 
      bg="white" 
      px={20} 
      py={20}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <XStack ai="center" jc="space-between" mb={20}>
        <Text fontSize={26} fontWeight="700">
          Notifications
        </Text>
        {notifications.some(n => !n.isRead) && (
          <Text fontSize={14} color="#4a8a28" fontWeight="600">
            {notifications.filter(n => !n.isRead).length} unread
          </Text>
        )}
      </XStack>

      {notifications.length === 0 ? (
        <YStack ai="center" jc="center" py={60}>
          <YStack
            w={80}
            h={80}
            br={40}
            bg="#f8f9fa"
            ai="center"
            jc="center"
            mb={20}
          >
            <Ionicons name="notifications-outline" size={40} color="#6c757d" />
          </YStack>
          <Text fontSize={18} fontWeight="600" color="#333" mb={8}>
            No notifications yet
          </Text>
          <Text fontSize={14} color="#666" textAlign="center" maxWidth={250}>
            When you have new notifications, they'll appear here
          </Text>
        </YStack>
      ) : (
        <YStack gap={15}>
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              unstyled
              onPress={() => handleNotificationPress(notification.id, notification.isRead)}
            >
              <Card
                bg={notification.isRead ? "white" : "#f8fffe"}
                p={15}
                br={16}
                borderWidth={1}
                borderColor={notification.isRead ? "#E3E3E3" : "#4a8a28"}
                shadowColor="$shadowColor"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.05}
                shadowRadius={4}
                opacity={notification.isRead ? 0.8 : 1}
              >
                <XStack ai="center" gap={12}>
                  <XStack
                    w={40}
                    h={40}
                    br={20}
                    bg={`${notification.color || '#4a8a28'}15`}
                    jc="center"
                    ai="center"
                  >
                    <Ionicons 
                      name={notification.icon as any || 'notifications'} 
                      size={22} 
                      color={notification.color || '#4a8a28'} 
                    />
                  </XStack>

                  <YStack flex={1}>
                    <XStack ai="center" jc="space-between" mb={2}>
                      <Text 
                        fontSize={12} 
                        color={notification.color || '#4a8a28'} 
                        fontWeight="600"
                        textTransform="uppercase"
                      >
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <YStack w={8} h={8} br={4} bg="#4a8a28" />
                      )}
                    </XStack>
                    <Text 
                      fontSize={14} 
                      color="#333" 
                      fontWeight={notification.isRead ? "400" : "500"}
                      mb={3}
                    >
                      {notification.message}
                    </Text>
                    <Text fontSize={12} color="#888">
                      {formatTime(notification.createdAt)}
                    </Text>
                  </YStack>
                </XStack>
              </Card>
            </Button>
          ))}
        </YStack>
      )}
    </ScrollView>
  );
}