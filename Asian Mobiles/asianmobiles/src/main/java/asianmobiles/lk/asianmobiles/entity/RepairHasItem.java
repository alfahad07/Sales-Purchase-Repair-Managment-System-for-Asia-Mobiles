package asianmobiles.lk.asianmobiles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "repair_has_item")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class RepairHasItem implements Serializable {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "repair_id",referencedColumnName = "id")
    @JsonIgnore // USED TO BLOCK READING THE pre_order_id IN PreOrderHasModel TABLE TO BREAK OR STOP THE RECURSION WHILE READING THE INNER TABLE DETAILS.
    private Repair repair_id;

    @Column(name = "item_tag_number")
    private String item_tag_number;

    @Column(name = "model_number")
    private String model_number;

    @Column(name = "model_name")
    private String model_name;

    @Column(name = "serial_number")
    private String serial_number;

    @Column(name = "warrenty_date")
    private LocalDate warrenty_date;

    @Column(name = "repair_fault_note")
    private String repair_fault_note;

    @Column(name = "company_handover_date")
    private LocalDate company_handover_date;

    @Column(name = "receive_date")
    private LocalDate receive_date;

    @Column(name = "repair_cost")
    private BigDecimal repair_cost;


}
