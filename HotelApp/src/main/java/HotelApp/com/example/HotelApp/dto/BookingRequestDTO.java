package HotelApp.com.example.HotelApp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequestDTO {
    private String name;
    private Integer age;
    private String gender;
    private LocalDate bookingDate;
    private LocalDate leavingDate; // ✅ add this field
    private String roomId;
}

