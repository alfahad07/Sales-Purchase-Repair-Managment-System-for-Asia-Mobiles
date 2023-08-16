package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.QuotationRequestStatus;
import asianmobiles.lk.asianmobiles.entity.QuotationStatus;
import asianmobiles.lk.asianmobiles.repository.QuotationRequestStatusRepository;
import asianmobiles.lk.asianmobiles.repository.QuotationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationstatus")
public class QuotationStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private QuotationStatusRepository quotationStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationStatus> findAll (){

        return quotationStatusDao.findAll();

    }

}
