package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "purchase_order")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class PurchaseOrder {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.



    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "purchase_order_number")
    private String purchase_order_number;

    @Column(name = "required_date")
    private LocalDate required_date;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "note")
    private String note;



    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;



    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_status_id",referencedColumnName = "id")
    private PurchaseOrderStatus purchase_order_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quotation_id",referencedColumnName = "id")
    private Quotation quotation_id;



    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;


    @OneToMany(mappedBy = "purchase_order_id", orphanRemoval = true, cascade = CascadeType.ALL)
    List<PurchaseOrderHasModel> purchaseOrderHasModelList ;


    public PurchaseOrder( Integer id, String purchase_order_number, BigDecimal total_amount ){

        //CLASS ID                 = PARAMETER ID
        this.id                    = id;
        this.purchase_order_number = purchase_order_number;
        this.total_amount          = total_amount;

    }


}
