package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Customer;

import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.CustomerRepository;
import asianmobiles.lk.asianmobiles.repository.CustomerStatusRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CustomerRepository customerDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CustomerStatusRepository customerStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private UserRepository userDao;

    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Customer getCustomerByPVId (@PathVariable("id") int id){

        return customerDao.getReferenceById(id);

    }

    // creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //creating a function to display the UserManagement UI.
    public ModelAndView customerUi(){

        // create ModelAndView object called userui
        ModelAndView customerui =  new ModelAndView();

        //set user.html
        customerui.setViewName("Customer_Management.html");

        return customerui;


    }

    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<Customer> findAll(){

        return customerDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

    }



    @GetMapping(value = "/list", produces = "application/json")
    public List<Customer> customerList () {

        return customerDao.list();

    }



    //Create delete mapping to delete Customer by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteCustomer( @RequestBody Customer customer ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "CUSTOMER");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check wether the employee.js exist in the database
            Customer existCustomer = customerDao.getReferenceById(customer.getId());

            // Creating a function to delete the employee.js from the database after checking the employee.js's existance.
            if(existCustomer != null){
                try{

                    //set auto insert Values
                    existCustomer.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the employee.js
                    existCustomer.setCustomer_status_id(customerStatusDao.getReferenceById(2)); // Setting employeeStatus to deleted once the delete is done
                    existCustomer.setDeleted_user_id(loggedUser);

                    customerDao.save(existCustomer);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Customer Not Available";

            }


        }else {

            return "Customer Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD CUSTOMER [/customer - POST]
    @PostMapping
    public String addCustomer( @RequestBody Customer customer){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "CUSTOMER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Customer extCustomerNic = customerDao.getByNIC(customer.getNic());
            if ( extCustomerNic != null ){

                return "Customer insert not completed : NIC Duplicated (NIC already Exist)";

            }

            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE.
            Customer extCustomerEmail = customerDao.findCustomerByEmail(customer.getEmail());
            if ( extCustomerEmail != null ){

                return "Customer insert not completed : Email Duplicated (Email already Exist)";

            }

            try {

                //SET AUTO INSERT VALUE
                customer.setAdded_datetime(LocalDateTime.now());
                customer.setAdded_user_id(loggedUser);


                //SAVE THE CHANGES
                customerDao.save(customer);
                return "0";

            }catch (Exception ex){

                return "Customer Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Customer insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/employee - POST]
    @PutMapping
    public String updateCustomer( @RequestBody Customer customer ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "CUSTOMER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Customer extEmpByNIC = customerDao.getByNIC(customer.getNic());
            if (extEmpByNIC != null && customer.getId() != extEmpByNIC.getId()) {

                return "Customer update not completed : NIC already Exist";

            }


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Customer extEmpByEmail = customerDao.findCustomerByEmail(customer.getEmail());
            if (extEmpByEmail != null && customer.getId() != extEmpByEmail.getId()) {

                return "Customer update not completed : E-Mail already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                customer.setLast_updated_datetime(LocalDateTime.now());
                customer.setUpdated_user_id(loggedUser);

                //SAVE THE CHANGES
                customerDao.save(customer);

                return "0";

            }catch (Exception ex){

                return "Customer update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Customer update not completed : You dont have access";

        }

    }

}
