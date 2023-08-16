package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "quotation")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Quotation {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.



    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "quotation_number")
    private String quotation_number;

    @Column(name = "recieved_date")
    private LocalDate recieved_date;

    @Column(name = "expire_date")
    private LocalDate expire_date;

    @Column(name = "note")
    private String note;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;



    @ManyToOne(optional = false)
    @JoinColumn(name = "quotation_request_id",referencedColumnName = "id")
    private QuotationRequest quotation_request_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quotation_status_id",referencedColumnName = "id")
    private QuotationStatus quotation_status_id;



    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;


    @OneToMany(mappedBy = "quotation_id", orphanRemoval = true, cascade = CascadeType.ALL)
    List<QuotationHasModel> quotationHasModelList ;

    public Quotation(Integer id, String quotation_number){

        //CLASS ID            = PARAMETER ID
        this.id               = id;
        this.quotation_number = quotation_number;

    }

}
