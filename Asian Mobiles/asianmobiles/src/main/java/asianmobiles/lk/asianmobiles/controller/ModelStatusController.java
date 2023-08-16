package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.ModelStatus;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import asianmobiles.lk.asianmobiles.repository.ModelStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/modelstatus")
public class ModelStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ModelStatusRepository modelStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ModelStatus> findAll (){

        return modelStatusDao.findAll();

    }

}
