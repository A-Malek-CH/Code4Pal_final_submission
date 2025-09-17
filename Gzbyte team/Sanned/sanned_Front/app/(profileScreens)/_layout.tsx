
import { SplashScreen, Stack } from 'expo-router';


export default function RootLayout() {


  return (
   
        
          <Stack>
             <Stack.Screen name="EditProfile" options={{ presentation: 'modal', headerShown:false } } />
              <Stack.Screen name="Notification" options={{ presentation: 'modal', headerShown:false } } />
            <Stack.Screen name="Settings" options={{ presentation: 'modal', headerShown:false } } />
              <Stack.Screen name="Support" options={{ presentation: 'modal', headerShown:false } } />
              <Stack.Screen name="change-password" options={{ presentation: 'modal', headerShown:false } } />
          </Stack>
       
  
  );
}
