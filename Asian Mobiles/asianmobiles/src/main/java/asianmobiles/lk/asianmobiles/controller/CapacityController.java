package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.Capacity;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import asianmobiles.lk.asianmobiles.repository.CapacityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/capacity")
public class CapacityController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CapacityRepository capacityDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Capacity> findAll (){

        return capacityDao.findAll();

    }

}
