package HotelApp.com.example.HotelApp.controller;

import HotelApp.com.example.HotelApp.config.CloudinaryConfig;
import HotelApp.com.example.HotelApp.dto.*;
import HotelApp.com.example.HotelApp.security.JwtUtils;
import HotelApp.com.example.HotelApp.service.AuthService;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;
    private final CloudinaryConfig cloudinaryConfig;
    private final Cloudinary cloudinary;

    // ------------------- SIGNUP -------------------
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> register(@Validated @RequestBody UserRequestDTO dto) {
        UserResponseDTO user = authService.register(dto);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Registration successful", user));
    }

//    // ------------------- LOGIN -------------------
//    @PostMapping("/auth/login")
//    public ResponseEntity<ApiResponseDTO<String>> login(
//            @Validated @RequestBody LoginRequestDTO dto,
//            HttpServletResponse response) {
//
//        try {
//            String token = authService.login(dto);
//
//            Cookie cookie = new Cookie("token", token);
//            cookie.setHttpOnly(true);
//            cookie.setPath("/");
//            cookie.setMaxAge(7 * 24 * 60 * 60);
//            response.addCookie(cookie);
//
//            return ResponseEntity.ok(
//                    new ApiResponseDTO<>(true, "Login successful", "Token set in HttpOnly cookie")
//            );
//
//        } catch (RuntimeException e) {
//            return ResponseEntity
//                    .status(HttpStatus.UNAUTHORIZED)
//                    .body(new ApiResponseDTO<>(false, e.getMessage(), null));
//        } catch (Exception e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiResponseDTO<>(false, "Something went wrong", null));
//        }
//    }

    // ------------------- LOGIN -------------------
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponseDTO<String>> login(
            @Validated @RequestBody LoginRequestDTO dto,
            HttpServletResponse response) {

        try {
            String token = authService.login(dto);

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            // ✅ Local dev: Secure false, SameSite not set
            // cookie.setSecure(false); // optional, default false
            response.addCookie(cookie);

            return ResponseEntity.ok(
                    new ApiResponseDTO<>(true, "Login successful", "Token set in HttpOnly cookie")
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDTO<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDTO<>(false, "Something went wrong", null));
        }
    }

    // ------------------- LOGOUT -------------------
    @PostMapping("/auth/logout")
    public ResponseEntity<ApiResponseDTO<String>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        // ✅ Local dev: Secure false
        // cookie.setSecure(false); // optional
        response.addCookie(cookie);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Logged out successfully", null));
    }

    // ------------------- GET PROFILE -------------------
    @GetMapping("/auth/profile")
    public ResponseEntity<ApiResponseDTO<?>> getProfile(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token cookie", null));

            String userId = jwtUtils.getUserIdFromToken(token);
            UserResponseDTO user = authService.getProfile(userId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile fetched successfully", user));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDTO<>(false, "Invalid or expired token: " + e.getMessage(), null));
        }
    }

    // ------------------- UPDATE PROFILE -------------------
    @PutMapping("/auth/profile")
    public ResponseEntity<ApiResponseDTO<?>> updateProfile(
            HttpServletRequest request,
            @RequestParam("name") String name,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token cookie", null));

            String userId = jwtUtils.getUserIdFromToken(token);

            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = cloudinaryConfig.uploadFile(cloudinary, image);
            }

            ProfileUpdateDTO dto = new ProfileUpdateDTO();
            dto.setName(name);
            dto.setPassword(password);
            dto.setImage(imageUrl);

            UserResponseDTO updatedUser = authService.updateProfile(userId, dto);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile updated successfully", updatedUser));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to update profile: " + e.getMessage(), null));
        }
    }

    // ------------------- HOME -------------------
    @GetMapping("/home")
    public ResponseEntity<ApiResponseDTO<HomeDTO>> home() {

        HomeDTO homeData = new HomeDTO(
                "Welcome to HotelApp — your trusted hotel booking companion!",
                "Find the best hotels, book instantly, and travel with confidence.",
                List.of(
                        "Over 5000+ verified hotels across 50 cities",
                        "Instant booking confirmation",
                        "Secure payments and easy refunds",
                        "24x7 customer support"
                ),
                List.of("Goa", "Manali", "Jaipur", "Shimla", "Bangalore")
        );

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Home content fetched successfully.", homeData));
    }

    // ------------------- ABOUT -------------------
    @GetMapping("/about")
    public ResponseEntity<ApiResponseDTO<AboutDTO>> about() {

        AboutDTO aboutData = new AboutDTO(
                "HotelApp is a modern hotel booking platform built to make your travel planning effortless. "
                        + "From luxury resorts to budget stays, we help you discover and book the perfect place for your trip.",
                "Providing the best hotel booking experience with simplicity and trust.",
                "To be the most reliable platform for travelers worldwide.",
                List.of(
                        "Customer Satisfaction",
                        "Transparency and Trust",
                        "Innovation and Growth",
                        "Commitment to Quality"
                )
        );

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "About content fetched successfully.", aboutData));
    }


    // ------------------- BECOME SELLER -------------------
    @PostMapping("/auth/become-seller")
    public ResponseEntity<ApiResponseDTO<?>> becomeSeller(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token cookie", null));

            String userId = jwtUtils.getUserIdFromToken(token);
            UserResponseDTO user = authService.updateRoleToSeller(userId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Congratulations! You are now a SELLER.", user));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDTO<>(false, "Failed to update role: " + e.getMessage(), null));
        }
    }

    // ------------------- ADD ROOM -------------------
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponseDTO<RoomResponseDTO>> addRoom(
            HttpServletRequest request,
            @RequestParam("hotelName") String hotelName,
            @RequestParam("location") String location,
            @RequestParam("roomType") String roomType,
            @RequestParam("price") Double price,
            @RequestParam(value = "available", required = false, defaultValue = "true") boolean available,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String sellerId = jwtUtils.getUserIdFromToken(token);

            RoomRequestDTO dto = new RoomRequestDTO();
            dto.setHotelName(hotelName);
            dto.setLocation(location);
            dto.setRoomType(roomType);
            dto.setPrice(price);
            dto.setAvailable(available);

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : images) {
                    String url = cloudinaryConfig.uploadFile(cloudinary, file);
                    imageUrls.add(url);
                }
                dto.setImages(imageUrls);
            }

            RoomResponseDTO room = authService.addRoom(sellerId, dto);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Room added successfully", room));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to add room: " + e.getMessage(), null));
        }
    }

    // ------------------- UPDATE ROOM -------------------
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponseDTO<RoomResponseDTO>> updateRoom(
            HttpServletRequest request,
            @PathVariable String roomId,
            @RequestParam("hotelName") String hotelName,
            @RequestParam("location") String location,
            @RequestParam("roomType") String roomType,
            @RequestParam("price") Double price,
            @RequestParam("available") Boolean available,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String sellerId = jwtUtils.getUserIdFromToken(token);

            RoomRequestDTO dto = new RoomRequestDTO();
            dto.setHotelName(hotelName);
            dto.setLocation(location);
            dto.setRoomType(roomType);
            dto.setPrice(price);
            dto.setAvailable(available);

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : images) {
                    String url = cloudinaryConfig.uploadFile(cloudinary, file);
                    imageUrls.add(url);
                }
                dto.setImages(imageUrls);
            }

            RoomResponseDTO updated = authService.updateRoom(roomId, sellerId, dto);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Room updated successfully", updated));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to update room: " + e.getMessage(), null));
        }
    }

    // ------------------- GET ROOMS BY SELLER -------------------
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponseDTO<List<RoomResponseDTO>>> getRooms(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String sellerId = jwtUtils.getUserIdFromToken(token);
            List<RoomResponseDTO> rooms = authService.getRoomsBySeller(sellerId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Rooms fetched successfully", rooms));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch rooms: " + e.getMessage(), null));
        }
    }

    // ------------------- DELETE ROOM -------------------
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponseDTO<String>> deleteRoom(
            HttpServletRequest request,
            @PathVariable String roomId) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String sellerId = jwtUtils.getUserIdFromToken(token);
            authService.deleteRoom(roomId, sellerId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Room deleted successfully", null));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to delete room: " + e.getMessage(), null));
        }
    }

    // ------------------- GET ALL ROOMS -------------------
    @GetMapping("/all-rooms")
    public ResponseEntity<ApiResponseDTO<List<RoomResponseDTO>>> getAllRooms(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            List<RoomResponseDTO> allRooms = authService.getAllRooms();
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "All rooms fetched successfully", allRooms));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch all rooms: " + e.getMessage(), null));
        }
    }

    // ------------------- CREATE BOOKING -------------------
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> createBooking(
            HttpServletRequest request,
            @RequestBody BookingRequestDTO dto) {

        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String userId = jwtUtils.getUserIdFromToken(token);

            BookingResponseDTO booking = authService.createBooking(userId, dto);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Booking created successfully", booking));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to create booking: " + e.getMessage(), null));
        }
    }

    // ------------------- GET BOOKINGS BY USER -------------------
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponseDTO<List<BookingResponseDTO>>> getUserBookings(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String userId = jwtUtils.getUserIdFromToken(token);

            List<BookingResponseDTO> bookings = authService.getBookingsByUser(userId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "User bookings fetched successfully", bookings));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch bookings: " + e.getMessage(), null));
        }
    }

    // ------------------- DELETE BOOKING -------------------
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponseDTO<String>> deleteBooking(
            HttpServletRequest request,
            @PathVariable String bookingId) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String userId = jwtUtils.getUserIdFromToken(token);

            authService.deleteBooking(userId, bookingId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Booking cancelled successfully", null));

        } catch (ResponseStatusException e) {
            // Updated to use HttpStatus from the exception
            return ResponseEntity.status(e.getStatusCode())
                    .body(new ApiResponseDTO<>(false, e.getReason() != null ? e.getReason() : "Error occurred", null));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to cancel booking: " + e.getMessage(), null));
        }
    }

    @GetMapping("/seller/bookings")
    public ResponseEntity<ApiResponseDTO<List<SellerBookingDTO>>> getSellerBookings(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));

            String sellerId = jwtUtils.getUserIdFromToken(token);
            List<SellerBookingDTO> bookings = authService.getBookingsForSeller(sellerId);

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Seller bookings fetched successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch seller bookings: " + e.getMessage(), null));
        }
    }

    // ------------------- GET ARCHIVED BOOKINGS BY USER -------------------
    @GetMapping("/bookings/archive")
    public ResponseEntity<ApiResponseDTO<List<BookingArchiveDTO>>> getArchivedBookings(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));
            }

            String userId = jwtUtils.getUserIdFromToken(token);
            List<BookingArchiveDTO> archivedBookings = authService.getArchivedBookingsByUser(userId);

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Archived bookings fetched successfully", archivedBookings));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch archived bookings: " + e.getMessage(), null));
        }
    }

    // ------------------- GET SELLER BOOKING HISTORY -------------------
    @GetMapping("/seller/bookings/history")
    public ResponseEntity<ApiResponseDTO<List<SellerBookingArchiveDTO>>> getSellerBookingHistory(HttpServletRequest request) {
        try {
            String token = extractTokenFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponseDTO<>(false, "Missing token", null));
            }

            // 🔹 JWT se sellerId nikalna
            String sellerId = jwtUtils.getUserIdFromToken(token);

            // 🔹 Service call to fetch seller's archived bookings
            List<SellerBookingArchiveDTO> history = authService.getSellerBookingHistory(sellerId);

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Seller booking history fetched successfully", history));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseDTO<>(false, "Failed to fetch seller booking history: " + e.getMessage(), null));
        }
    }

    // ------------------- HELPER -------------------
    private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
