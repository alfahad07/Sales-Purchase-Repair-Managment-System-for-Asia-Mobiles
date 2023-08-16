package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "model")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Model {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "model_name")
    private String model_name;

    @Column(name = "model_number")
    private String model_number;

    @Column(name = "sales_price")
    private BigDecimal sales_price;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "profit_rate")
    private BigDecimal profit_rate;

    @Column(name = "max_discount_rate")
    private BigDecimal max_discount_rate;

    @Column(name = "min_discount_rate")
    private BigDecimal min_discount_rate;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "updated_datetime")
    private LocalDateTime updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @Column(name = "note")
    private String note;



    @ManyToOne
    @JoinColumn(name = "phone_model_name_id", referencedColumnName = "id")
    private PhoneModel phone_model_name_id;

    @ManyToOne
    @JoinColumn(name = "model_status_id",referencedColumnName = "id")
    private ModelStatus model_status_id;

    @ManyToOne
    @JoinColumn(name = "brand_id",referencedColumnName = "id")
    private Brand brand_id;

    @ManyToOne
    @JoinColumn(name = "capacity_id",referencedColumnName = "id")
    private Capacity capacity_id;

    @ManyToOne
    @JoinColumn(name = "sub_catergory_id",referencedColumnName = "id")
    private SubCategory sub_catergory_id;



    @ManyToOne
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;



    public Model( Integer id, String model_number, String model_name, BigDecimal sales_price ){

        //CLASS ID        = PARAMETER ID
        this.id           = id;
        this.model_number = model_number;
        this.model_name   = model_name;
        this.sales_price  = sales_price;

    }


}
