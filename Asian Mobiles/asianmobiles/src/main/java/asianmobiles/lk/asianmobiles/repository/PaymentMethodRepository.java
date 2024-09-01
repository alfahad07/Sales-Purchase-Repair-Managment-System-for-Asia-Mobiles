package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {

    @Query(value = "select pm from PaymentMethod pm where pm.name<>'Card' ")
    List<PaymentMethod>paymentMethodwithoutCard();

    @Query(value = "select pm from PaymentMethod pm where pm.name<>'Bank Payment' and pm.name<>'Cheque'")
    List<PaymentMethod>paymentMethodwithoutBankAndCheque();

}
