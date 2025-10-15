package HotelApp.com.example.HotelApp.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ProfileUpdateDTO {

    @NotBlank
    private String name;

    private String password; // optional

    private String image; // ✅ added field for Cloudinary image URL
}


