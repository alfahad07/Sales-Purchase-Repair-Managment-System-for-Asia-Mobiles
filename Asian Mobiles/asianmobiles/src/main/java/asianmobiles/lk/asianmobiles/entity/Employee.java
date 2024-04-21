package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "employee")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class Employee {

    @Id //persistance API require Primary key so ID annnotation is used to indicate the primaryKey
    @GeneratedValue(strategy = GenerationType.IDENTITY) // GeneratedValue annotation is used to map or to tell the type, ID is an Auto Increament so we need to notify that it is an Auto Increament type.

    @Column(name = "id") // Column annotation is used to map or match database table colunm to the data.
    private Integer id;

    @Column(name = "number")
    private String number;

    @Column(name = "callingname")
    private String callingname;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "nic")
    private String nic;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "land")
    private String land;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob")
    private LocalDate dob ;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_update_datetime")
    private LocalDateTime last_update_datetime;

    @Column(name = "delete_date_time")
    private LocalDateTime delete_date_time;

    @Column(name = "appointment_date")
    private LocalDate appointment_date;


    @ManyToOne // the relationship between Employee table and employee.js status table
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id") //
    private EmployeeStatus employeestatus_id;

    @ManyToOne // the relationship between Employee table and Designation table
    @JoinColumn(name = "designation_id", referencedColumnName = "id") //
    private Designation designation_id;

    @ManyToOne // the relationship between Employee table and CivilStatus table
    @JoinColumn(name = "civilstatus_id", referencedColumnName = "id") //
    private CivilStatus civilstatus_id;


    public  Employee(Integer id, String callingname, String number, String fullname, String nic, String mobile, String email, EmployeeStatus employeestatus_id){

        this.id = id;
        this.callingname = callingname;
        this.number = number;
        this.fullname = fullname;
        this.nic = nic;
        this.mobile = mobile;
        this.email = email;
        this.employeestatus_id = employeestatus_id;

    }


}
