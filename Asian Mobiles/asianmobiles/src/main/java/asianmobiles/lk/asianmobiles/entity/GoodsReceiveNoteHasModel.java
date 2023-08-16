package asianmobiles.lk.asianmobiles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

// Entity annotation is used to convert as persistence API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "goods_receive_note_has_model")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstruction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstruction (customized constructor) automatically without coding.
@AllArgsConstructor

public class GoodsReceiveNoteHasModel implements Serializable {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "goods_receive_note_id",referencedColumnName = "id")
    @JsonIgnore // USED TO BLOCK READING THE goods_receive_note_id IN GoodsReceiveNoteHasModel TABLE TO BREAK OR STOP THE RECURSION WHILE READING THE INNER TABLE DETAILS.
    private GoodsReceiveNote goods_receive_note_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "model_id",referencedColumnName = "id")
    private Model model_id;


    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @Column(name = "ordered_quantity")
    private Integer ordered_quantity;

    @Column(name = "received_quantity")
    private Integer received_quantity;

    @Column(name = "line_amount")
    private BigDecimal line_amount;


}
