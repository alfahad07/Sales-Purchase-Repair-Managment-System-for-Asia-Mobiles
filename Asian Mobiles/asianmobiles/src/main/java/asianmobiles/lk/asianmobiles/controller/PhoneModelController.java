package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.PhoneModel;
import asianmobiles.lk.asianmobiles.entity.PhoneSeries;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import asianmobiles.lk.asianmobiles.repository.PhoneModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/phonemodel")
public class PhoneModelController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PhoneModelRepository phoneModelDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PhoneModel> findAll (){

        return phoneModelDao.findAll();

    }


    //GET MAPPING to get brand by given Brand for filtering [/phonemodel/listbyphoneseries?cid=]
    @GetMapping(value = "/listbyphoneseries/{cid}", produces = "application/json")
    public List<PhoneModel> phoneModelListByPhoneSeries(@PathVariable("cid") Integer cid) {

        return phoneModelDao.findByPhoneSeries(cid);

    }


}
