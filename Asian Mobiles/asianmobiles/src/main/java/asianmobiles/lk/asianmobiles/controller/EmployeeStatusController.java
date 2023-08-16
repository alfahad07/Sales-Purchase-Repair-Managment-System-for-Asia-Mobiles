package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.EmployeeStatus;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import asianmobiles.lk.asianmobiles.repository.EmployeeStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/employeestatus")
public class EmployeeStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private EmployeeStatusRepository employeeStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<EmployeeStatus> findAll (){

        return employeeStatusDao.findAll();

    }

}
