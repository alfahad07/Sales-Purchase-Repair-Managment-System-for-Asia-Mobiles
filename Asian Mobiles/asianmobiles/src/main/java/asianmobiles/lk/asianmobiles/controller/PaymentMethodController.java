package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Bank;
import asianmobiles.lk.asianmobiles.entity.PaymentMethod;
import asianmobiles.lk.asianmobiles.repository.BankRepository;
import asianmobiles.lk.asianmobiles.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentmethod")
public class PaymentMethodController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PaymentMethodRepository paymentMethodDao;

    @GetMapping(value = "/listforsupplier", produces = "application/json")
    public List<PaymentMethod> findAll (){

        return paymentMethodDao.paymentMethodwithoutCard();

    }


    @GetMapping(value = "/listforcustomer", produces = "application/json")
    public List<PaymentMethod> forCustomer (){

        return paymentMethodDao.paymentMethodwithoutBankAndCheque();

    }


}
