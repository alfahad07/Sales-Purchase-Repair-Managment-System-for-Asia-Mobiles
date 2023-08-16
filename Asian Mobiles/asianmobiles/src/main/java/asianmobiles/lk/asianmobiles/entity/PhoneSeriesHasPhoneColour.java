package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "phone_series_has_phone_colour")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class PhoneSeriesHasPhoneColour implements Serializable {


    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "phone_series_id",referencedColumnName = "id")
    private PhoneSeries phone_series_id;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "phone_colour_id",referencedColumnName = "id")
    private PhoneColour phone_colour_id;


}
