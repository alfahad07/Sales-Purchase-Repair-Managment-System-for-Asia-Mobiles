package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.Designation;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import asianmobiles.lk.asianmobiles.repository.DesignationRepository;
import org.hibernate.exception.DataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/designation")
public class DesignationController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private DesignationRepository designationStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> findAll (){

        return designationStatusDao.findAll();

    }

}
