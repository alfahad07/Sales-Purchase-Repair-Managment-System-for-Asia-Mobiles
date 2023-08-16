package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity // Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Table(name="user") //Table annotation is used notify to map the class with which table.
@Data //Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@AllArgsConstructor //AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@NoArgsConstructor //NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
public class User {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.
    @Column(name ="id") // Column annotation is used to map or match database table colunm to the data.
    private  Integer id ;

    @Column(name = "username" )
    private  String username ;

    @Column(name = "password" )
    private  String password ;

    @Column(name = "email" )
    private  String email ;

    @Column(name = "status")
    private  Boolean status ;

    @Column(name = "description" )
    private  String description ;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime ;

    @Column(name ="updateddatetime" )
    private  LocalDateTime updateddatetime;

    @Column(name ="deleteddatetime" )
    private  LocalDateTime deleteddatetime;

    @Column(name = "photoname")
    private  String photoname ;

    @Column(name = "photopath")
    private  String photopath ;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany // COZ USER AND ROLE TABLE HAS MANY TO MANY RELATIONSHIP...
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> role;

    public User(Integer id, String username, Employee employee_id, String email, Boolean status) {

        this.id = id;
        this.username = username;
        this.employee_id = employee_id;
        this.email = email;
        this.status = status;

    }

}

