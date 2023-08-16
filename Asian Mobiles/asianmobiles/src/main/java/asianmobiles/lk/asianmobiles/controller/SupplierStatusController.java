package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.SupplierStatus;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import asianmobiles.lk.asianmobiles.repository.SupplierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SupplierStatusRepository supplierStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierStatus> findAll (){

        return supplierStatusDao.findAll();

    }

}
