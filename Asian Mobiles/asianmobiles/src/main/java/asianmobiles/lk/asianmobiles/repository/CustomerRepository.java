package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.Employee;
import asianmobiles.lk.asianmobiles.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("select c from Customer c where c.nic = ?1")
    Customer getByNIC(String nic);

    Customer findCustomerByEmail(String email);

    @Query(value = "select new Customer (c.id, c.fullname, c.nic, c.mobile) from Customer c")
    List<Customer> list();

}
