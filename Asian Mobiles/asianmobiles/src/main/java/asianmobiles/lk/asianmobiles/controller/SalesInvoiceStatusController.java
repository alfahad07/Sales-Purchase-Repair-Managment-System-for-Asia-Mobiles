package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.EmployeeStatus;
import asianmobiles.lk.asianmobiles.entity.SalesInvoiceStatus;
import asianmobiles.lk.asianmobiles.repository.EmployeeStatusRepository;
import asianmobiles.lk.asianmobiles.repository.SalesInvoiceStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/salesinvoicestatus")
public class SalesInvoiceStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SalesInvoiceStatusRepository salesInvoiceStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SalesInvoiceStatus> findAll (){

        return salesInvoiceStatusDao.findAll();

    }

}
