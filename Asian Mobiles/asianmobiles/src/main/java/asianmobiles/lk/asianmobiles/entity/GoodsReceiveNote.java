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
@Table(name = "goods_receive_note")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class GoodsReceiveNote {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.



    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "grn_code")
    private String grn_code;

    @Column(name = "bill_invoice_number")
    private String bill_invoice_number;

    @Column(name = "bill_date")
    private LocalDate bill_date;

    @Column(name = "goods_receive_date")
    private LocalDate goods_receive_date;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "tax")
    private BigDecimal tax;

    @Column(name = "net_total_amount")
    private BigDecimal net_total_amount;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "note")
    private String note;


    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;


    //  forieng keys
    @ManyToOne(optional = false)
    @JoinColumn(name = "goods_receive_note_status_id",referencedColumnName = "id")
    private GoodsReceiveNoteStatus goods_receive_note_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id",referencedColumnName = "id")
    private PurchaseOrder purchase_order_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;



    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;


    @OneToMany(mappedBy = "goods_receive_note_id", orphanRemoval = true, cascade = CascadeType.ALL)
    List<GoodsReceiveNoteHasModel> goodsReceiveNoteHasModelList ;


    public GoodsReceiveNote(Integer id, String grn_code){

        //CLASS ID                  = PARAMETER ID
        this.id                     = id;
        this.grn_code               = grn_code;

    }

}
