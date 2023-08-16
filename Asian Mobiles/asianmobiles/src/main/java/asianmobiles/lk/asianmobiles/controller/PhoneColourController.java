package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.PhoneColour;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import asianmobiles.lk.asianmobiles.repository.PhoneColourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/modelcolour")
public class PhoneColourController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PhoneColourRepository phoneColourDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PhoneColour> findAll (){

        return phoneColourDao.findAll();

    }

}
