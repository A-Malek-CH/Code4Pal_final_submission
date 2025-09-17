import { YStack, Button, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MatchFound() {
  return (
    <YStack f={1} bg="white" jc="center" ai="center" gap={20} px={20}>
      <Ionicons name="checkmark-circle" size={100} color="#4a8a28" />
      <Text fontSize={28} fontWeight="700">
        Match Found!
      </Text>
      <Text fontSize={16} color="#666" textAlign="center">
        You’ve been matched with a mission. Let’s get started!
      </Text>

      <Button
        bg="#4a8a28"
        h={55}
        br={12}
        w="100%"
        onPress={() => router.push("/missiondetails")}
      >
        <Text color="white" fontSize={16} fontWeight="600">
          View Mission
        </Text>
      </Button>

      <Button
        bg="#F6F6F6"
        h={55}
        br={12}
        w="100%"
        onPress={() => router.push("/discover")}
      >
        <Text color="#333" fontSize={16} fontWeight="600">
          Back to Discover
        </Text>
      </Button>
    </YStack>
  );
}
