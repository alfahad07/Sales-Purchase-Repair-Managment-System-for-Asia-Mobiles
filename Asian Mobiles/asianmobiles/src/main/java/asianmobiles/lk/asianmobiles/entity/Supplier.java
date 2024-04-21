package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "supplier")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Supplier {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "business_reg_no")
    private String business_reg_no;

    @Column(name = "supplier_company_reg_no")
    private String supplier_company_reg_no;

    @Column(name = "supplier_company_name")
    private String supplier_company_name;

    @Column(name = "address")
    private String address;

    @Column(name = "contact_number")
    private String contact_number;

    @Column(name = "supplier_company_email")
    private String supplier_company_email;

    @Column(name = "supplier_company_staff_name")
    private String supplier_company_staff_name;

    @Column(name = "company_staff_mobile_no")
    private String company_staff_mobile_no;

    @Column(name = "bank_branch_name")
    private String bank_branch_name;

    @Column(name = "bank_account_number")
    private String bank_account_number;

    @Column(name = "account_holder_name")
    private String account_holder_name;

    @Column(name = "arreas_amount")
    private BigDecimal arreas_amount;

    @Column(name = "note")
    private String note;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;



    @ManyToOne(optional = false)
    @JoinColumn(name = "bank_id",referencedColumnName = "id")
    private Bank bank_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_status_id",referencedColumnName = "id")
    private SupplierStatus supplier_status_id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;

    @OneToMany(mappedBy = "supplier_id", orphanRemoval = true, cascade = CascadeType.ALL)
    List<SupplierHasModel> supplierHasModelList ;


    public Supplier( Integer id, String supplier_company_name, SupplierStatus supplier_status_id){

        //CLASS ID                 = PARAMETER ID
        this.id                    = id;
        this.supplier_company_name = supplier_company_name;
        this.supplier_status_id    = supplier_status_id;

    }


}
