package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Employee;
import asianmobiles.lk.asianmobiles.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

    User findUserByUsername (String username);

    User findUserByEmail(String email);


    @Query("select new User(u.id,u.username,u.employee_id,u.email,u.status) from User u" + " where u.username <> 'Admin' order by u.id DESC ")
    List<User> findAll();

    @Query("select u from User u where u.employee_id.id=?1")
    User findUserByEmployee(Integer employeeid);
}
