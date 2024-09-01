package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CustomerStatus;
import asianmobiles.lk.asianmobiles.entity.RepairStatus;
import asianmobiles.lk.asianmobiles.repository.CustomerStatusRepository;
import asianmobiles.lk.asianmobiles.repository.RepairStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/repairstatus")
public class RepairStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private RepairStatusRepository repairStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<RepairStatus> findAll (){

        return repairStatusDao.findAll();

    }

}
