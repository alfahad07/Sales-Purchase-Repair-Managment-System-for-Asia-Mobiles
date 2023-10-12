package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Entity annotation is used to convert as persistence API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "sales_invoice")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstruction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstruction (customized constructor) automatically without coding.
@AllArgsConstructor

public class SalesInvoice {

    @Id //persistance API require Primary key so ID annotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) //GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increment so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "bill_number")
    private String bill_number;

    @Column(name = "customer_name")
    private String customer_name;

    @Column(name = "customer_address")
    private String customer_address;

    @Column(name = "contact_number")
    private String contact_number;

    @Column(name = "customer_nic")
    private String customer_nic;

    @Column(name = "customer_email")
    private String customer_email;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "discount")
    private String discount;

    @Column(name = "tax")
    private String tax;

    @Column(name = "net_amount")
    private String net_amount;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @Column(name = "note")
    private String note;



    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "sales_invoice_status_id",referencedColumnName = "id")
    private SalesInvoiceStatus sales_invoice_status_id;

    @ManyToOne
    @JoinColumn(name = "pre_order_id",referencedColumnName = "id")
    private PreOrder pre_order_id;



    @ManyToOne
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;


    @OneToMany(mappedBy = "sales_invoice_id", orphanRemoval = true , cascade = CascadeType.ALL)
    List<SalesInvoiceHasItems> salesInvoiceHasItemsList ;


}
