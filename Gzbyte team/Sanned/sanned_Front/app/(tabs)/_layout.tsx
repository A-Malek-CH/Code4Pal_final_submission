import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const themeColor = "#528241"; // your theme color

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <XStack
      bg="#ffffffff"
      h={70}
      jc="space-around"
      ai="center"
      borderTopWidth={1}
      borderColor="#E8E6EA"
     
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const iconMap: { [key: string]: string } = {
          index: "home",
          two: "hand-heart",
          discover: "cards",
          three: "bell",
          four: "account",
        };

        const iconName = iconMap[route.name] || "circle";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1 }}
          >
            <YStack f={1} jc="center" ai="center" pos="relative">
              {isFocused && (
                <YStack
                  pos="absolute"
                  t={0}
                  w="50%"
                  h={3}
                  bg={themeColor}
                  br={999}
                />
              )}
              <Icon
                name={iconName}
                size={26}
                color={isFocused ? themeColor : "#999"}
              />
              <Text
                mt={2}
                fontSize={12}
                color={isFocused ? themeColor : "$gray10"}
              >
                {label}
              </Text>
            </YStack>
          </TouchableOpacity>
        );
      })}
    </XStack>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="two" options={{ title: "Favorites" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="three" options={{ title: "Notifications" }} />
      <Tabs.Screen name="four" options={{ title: "Profile" }} />
    </Tabs>
  );
}
