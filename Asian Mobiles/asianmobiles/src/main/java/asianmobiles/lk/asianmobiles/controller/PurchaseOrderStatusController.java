package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.PreOrderStatus;
import asianmobiles.lk.asianmobiles.entity.PurchaseOrder;
import asianmobiles.lk.asianmobiles.entity.PurchaseOrderStatus;
import asianmobiles.lk.asianmobiles.repository.PreOrderStatusRepository;
import asianmobiles.lk.asianmobiles.repository.PurchaseOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorderstatus")
public class PurchaseOrderStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PurchaseOrderStatusRepository purchaseOrderStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PurchaseOrderStatus> findAll (){

        return purchaseOrderStatusDao.findAll();

    }

}
