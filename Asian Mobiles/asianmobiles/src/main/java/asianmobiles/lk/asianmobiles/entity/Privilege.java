package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "privilage")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column (name = "sel")
    private Boolean sel;

    @Column (name = "ins")
    private Boolean ins;

    @Column (name = "upd")
    private Boolean upd;

    @Column (name = "del")
    private Boolean del;

    @Column (name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column (name = "last_update_datetime")
    private LocalDateTime last_update_datetime;

    @Column (name = "delete_datetime")
    private LocalDateTime delete_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id",referencedColumnName = "id")
    private Role role_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "module_id",referencedColumnName = "id")
    private Module module_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id",referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "last_updated_user_id",referencedColumnName = "id")
    private User last_updated_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id",referencedColumnName = "id")
    private User deleted_user_id;

}
