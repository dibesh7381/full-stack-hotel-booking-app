package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeDTO {
    private String welcomeMessage;
    private String tagline;
    private List<String> highlights;
    private List<String> featuredDestinations;
}
