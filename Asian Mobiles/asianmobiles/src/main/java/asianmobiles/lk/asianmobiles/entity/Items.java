package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "items")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Items {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "item_name")
    private String item_name;

    @Column(name = "item_code_number")
    private String item_code_number;

    @Column(name = "iemi_number_1")
    private String iemi_number_1;

    @Column(name = "iemi_number_2")
    private String iemi_number_2;

    @Column(name = "serial_number")
    private String serial_number;

    @Column(name = "note")
    private String note;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_updated_datetime")
    private LocalDateTime last_updated_datetime;

    @JoinColumn(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;


    @ManyToOne
    @JoinColumn(name = "item_status_id",  referencedColumnName = "id")
    private ItemStatus item_status_id;

    @ManyToOne
    @JoinColumn(name = "model_id",  referencedColumnName = "id")
    private Model model_id;

    @ManyToOne
    @JoinColumn(name = "added_user_id", referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id",referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;

}
