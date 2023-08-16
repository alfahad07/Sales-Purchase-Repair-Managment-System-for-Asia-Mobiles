package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.Capacity;
import asianmobiles.lk.asianmobiles.entity.PhoneSeries;
import asianmobiles.lk.asianmobiles.repository.CapacityRepository;
import asianmobiles.lk.asianmobiles.repository.PhoneSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/phoneseries")
public class PhoneSeriesController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PhoneSeriesRepository phoneSeriesDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PhoneSeries> findAll (){

        return phoneSeriesDao.findAll();

    }


    //GET MAPPING to get brand by given Brand for filtering [/brand/listbybrand?cid=]
    @GetMapping(value = "/listbybrand/{cid}", produces = "application/json")
    public List<PhoneSeries> brandListByBrand(@PathVariable("cid") Integer cid) {

        return phoneSeriesDao.findByBrand(cid);

    }


}
