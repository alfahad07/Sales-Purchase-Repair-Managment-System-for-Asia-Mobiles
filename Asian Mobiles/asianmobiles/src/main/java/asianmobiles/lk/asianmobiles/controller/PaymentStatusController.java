package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.PaymentMethod;
import asianmobiles.lk.asianmobiles.entity.PaymentStatus;
import asianmobiles.lk.asianmobiles.repository.PaymentMethodRepository;
import asianmobiles.lk.asianmobiles.repository.PaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentstatus")
public class PaymentStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PaymentStatusRepository paymentStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PaymentStatus> findAll (){

        return paymentStatusDao.findAll();

    }


}
