package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "repair")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Repair {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.



    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "repair_number")
    private String repair_number;

    @Column(name = "customer_name")
    private String customer_name;

    @Column(name = "customer_contact_number")
    private String customer_contact_number;

    @Column(name = "total_price")
    private String total_price;

    @Column(name = "paid_amount")
    private String paid_amount;

    @Column(name = "note")
    private String note;



    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;



    @ManyToOne(optional = false)
    @JoinColumn(name = "repair_status_id",referencedColumnName = "id")
    private RepairStatus repair_status_id;



    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "last_updated_user_id",referencedColumnName = "id")
    private User last_updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;


    @OneToMany(mappedBy = "repair_id", orphanRemoval = true, cascade = CascadeType.ALL)
    List<RepairHasItem> repairHasItemList;


   /* public Repair(Integer id, String purchase_order_number, BigDecimal total_amount ){

        //CLASS ID                 = PARAMETER ID
        this.id                    = id;
        this.purchase_order_number = purchase_order_number;
        this.total_amount          = total_amount;

    }*/


}
