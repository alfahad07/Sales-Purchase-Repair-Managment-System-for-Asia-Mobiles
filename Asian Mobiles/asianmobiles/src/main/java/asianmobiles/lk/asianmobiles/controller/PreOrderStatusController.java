package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.ModelStatus;
import asianmobiles.lk.asianmobiles.entity.PreOrderStatus;
import asianmobiles.lk.asianmobiles.repository.ModelStatusRepository;
import asianmobiles.lk.asianmobiles.repository.PreOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/preorderstatus")
public class PreOrderStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PreOrderStatusRepository preOrderStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PreOrderStatus> findAll (){

        return preOrderStatusDao.findAll();

    }

}
