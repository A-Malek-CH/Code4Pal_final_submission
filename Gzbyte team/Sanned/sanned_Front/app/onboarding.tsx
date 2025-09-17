import { useState } from "react";
import { YStack, XStack, Button, Text, Image } from "tamagui";
import { router } from "expo-router";
import { useAppStore } from "~/store/index";

const slides = [
  {
    id: 1,
    title: "Welcome to Sanad",
    description: "Connect with people in need and help make a difference.",
    image: require("~/assets/logo.jpg"),
  },
  {
    id: 2,
    title: "Find Missions Nearby",
    description: "Discover missions around you and offer your support.",
    image: require("~/assets/images/scarf.png"),
  },
  {
    id: 3,
    title: "Start Helping Today",
    description: "Join missions and contribute directly to your community.",
    image: require("~/assets/images/stamp.png"),
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useAppStore();

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      // Mark onboarding as completed and navigate to login
      completeOnboarding();
      router.replace("/login");
    }
  };

  const skip = () => {
    completeOnboarding();
    router.replace("/login");
  };

  return (
    <YStack f={1} bg="white" jc="center" ai="center" px={20} gap={20}>
      {/* Skip button */}
      {step < slides.length - 1 && (
        <YStack position="absolute" top={60} right={20}>
          <Button unstyled onPress={skip}>
            <Text fontSize={16} color="#6c757d">Skip</Text>
          </Button>
        </YStack>
      )}

      {/* Progress indicators */}
      <YStack position="absolute" top={60} left={20}>
        <XStack gap={8}>
          {slides.map((_, index) => (
            <YStack
              key={index}
              w={8}
              h={8}
              br={4}
              bg={index === step ? "#4a8a28" : "#e0e0e0"}
            />
          ))}
        </XStack>
      </YStack>

      <Image 
        source={slides[step].image} 
        width={250} 
        height={250}
        borderRadius={20}
      />
      
      <Text fontSize={26} fontWeight="700" textAlign="center" color="#333">
        {slides[step].title}
      </Text>
      
      <Text fontSize={16} color="#666" textAlign="center" lineHeight={24}>
        {slides[step].description}
      </Text>

      <Button
        bg="#4a8a28"
        h={55}
        br={12}
        w="100%"
        onPress={next}
        mt={20}
      >
        <Text color="white" fontSize={16} fontWeight="600">
          {step === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </Button>

      {/* Step indicator text */}
      <Text fontSize={14} color="#6c757d" mt={10}>
        {step + 1} of {slides.length}
      </Text>
    </YStack>
  );
}
