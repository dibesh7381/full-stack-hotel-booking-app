package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AboutDTO {
    private String message;
    private String mission;
    private String vision;
    private List<String> values;
}
