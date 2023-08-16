package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("select e from Employee e where e.nic = ?1")
    Employee getByNIC(String nic);

    Employee findEmployeeByEmail(String email);

    @Query(value = "select lpad(max(e.number)+1,4,'0') FROM asian_mobile_store.employee as e;" ,nativeQuery = true)
    String nextNumber();

    @Query(value = "select new Employee (e.id, e.callingname, e.number, e.fullname, e.nic, e.mobile, e.email, e.employeestatus_id)from Employee e order by e.id desc ")
    List<Employee> findAll();

}
