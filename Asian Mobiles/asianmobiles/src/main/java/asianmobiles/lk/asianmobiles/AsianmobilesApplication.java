package asianmobiles.lk.asianmobiles;

import asianmobiles.lk.asianmobiles.entity.Role;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.RoleRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@RestController
public class AsianmobilesApplication {

	@Autowired
	private UserRepository userDao;

	@Autowired
	private RoleRepository roleDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(AsianmobilesApplication.class, args);
	}


	@GetMapping(value = "/createadmin")
	public String createAdmin() {

		System.out.println("5555555");
		User extAdminUser = userDao.findUserByUsername("Admin");


		if (extAdminUser == null) {

			System.out.println("2222222");
			User newAdminUser = new User();
			newAdminUser.setUsername("Admin");
			newAdminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
			newAdminUser.setEmail("Admin123@gmail.com");
			newAdminUser.setStatus(true);
			newAdminUser.setAddeddatetime(LocalDateTime.now());

			Set<Role> userRole = new HashSet<>();
			userRole.add(roleDao.getReferenceById(1));

			newAdminUser.setRole(userRole);

			userDao.save(newAdminUser);// Saving the created user called "Admin" into the user table in the database.

		}

		return "<script> window.location.replace('/login');</script>";

	}

}