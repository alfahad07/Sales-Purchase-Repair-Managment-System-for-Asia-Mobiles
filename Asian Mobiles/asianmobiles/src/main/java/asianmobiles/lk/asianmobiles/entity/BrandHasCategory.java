package asianmobiles.lk.asianmobiles.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

// Entity annotation is used to convert as persistance API coz to map the classes to the table in the database.
@Entity

//Table annotation is used notify to map the class with which table.
@Table(name = "brand_has_category")

//Data annotation is used to automate functions like getters, setters, toSrting etc... It is needed here coz the variables are private
@Data

//NoArgsConstructor annotation is used to create noArgsConstraction (default constructor) automatically without coding.
@NoArgsConstructor

//AllArgsConstructor annotation is used to create allArgsConstraction (customized constructor) automatically without coding.
@AllArgsConstructor

public class BrandHasCategory implements Serializable {


    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "brand_id",referencedColumnName = "id")
    private Brand brand_id;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id",referencedColumnName = "id")
    private Category category_id;


}
