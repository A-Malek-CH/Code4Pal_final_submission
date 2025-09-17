package handinhandstore.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public String sendResetCode(String toEmail) {
        // Generate a 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("store@handinhand.com"); // just a label
        message.setTo(toEmail);
        message.setSubject("Password Reset Code");
        message.setText("Your password reset code is: " + code);

        mailSender.send(message);

        return code;
    }
}
