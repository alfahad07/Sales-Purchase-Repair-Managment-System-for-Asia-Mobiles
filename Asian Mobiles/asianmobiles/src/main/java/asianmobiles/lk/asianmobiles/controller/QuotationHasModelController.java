package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.QuotationHasModel;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import asianmobiles.lk.asianmobiles.repository.QuotationHasModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationhasmodel")
public class QuotationHasModelController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private QuotationHasModelRepository quotationHasModelDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationHasModel> findAll (){

        return quotationHasModelDao.findAll();

    }

    @GetMapping(value = "/listbymodelpurchaseprice/{qid}/{mid}", produces = "application/json")
    public QuotationHasModel modelPurchasePriceByPurchaseOrderModel(@PathVariable("qid") Integer qid, @PathVariable("mid") Integer mid) {

        return quotationHasModelDao.findByPurchaseOrderModelToGetPurchasePrice(qid,mid);

    }

}
