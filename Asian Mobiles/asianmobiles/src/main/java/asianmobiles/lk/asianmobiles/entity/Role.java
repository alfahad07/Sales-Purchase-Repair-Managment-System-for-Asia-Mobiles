package asianmobiles.lk.asianmobiles.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity // Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Table(name="role") //Table annotation is used notify to map the class with which table.
@Data //Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@AllArgsConstructor //AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@NoArgsConstructor //NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
public class Role {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name ="id") // Column annotation is used to map or match database table colunm to the data.
    private  Integer id ;

    @Column(name = "name" )
    private  String name ;

}