package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.QuotationRequestStatus;
import asianmobiles.lk.asianmobiles.entity.SupplierStatus;
import asianmobiles.lk.asianmobiles.repository.QuotationRequestStatusRepository;
import asianmobiles.lk.asianmobiles.repository.SupplierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationrequeststatus")
public class QuotationRequestStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private QuotationRequestStatusRepository quotationRequestStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationRequestStatus> findAll (){

        return quotationRequestStatusDao.findAll();

    }

}
