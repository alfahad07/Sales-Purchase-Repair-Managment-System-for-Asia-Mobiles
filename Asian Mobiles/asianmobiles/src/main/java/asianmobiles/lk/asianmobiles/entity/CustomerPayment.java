package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "sales_payment")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class CustomerPayment {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "bill_number")
    private String bill_number;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "paid_amount  ")
    private BigDecimal paid_amount;

    @Column(name = "balance_amount")
    private BigDecimal balance_amount;

    @Column(name = "bank_branch_name")
    private String bank_branch_name;

    @Column(name = "bank_account_number")
    private String bank_account_number;

    @Column(name = "account_holder_name")
    private String account_holder_name;

    @Column(name = "deposite_or_transfered_datetime")
    private String deposite_or_transfered_datetime;

    @Column(name = "cheque_date")
    private LocalDate cheque_date;

    @Column(name = "cheque_number")
    private String cheque_number;

    @Column(name = "note")
    private String note;


    //DATES AND TIMES
    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;


    //FORIEGN KEYS
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "sales_invoice_id", referencedColumnName = "id")
    private SalesInvoice sales_invoice_id;

    @ManyToOne
    @JoinColumn(name = "pre_order_id", referencedColumnName = "id")
    private PreOrder pre_order_id;

    @ManyToOne
    @JoinColumn(name = "payment_method_id", referencedColumnName = "id")
    private PaymentMethod payment_method_id;

    @ManyToOne
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    private Bank bank_id;

    @ManyToOne
    @JoinColumn(name = "payment_status_id", referencedColumnName = "id")
    private PaymentStatus payment_status_id;


    //USERS DETAILS
    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;



    public CustomerPayment(Integer id, String bill_number, SalesInvoice sales_invoice_id, BigDecimal total_amount, PaymentMethod payment_method_id, PaymentStatus payment_status_id){

        //CLASS ID                  = PARAMETER ID
        this.id                     = id;
        this.bill_number            = bill_number;
        this.total_amount           = total_amount;
        this.sales_invoice_id       = sales_invoice_id ;
        this.payment_method_id      = payment_method_id;
        this.payment_status_id      = payment_status_id;

    }



}
