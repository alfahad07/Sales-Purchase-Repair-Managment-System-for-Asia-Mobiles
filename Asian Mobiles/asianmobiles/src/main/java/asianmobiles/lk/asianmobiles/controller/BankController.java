package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Bank;
import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.repository.BankRepository;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/bank")
public class BankController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private BankRepository bankDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Bank> findAll (){

        return bankDao.findAll();

    }


}
