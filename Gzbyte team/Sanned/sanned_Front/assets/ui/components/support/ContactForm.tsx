import React from 'react';
import { Alert } from 'react-native';
import { YStack, Text, Button, Input } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as MailComposer from 'expo-mail-composer';

// Validation Schema for contact form
const contactFormSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
  category: z.string().min(1, 'Please select a category'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

export default function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const categories = [
    'General Support',
    'Technical Issue',
    'Account Problem', 
    'Feature Request',
    'Bug Report',
    'Privacy Concern',
    'Other'
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: '',
      message: '',
      category: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if mail composer is available
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Email Not Available',
          'Please send your message to support@communityhelper.com directly',
          [{ text: 'OK' }]
        );
        return;
      }

      // Compose email
      await MailComposer.composeAsync({
        recipients: ['support@communityhelper.com'],
        subject: `[${data.category}] ${data.subject}`,
        body: `Category: ${data.category}\n\nMessage:\n${data.message}\n\n---\nSent from Community Helper App`,
      });

      Alert.alert('Thank You!', 'Your message has been prepared. Please send it to reach our support team.');
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to compose email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = watch('category');

  return (
    <YStack gap={24}>
      <Text fontSize={20} fontWeight="700" color="#333">
        Contact Support
      </Text>
      
      <Text fontSize={15} color="#666" lineHeight={22}>
        Need help? Send us a message and we'll get back to you as soon as possible.
      </Text>

      {/* Category Selection */}
      <YStack gap={12}>
        <Text fontSize={16} fontWeight="600" color="#333">
          Category *
        </Text>
        <YStack gap={8}>
          {categories.map((category) => (
            <Controller
              key={category}
              name="category"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Button
                  bg={value === category ? '#4a8a28' : 'white'}
                  borderColor={value === category ? '#4a8a28' : '#e5e5e5'}
                  borderWidth={1}
                  onPress={() => onChange(category)}
                  jc="flex-start"
                  h={44}
                >
                  <Text 
                    color={value === category ? 'white' : '#666'}
                    fontSize={15}
                  >
                    {category}
                  </Text>
                </Button>
              )}
            />
          ))}
        </YStack>
        {errors.category && (
          <Text color="#dc3545" fontSize={14}>
            {errors.category.message}
          </Text>
        )}
      </YStack>

      {/* Subject Field */}
      <YStack gap={8}>
        <Text fontSize={16} fontWeight="600" color="#333">
          Subject *
        </Text>
        <Controller
          name="subject"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Brief description of your issue or question"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              bg="white"
              borderColor={errors.subject ? '#dc3545' : '#e5e5e5'}
              borderWidth={1}
              borderRadius={12}
              h={44}
              px={16}
              fontSize={15}
            />
          )}
        />
        {errors.subject && (
          <Text color="#dc3545" fontSize={14}>
            {errors.subject.message}
          </Text>
        )}
      </YStack>

      {/* Message Field */}
      <YStack gap={8}>
        <Text fontSize={16} fontWeight="600" color="#333">
          Message *
        </Text>
        <Controller
          name="message"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Please provide as much detail as possible..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              bg="white"
              borderColor={errors.message ? '#dc3545' : '#e5e5e5'}
              borderWidth={1}
              borderRadius={12}
              h={120}
              px={16}
              py={12}
              fontSize={15}
              multiline
              textAlignVertical="top"
            />
          )}
        />
        {errors.message && (
          <Text color="#dc3545" fontSize={14}>
            {errors.message.message}
          </Text>
        )}
      </YStack>

      {/* Submit Button */}
      <Button
        bg="#4a8a28"
        color="white"
        h={50}
        borderRadius={12}
        fontSize={16}
        fontWeight="600"
        onPress={handleSubmit(onSubmit)}
        opacity={isSubmitting ? 0.7 : 1}
        pressStyle={{ opacity: 0.8 }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </YStack>
  );
}