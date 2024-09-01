package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.PurchaseOrderHasModel;
import asianmobiles.lk.asianmobiles.entity.QuotationHasModel;
import asianmobiles.lk.asianmobiles.repository.PurchaseOrderHasModelRepository;
import asianmobiles.lk.asianmobiles.repository.QuotationHasModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorderhasmodel")
public class PurchaseOrderHasModelController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PurchaseOrderHasModelRepository purchaseOrderHasModelDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PurchaseOrderHasModel> findAll (){

        return purchaseOrderHasModelDao.findAll();

    }

    @GetMapping(value = "/listbymodelpurchaseorderquantity/{pid}/{mid}", produces = "application/json")
    public PurchaseOrderHasModel modelPurchasePriceByPurchaseOrderModel(@PathVariable("pid") Integer pid, @PathVariable("mid") Integer mid) {

        return purchaseOrderHasModelDao.findByPurchaseOrderModelOrderedQuantity(pid,mid);

    }

}
