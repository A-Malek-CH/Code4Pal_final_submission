package handinhandstore.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.service.AuthenticationService;

import handinhandstore.demo.dto.UserLoginRequest;
import handinhandstore.demo.service.EmailService;
import handinhandstore.demo.service.PasswordResetService;
import handinhandstore.demo.repository.UserRepository;
import handinhandstore.demo.repository.PasswordResetTokenRepository;
import handinhandstore.demo.dto.ResetPasswordRequest;
import handinhandstore.demo.dto.VerifyCodeRequest;

@RestController
public class AuthenticationController {

    private final AuthenticationService authService;
    private final PasswordResetService resetService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    public AuthenticationController(AuthenticationService authService, PasswordResetService resetService) {
        this.authService = authService;
        this.resetService = resetService;
    }

    @GetMapping("/getUserById")
    public User getById(@RequestParam Long id) {
        System.out.println("-----------------------------------------------------------------received id");
        return authService.getById(id); 
    }

    @PostMapping("/UserLogin")
    public User login(@RequestBody UserLoginRequest userLoginRequest) {
        System.out.println("Received email: " + userLoginRequest.getEmail());
        System.out.println("Received password: " + userLoginRequest.getPassword());
        return authService.login(userLoginRequest.getEmail(), userLoginRequest.getPassword());
    }


    @PostMapping("/UserRegistration")
    public User register(@RequestBody User user) {
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return authService.userRegisteration(user);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("/n/n/n/n*/n*/n***Forget Password");
        System.out.println("The email is :"+email);
        String code = emailService.sendResetCode(email);

        // Check that the user with the email exist
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()){
            return "No user found with this email: " + email;
        }

        // Save token with transaction
        resetService.createOrUpdateResetToken(email, code);

        return "Reset code sent to " + email;
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody VerifyCodeRequest request) {
        String email = request.getEmail();
        String code = request.getCode();

        System.out.println("\n\n\n*\n*\n*\n*** VERIFY CODE");
        System.out.println("The code: "+code);
        System.out.println("The email: "+email);

        Map<String, Object> response = new HashMap<>();

        return tokenRepo.findByEmailAndCode(email, code)
                .filter(token -> token.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(token -> {
                response.put("success", true);
                response.put("message", "Code verified. You can reset your password.");
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("message", "Invalid or expired code.");
                return ResponseEntity.badRequest().body(response);
            });
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        String newPassword = request.getNewPassword();

        authService.updatePassword(email, newPassword);

        return ResponseEntity.ok("Password reset successful!");
    }
}



