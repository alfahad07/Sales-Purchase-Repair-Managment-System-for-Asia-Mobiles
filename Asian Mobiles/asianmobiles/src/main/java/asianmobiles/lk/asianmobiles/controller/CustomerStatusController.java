package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CustomerStatus;
import asianmobiles.lk.asianmobiles.entity.Designation;
import asianmobiles.lk.asianmobiles.repository.CustomerStatusRepository;
import asianmobiles.lk.asianmobiles.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerstatus")
public class CustomerStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CustomerStatusRepository customerStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerStatus> findAll (){

        return customerStatusDao.findAll();

    }

}
